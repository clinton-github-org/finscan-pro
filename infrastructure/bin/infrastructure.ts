#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import 'source-map-support/register';
import { InfrastructureStack } from '../lib/infrastructure-stack';
import { getAccount, getBucket, getRegion } from '../utilities/getCDKPropValues';



const app = new cdk.App();
new InfrastructureStack(app, 'InfrastructureStack', {
  env: { account: getAccount(), region: getRegion() },
  bucketName: getBucket()
});