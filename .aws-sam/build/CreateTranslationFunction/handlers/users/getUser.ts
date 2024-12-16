import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { createLambdaResponse } from '../../utils/lambda-middleware';
import { getUserById } from '../../services/userService';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const userId = event.pathParameters?.id;
    
    if (!userId) {
      return createLambdaResponse(400, { error: 'User ID is required' });
    }

    const user = await getUserById(userId);
    
    if (!user) {
      return createLambdaResponse(404, { error: 'User not found' });
    }

    return createLambdaResponse(200, user);
  } catch (error) {
    console.error('Error in getUser:', error);
    return createLambdaResponse(500, { error: 'Internal server error' });
  }
};
