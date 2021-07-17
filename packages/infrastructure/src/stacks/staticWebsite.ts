#!/usr/bin/env node
import { App, Stack, StackProps } from '@aws-cdk/core';
import { Website } from '../constructs/website';

export interface StaticWebsiteStackProps extends StackProps {
	domainName?: string;
	domainCertificateArn?: string;
}

export class StaticWebsiteStack extends Stack {
	constructor(parent: App, name: string, props: StaticWebsiteStackProps) {
		super(parent, name, props);

		const { domainName, domainCertificateArn } = props;

		new Website(this, 'WebsiteConstruct', {
			domainName,
			domainCertificateArn,
			sourcePath: '../website/dist',
		});
	}
}
