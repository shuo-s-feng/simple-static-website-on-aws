#!/usr/bin/env node
import {
	CloudFrontWebDistribution,
	CloudFrontWebDistributionProps,
	OriginAccessIdentity,
	SSLMethod,
	SecurityPolicyProtocol,
} from '@aws-cdk/aws-cloudfront';
import { BucketEncryption } from '@aws-cdk/aws-s3';
import { BucketDeployment, Source } from '@aws-cdk/aws-s3-deployment';
import { RemovalPolicy } from '@aws-cdk/core';
import { Construct } from '@aws-cdk/core';
import {
	ARecord,
	AaaaRecord,
	RecordTarget,
	HostedZone,
} from '@aws-cdk/aws-route53';
import { CloudFrontTarget } from '@aws-cdk/aws-route53-targets/lib';

import { WebsiteBucket } from './website-bucket';

export interface WebsiteProps {
	domainName?: string;
	domainCertificateArn?: string;
	sourcePath: string;
}

export class Website extends Construct {
	private readonly originAccessId: OriginAccessIdentity;
	readonly bucket: WebsiteBucket;
	readonly distribution: CloudFrontWebDistribution;

	constructor(parent: Construct, name: string, props: WebsiteProps) {
		super(parent, name);

		const { domainName, domainCertificateArn, sourcePath } = props;

		// Origin Access Identity to restrict access to the website bucket
		this.originAccessId = new OriginAccessIdentity(
			this,
			'WebsiteOriginAccessIdentity',
		);

		// S3 static website bucket
		this.bucket = new WebsiteBucket(this, 'WebsiteBucket', {
			websiteIndexDocument: 'index.html',
			websiteErrorDocument: 'index.html',
			publicReadAccess: false,
			removalPolicy: RemovalPolicy.RETAIN,
			encryption: BucketEncryption.S3_MANAGED,
			originAccessId: this.originAccessId,
		});

		// Props for the CloudFront distribution
		let distributionProps: CloudFrontWebDistributionProps = {
			originConfigs: [
				{
					s3OriginSource: {
						originAccessIdentity: this.originAccessId,
						s3BucketSource: this.bucket,
					},
					behaviors: [{ isDefaultBehavior: true }],
				},
			],
			errorConfigurations: [
				{
					errorCode: 404,
					responseCode: 200,
					responsePagePath: '/index.html',
				},
			],
		};

		if (domainName && domainCertificateArn) {
			distributionProps = {
				...distributionProps,
				aliasConfiguration: {
					acmCertRef: domainCertificateArn,
					names: [domainName],
					sslMethod: SSLMethod.SNI,
					securityPolicy: SecurityPolicyProtocol.TLS_V1_2_2019,
				},
			};
		}

		// CloudFront distribution that caches and serves website bucket content with custom domain
		this.distribution = new CloudFrontWebDistribution(
			this,
			'WebsiteDistribution',
			distributionProps,
		);

		if (domainName && domainCertificateArn) {
			// Hosted Zone for the website custom domain
			const hostedZone = HostedZone.fromLookup(
				this,
				'WebsiteHostedZone',
				{
					domainName,
				},
			);

			// Route53 A record for the CloudFront distribution
			new ARecord(this, 'WebsiteARecord', {
				recordName: domainName,
				target: RecordTarget.fromAlias(
					new CloudFrontTarget(this.distribution),
				),
				zone: hostedZone,
			});

			// Route53 AAA record for the CloudFront distribution
			new AaaaRecord(this, 'WebsiteAAAARecord', {
				recordName: domainName,
				target: RecordTarget.fromAlias(
					new CloudFrontTarget(this.distribution),
				),
				zone: hostedZone,
			});
		}

		// Upload local website content to S3 bucket
		new BucketDeployment(this, 'WesbiteBucketDeployment', {
			sources: [Source.asset(sourcePath)],
			destinationBucket: this.bucket,
			distribution: this.distribution,
			distributionPaths: ['/*'],
		});
	}
}
