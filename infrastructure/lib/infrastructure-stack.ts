import * as cdk from 'aws-cdk-lib';
import { CfnOutput, Duration } from 'aws-cdk-lib';
import { LambdaRestApi } from 'aws-cdk-lib/aws-apigateway';
import { AllowedMethods, Distribution, OriginAccessIdentity } from 'aws-cdk-lib/aws-cloudfront';
import { RestApiOrigin, S3Origin } from 'aws-cdk-lib/aws-cloudfront-origins';
import { Alias, Code, Function, Runtime, SnapStartConf } from 'aws-cdk-lib/aws-lambda';
import { BlockPublicAccess, Bucket, BucketEncryption, ObjectOwnership } from 'aws-cdk-lib/aws-s3';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { Construct } from 'constructs';

export interface InfrastructureStackProps {
  env: { account: string; region: string; },
  bucketName: string;
  requestLambdaName: string;
  requestLambdaHandler: string;
  requestLambdaPath: string;
  apiGatewayName: string;
  bucketAssetPath: string;
}

export class InfrastructureStack extends cdk.Stack {
  readonly outputs: Array<CfnOutput>;
  constructor(scope: Construct, id: string, props: InfrastructureStackProps) {
    super(scope, id, props);

    const bucket: Bucket = new Bucket(this, props.bucketName, {
      bucketName: props.bucketName,
      publicReadAccess: false,
      blockPublicAccess: this.getPublicBlockAccess(),
      encryption: BucketEncryption.S3_MANAGED,
      objectOwnership: ObjectOwnership.BUCKET_OWNER_PREFERRED
    });

    const originAccessIdentity = new OriginAccessIdentity(this, 'OriginAccessIdentity', {
      comment: 'Identity for serving static files'
    });
    bucket.grantRead(originAccessIdentity);

    const requestLambda = new Function(this, props.requestLambdaName, {
      code: Code.fromAsset(props.requestLambdaPath),
      runtime: Runtime.JAVA_17,
      handler: props.requestLambdaHandler,
      snapStart: SnapStartConf.ON_PUBLISHED_VERSIONS,
      functionName: props.requestLambdaName,
      description: 'Lambda used to accept requests from frontend',
      memorySize: 500,
      timeout: Duration.seconds(30)
    });

    const alias = new Alias(this, 'Request-Lambda-ALias', {
      aliasName: 'Prod',
      version: requestLambda.latestVersion,
    });

    bucket.grantReadWrite(requestLambda);

    const requestApi: LambdaRestApi = new LambdaRestApi(this, props.apiGatewayName, {
      handler: requestLambda,
      binaryMediaTypes: ['*/*'],
      restApiName: props.apiGatewayName,
      description: "Rest API facing frontend",
      proxy: true,
    });

    const distribution = new Distribution(this, 'finscan-pro-cfn-distribution', {
      additionalBehaviors: {
        '/api/*': {
          origin: new RestApiOrigin(requestApi),
          allowedMethods: AllowedMethods.ALLOW_ALL
        }
      },
      defaultBehavior: {
        origin: new S3Origin(bucket),
        allowedMethods: AllowedMethods.ALLOW_GET_HEAD,
      },
      defaultRootObject: 'index.html',
    });

    const bucketDeployment: BucketDeployment = new BucketDeployment(this, 'Finscan-Pro-Bucket-Deployment', {
      destinationBucket: bucket,
      sources: [Source.asset(props.bucketAssetPath)],
      distribution,
      distributionPaths: ['/*']
    });

    this.outputs = [
      new CfnOutput(this, 'UI_URL', {
        value: distribution.domainName
      }),
    ];
  }

  private getPublicBlockAccess(): BlockPublicAccess {
    const publicAccess = new BlockPublicAccess({
      blockPublicAcls: true,
      blockPublicPolicy: true,
      ignorePublicAcls: true,
      restrictPublicBuckets: true
    });
    return publicAccess;
  }
}
