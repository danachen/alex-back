import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { createLambdaResponse, getUserFromToken } from '../../utils/lambda-middleware';
import words from '../../services/words';
import { UserWord } from '../../types';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    // Extract and verify token
    const token = event.headers.Authorization?.replace('Bearer ', '');
    const user = await getUserFromToken(token);

    if (!user) {
      return createLambdaResponse(401, { error: 'Invalid token' });
    }

    if (!event.body) {
      return createLambdaResponse(400, { error: 'Missing request body' });
    }

    const userWordData: UserWord = JSON.parse(event.body);
    const newUserWord: UserWord = await words.addNewUserWord(user, userWordData);

    return createLambdaResponse(201, newUserWord);
  } catch (error) {
    console.error('Error in createWord handler:', error);
    return createLambdaResponse(500, { error: 'Internal server error' });
  }
};
