#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import 'source-map-support/register';
import { InfrastructureStack } from '../lib/infrastructure-stack';
import { apiGatewayName, getAccount, getBucket, getRegion, requestLambdaHandler, requestLambdaName, requestLambdaPath } from '../utilities/getCDKPropValues';

const app = new cdk.App();
new InfrastructureStack(app, 'InfrastructureStack', {
  env: { account: getAccount(), region: getRegion() },
  bucketName: getBucket(),
  requestLambdaName,
  requestLambdaHandler,
  requestLambdaPath,
  apiGatewayName
});