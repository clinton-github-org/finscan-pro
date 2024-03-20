#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import 'source-map-support/register';
import { DistributionStack } from '../lib/distribution-stack';
import { InfrastructureStack } from '../lib/infrastructure-stack';
import { getAccount, getBucket, getRegion, staticValues } from '../utilities/getCDKPropValues';

const app = new cdk.App();
const infrastructureStack = new InfrastructureStack(app, 'InfrastructureStack', {
  env: { account: getAccount(), region: getRegion() },
  bucketName: getBucket(),
  staticValues
});

const distributionStack = new DistributionStack(app, 'DistributionStack', {
  env: { account: getAccount(), region: getRegion() },
  requestApi: infrastructureStack.requestApi,
  bucket: infrastructureStack.bucket,
  documentUploadsBucket: infrastructureStack.documentUploadsBucket,
  staticValues
});