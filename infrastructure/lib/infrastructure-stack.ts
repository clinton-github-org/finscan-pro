import * as cdk from 'aws-cdk-lib';
import { CfnOutput, Duration } from 'aws-cdk-lib';
import { LambdaRestApi } from 'aws-cdk-lib/aws-apigateway';
import { CloudFrontWebDistribution } from 'aws-cdk-lib/aws-cloudfront';
import { Code, Function, Runtime, SnapStartConf } from 'aws-cdk-lib/aws-lambda';
import { BlockPublicAccess, Bucket, BucketEncryption, ObjectOwnership } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';

export interface InfrastructureStackProps {
  env: { account: string; region: string; },
  bucketName: string;
  requestLambdaName: string;
  requestLambdaHandler: string;
  requestLambdaPath: string;
  apiGatewayName: string;
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

    const cloudFrontDistribtion = new CloudFrontWebDistribution(this, 'finscan-pro-cfn-distribution', {
      originConfigs: [
        {
          s3OriginSource: {
            s3BucketSource: bucket,
          },
          behaviors: [
            {
              isDefaultBehavior: true
            }
          ]
        }
      ]
    });

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

    bucket.grantReadWrite(requestLambda);

    const requestApi = new LambdaRestApi(this, props.apiGatewayName, {
      handler: requestLambda,
      binaryMediaTypes: ['*/*'],
      restApiName: props.apiGatewayName,
      description: "Rest API facing frontend",
      proxy: true
    });

    this.outputs = [
      new CfnOutput(this, 'BUCKET_NAME', {
        value: bucket.bucketName
      }),
      new CfnOutput(this, 'UI_URL', {
        value: cloudFrontDistribtion.distributionDomainName
      }),
      new CfnOutput(this, 'LAMBDA', {
        value: requestLambda.functionName
      })
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
