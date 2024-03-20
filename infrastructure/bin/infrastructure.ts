#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import 'source-map-support/register';
import { InfrastructureStack } from '../lib/infrastructure-stack';
import { getAccount, getBucket, getRegion, staticValues } from '../utilities/getCDKPropValues';

const app = new cdk.App();
const infrastructureStack = new InfrastructureStack(app, 'InfrastructureStack', {
  env: { account: getAccount(), region: getRegion() },
  bucketName: getBucket(),
  staticValues
});