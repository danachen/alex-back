import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { createLambdaResponse, getUserFromToken } from '../../utils/lambda-middleware';
import texts from '../../services/texts';
import { Text } from '../../types';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    // Extract and verify token
    const token = event.headers.Authorization?.replace('Bearer ', '');
    const user = await getUserFromToken(token);

    if (!user) {
      return createLambdaResponse(401, { error: 'Invalid token' });
    }

    if (!user.verified) {
      return createLambdaResponse(403, { error: 'User not verified' });
    }

    if (!event.body) {
      return createLambdaResponse(400, { error: 'Missing request body' });
    }

    const textData: Text = JSON.parse(event.body);
    textData.userId = user.id;

    const savedText = await texts.create(textData);
    return createLambdaResponse(201, savedText);
  } catch (error) {
    console.error('Error in createText handler:', error);
    return createLambdaResponse(500, { error: 'Internal server error' });
  }
};
