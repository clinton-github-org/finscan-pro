import * as cdk from 'aws-cdk-lib';
import { CfnOutput } from 'aws-cdk-lib';
import { LambdaRestApi } from 'aws-cdk-lib/aws-apigateway';
import { AllowedMethods, Distribution } from 'aws-cdk-lib/aws-cloudfront';
import { RestApiOrigin, S3Origin } from 'aws-cdk-lib/aws-cloudfront-origins';
import { Bucket, CorsRule, HttpMethods } from 'aws-cdk-lib/aws-s3';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { Construct } from 'constructs';

export interface DistributionStackProps extends cdk.StackProps {
    env: { account: string; region: string; },
    bucket: Bucket;
    requestApi: LambdaRestApi;
    staticValues: any;
    documentUploadsBucket: Bucket;
}

export class DistributionStack extends cdk.Stack {
    readonly outputs: Array<CfnOutput>;
    constructor(scope: Construct, id: string, props: DistributionStackProps) {
        super(scope, id, props);

        const distribution = new Distribution(this, 'finscan-pro-cfn-distribution', {
            additionalBehaviors: {
                '/api/*': {
                    origin: new RestApiOrigin(props.requestApi),
                    allowedMethods: AllowedMethods.ALLOW_ALL
                }
            },
            defaultBehavior: {
                origin: new S3Origin(props.bucket),
                allowedMethods: AllowedMethods.ALLOW_GET_HEAD,
            },
            defaultRootObject: 'index.html',
        });

        const bucketDeployment: BucketDeployment = new BucketDeployment(this, 'Finscan-Pro-Bucket-Deployment', {
            destinationBucket: props.bucket,
            sources: [Source.asset(props.staticValues.bucketAssetPath)],
            distribution,
            distributionPaths: ['/*'],
        });

        props.documentUploadsBucket.addCorsRule(this.getCorsRule(distribution.domainName));

        this.outputs = [
            new CfnOutput(this, 'UI_URL', {
                value: distribution.domainName
            }),
        ];
    }

    private getCorsRule(distributionName: string): CorsRule {
        return (
            {
                allowedOrigins: [`*`],
                allowedHeaders: [`${distributionName}*`],
                allowedMethods: [HttpMethods.PUT, HttpMethods.POST, HttpMethods.DELETE, HttpMethods.GET, HttpMethods.HEAD],
                exposedHeaders: ["Access-Control-Allow-Origin",
                    "ETag"],
                maxAge: 3000
            }
        );
    }
}
