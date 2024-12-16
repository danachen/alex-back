import { APIGatewayProxyHandler } from 'aws-lambda';
import { createLambdaResponse } from '../../utils/lambda-middleware';
import users from '../../services/users';

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const { token } = event.pathParameters || {};
    
    if (!token) {
      return createLambdaResponse(400, { error: 'Verification token is required' });
    }

    const result = await users.verify(token);
    
    if (result) {
      return createLambdaResponse(200, { message: 'Email verified successfully' });
    } else {
      return createLambdaResponse(400, { error: 'Invalid or expired verification token' });
    }
  } catch (error) {
    console.error('Error in verify handler:', error);
    return createLambdaResponse(500, { error: 'Internal server error' });
  }
};
