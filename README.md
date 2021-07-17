## Introduction
This repository is for developers to easily create and deploy a React app on AWS S3 + CloudFront.

## Prerequisites

1. Follow [AWS CLI tutorial](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html) to install and configure AWS CLI.
1. Follow the `Prerequisites` section of [AWS CDK tutorial](https://docs.aws.amazon.com/cdk/latest/guide/getting_started.html) to install and configure AWS CDK.
1. Create a system environment variable `AWS_ACCOUNT` in your local machine with your AWS account number. E.g. `export AWS_ACCOUNT="1234567890"`
1. (Optional) Create your custom domain on AWS Route53 based on [tutorial](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/dns-configuring.html), and create a system environment variable `DOMAIN_NAME` with your custom domain. E.g. `export DOMAIN_NAME="github.com"`
1. (Optional) Create your SSL/TLS certificate on AWS ACM based on [tutorial](https://docs.aws.amazon.com/acm/latest/userguide/gs-acm-request-public.html), and create a system environment variable `DOMAIN_CERT_ARN` with your certificate ARN. E.g. `DOMAIN_CERT_ARN="arn:aws:acm:us-east-1......."`

## Local Testing

Run `npm start` to run a local instance of the React app

## Deploy to AWS

Run `./deploy` to deploy the React app to AWS
