import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

export async function main(event, context) {
    console.log('do we make it here');
    const authProvider = event.requestContext.identity;
    console.log('authProvider: ', authProvider);
    const params = {
        TableName: process.env.tableName,
        // 'Key' defines the partition key and sort key of the item to be retrieved
        // - 'userId': Identity Pool identity id of the authenticated user
        // - 'sneakerId': path parameter
        Key: {
            userId: event.requestContext.identity.cognitoIdentityId,
            sneakerId: event.pathParameters.id
        }
    };

    try {
        const result = await dynamoDbLib.call("get", params);
        console.log('result: ', result);
        if (result.Item) {
            // Return the retrieved item
            return success(result.Item);
        } else {
            return failure({ status: false, error: "Item not found." });
        }
    } catch (e) {
        return failure({ status: false });
    }
}