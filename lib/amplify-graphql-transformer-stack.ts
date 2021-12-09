import * as cdk from "@aws-cdk/core";
import { GraphQlApiStack } from "./graphql-api.stack";
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class AmplifyGraphqlTransformerStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const graphqlApiStack = new GraphQlApiStack(this, "GraphQlApiStack", {
      parameters: {
        cognitoUserPoolId: "TODO",
        authenticatedRoleName: "TODO",
        unauthenticatedRoleName: "TODO",
        s3DeploymentBucket: "TODO",
        s3DeploymentRootKey: "TODO",
      },
    });
  }
}
