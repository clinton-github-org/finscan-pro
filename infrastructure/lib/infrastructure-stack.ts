import * as cdk from 'aws-cdk-lib';
import { CfnOutput, Duration } from 'aws-cdk-lib';
import { LambdaRestApi } from 'aws-cdk-lib/aws-apigateway';
import { CloudFrontWebDistribution, OriginAccessIdentity } from 'aws-cdk-lib/aws-cloudfront';
import { Code, Function, Runtime, SnapStartConf } from 'aws-cdk-lib/aws-lambda';
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

    const bucketDeployment: BucketDeployment = new BucketDeployment(this, 'Finscan-Pro-Bucket-Deployment', {
      destinationBucket: bucket,
      sources: [Source.asset(props.bucketAssetPath)],
    });

    const originAccessIdentity = new OriginAccessIdentity(this, 'OriginAccessIdentity', {
      comment: 'Identity for serving static files'
    });
    bucket.grantRead(originAccessIdentity);

    const cloudFrontDistribtion = new CloudFrontWebDistribution(this, 'finscan-pro-cfn-distribution', {
      defaultRootObject: 'index.html',
      originConfigs: [
        {
          s3OriginSource: {
            s3BucketSource: bucket,
            originAccessIdentity,
          },
          behaviors: [
            {
              isDefaultBehavior: true
            }
          ]
        }
      ],
      errorConfigurations: [
        {
          errorCode: 403,
          responseCode: 200,
          responsePagePath: '/index.html'
        },
        {
          errorCode: 404,
          responseCode: 200,
          responsePagePath: '/index.html'
        },
        {
          errorCode: 500,
          responseCode: 200,
          responsePagePath: '/index.html'
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
      new CfnOutput(this, 'UI_URL', {
        value: cloudFrontDistribtion.distributionDomainName
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
