# AWS Lambda - Bluehost Screenshot Service

![Deploy to Lambda](https://github.com/bluehost/lambda-bluehost-screenshot-service/workflows/Deploy%20to%20Lambda/badge.svg)

An AWS Lambda function designed to return a screenshot for a given URL.

## Usage

Visit `https://d7j9v3snm8.execute-api.us-west-2.amazonaws.com/v1?url=:url` where `:url` is an encoded URL.

For example: 

```php
https://d7j9v3snm8.execute-api.us-west-2.amazonaws.com/v1?url=https%3A%2F%2Fwww.bluehost.com
```

## Install

- Run `npm install`

## Local Testing

- Run `node local.js`

## Deployment

By default, this repository is setup to auto-deploy when a new commit is made.

However, if you wish to push changes from your local machine while testing, you can simply run the `npm run deploy` command. 

In order for local deployments to actually work, you will need to:

- Install the [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html) tool.
- Create a [named profile](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-profiles.html) named `bluehost`. 
