import * as cdk from 'aws-cdk-lib';
import { CfnOutput, Duration } from 'aws-cdk-lib';
import { LambdaRestApi } from 'aws-cdk-lib/aws-apigateway';
import { AllowedMethods, Distribution, OriginAccessIdentity } from 'aws-cdk-lib/aws-cloudfront';
import { RestApiOrigin, S3Origin } from 'aws-cdk-lib/aws-cloudfront-origins';
import { Alias, Code, Function, Runtime, SnapStartConf } from 'aws-cdk-lib/aws-lambda';
import { BlockPublicAccess, Bucket, BucketEncryption, CorsRule, HttpMethods, ObjectOwnership } from 'aws-cdk-lib/aws-s3';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { Construct } from 'constructs';

export interface InfrastructureStackProps {
  env: { account: string; region: string; },
  bucketName: string;
  staticValues: any
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

    const documentUploadsBucket: Bucket = new Bucket(this, props.staticValues.documentUploadsBucket, {
      bucketName: props.staticValues.documentUploadsBucket,
      publicReadAccess: false,
      blockPublicAccess: this.getPublicBlockAccess(),
      encryption: BucketEncryption.S3_MANAGED,
      objectOwnership: ObjectOwnership.BUCKET_OWNER_PREFERRED,
      cors: [this.getCorsRule()],
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      lifecycleRules: [
        {
          expiration: Duration.days(1),
          enabled: true
        }
      ]
    });

    const originAccessIdentity = new OriginAccessIdentity(this, 'OriginAccessIdentity', {
      comment: 'Identity for serving static files'
    });
    bucket.grantRead(originAccessIdentity);

    const requestLambda = new Function(this, props.staticValues.requestLambdaName, {
      code: Code.fromAsset(props.staticValues.requestLambdaPath),
      runtime: Runtime.JAVA_17,
      handler: props.staticValues.requestLambdaHandler,
      snapStart: SnapStartConf.ON_PUBLISHED_VERSIONS,
      functionName: props.staticValues.requestLambdaName,
      description: 'Lambda used to accept requests from frontend',
      memorySize: 500,
      timeout: Duration.seconds(30)
    });

    documentUploadsBucket.grantReadWrite(requestLambda);

    const alias = new Alias(this, 'Request-Lambda-ALias', {
      aliasName: 'Prod',
      version: requestLambda.currentVersion,
    });

    const requestApi: LambdaRestApi = new LambdaRestApi(this, props.staticValues.apiGatewayName, {
      handler: requestLambda,
      binaryMediaTypes: ['*/*'],
      restApiName: props.staticValues.apiGatewayName,
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
      sources: [Source.asset(props.staticValues.bucketAssetPath)],
      distribution,
      distributionPaths: ['/*'],
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

  private getCorsRule(): CorsRule {
    return (
      {
        allowedOrigins: [`*`],
        allowedHeaders: ['*'],
        allowedMethods: [HttpMethods.PUT, HttpMethods.POST, HttpMethods.DELETE, HttpMethods.GET, HttpMethods.HEAD],
        exposedHeaders: ["Access-Control-Allow-Origin",
          "ETag"],
        maxAge: 3000
      }
    );
  }
}
