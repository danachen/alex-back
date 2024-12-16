import { APIGatewayProxyHandler } from 'aws-lambda';
import { createLambdaResponse } from '../../utils/lambda-middleware';
import { LoggedInUser } from '../../types';
import login from '../../services/login';

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    if (!event.body) {
      return createLambdaResponse(400, { error: 'Missing request body' });
    }

    const { email, password } = JSON.parse(event.body);

    if (!email || !password) {
      return createLambdaResponse(400, { error: 'Email and password are required' });
    }

    const loggedInUser: LoggedInUser = await login.login(email, password);
    return createLambdaResponse(200, loggedInUser);
  } catch (error) {
    if (error.isBoom) {
      return createLambdaResponse(error.output.statusCode, { error: error.message });
    }
    console.error('Error in login handler:', error);
    return createLambdaResponse(500, { error: 'Internal server error' });
  }
};
