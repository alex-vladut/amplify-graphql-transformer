import * as cdk from "@aws-cdk/core";

import * as cfninc from "@aws-cdk/cloudformation-include";

import { readdirSync } from "fs";
import { normalize, join } from "path";

export class GraphQlApiStack extends cdk.NestedStack {
  public readonly graphqlApiId: string;
  public readonly graphqlApiEndpoint: string;

  constructor(scope: cdk.Construct, id: string, props?: cdk.NestedStackProps) {
    super(scope, id, props);

    new cdk.CfnParameter(this, "cognitoUserPoolId", {
      type: "String",
      description: "Auth Cognito User Pool ID",
    });
    new cdk.CfnParameter(this, "authenticatedRoleName", {
      type: "String",
      description:
        "Reference to the name of the Auth Role created for the project",
    });
    new cdk.CfnParameter(this, "unauthenticatedRoleName", {
      type: "String",
      description:
        "Reference to the name of the Unauthenticated Role created for the project",
    });
    new cdk.CfnParameter(this, "s3DeploymentBucket", {
      type: "String",
      description: "S3 bucket containing all the Appsync deployment artefacts",
    });
    new cdk.CfnParameter(this, "s3DeploymentRootKey", {
      type: "String",
      description: "S3 deployment rook key",
    });

    const apiNestedStacks = readdirSync(
      normalize(join(__dirname, "build", "stacks"))
    ).reduce(
      (aggregate, file) => ({
        ...aggregate,
        [file.replace(".json", "")]: {
          templateFile: normalize(join(__dirname, "build", "stacks", file)),
          preserveLogicalIds: true,
          parameters: {},
        },
      }),
      {}
    );
    const graphQlApiStack = new cfninc.CfnInclude(this, "GraphqlApi", {
      templateFile: normalize(
        join(__dirname, "build", "appsync.cloudformation.json")
      ),
      preserveLogicalIds: true,
      loadNestedStacks: apiNestedStacks,
      parameters: {
        AppSyncApiName: "tikal",
        AuthCognitoUserPoolId: props?.parameters?.cognitoUserPoolId,
        unauthRoleName: props?.parameters?.unauthenticatedRoleName,
        authRoleName: props?.parameters?.authenticatedRoleName,
        S3DeploymentBucket: props?.parameters?.s3DeploymentBucket,
        S3DeploymentRootKey: props?.parameters?.s3DeploymentRootKey,
      },
    });
    this.graphqlApiId = graphQlApiStack.getOutput("GraphQLAPIIdOutput").value;
    this.graphqlApiEndpoint = graphQlApiStack.getOutput(
      "GraphQLAPIEndpointOutput"
    ).value;
  }
}
