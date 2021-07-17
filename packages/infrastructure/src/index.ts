#!/usr/bin/env node
import { App } from '@aws-cdk/core';
import { env } from 'process';
import { StaticWebsiteStack } from './stacks/staticWebsite';

const app = new App();

if (env.AWS_ACCOUNT) {
	new StaticWebsiteStack(app, 'StaticWebsite', {
		domainName: env.DOMAIN_NAME,
		domainCertificateArn: env.DOMAIN_CERT_ARN,
		env: {
			account: env.AWS_ACCOUNT,
			region: 'us-east-1',
		},
	});
}
