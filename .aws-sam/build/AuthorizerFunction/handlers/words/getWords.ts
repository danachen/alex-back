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

    const { textId, languageId } = event.pathParameters || {};

    // Handle /api/words/text/{textId}/language/{languageId}
    if (textId && languageId) {
      const userwordsInText: Array<UserWord> = await words.getUserwordsInText(
        Number(user.id),
        Number(textId),
        languageId,
        true
      );
      return createLambdaResponse(200, userwordsInText);
    }

    // Handle /api/words/language/{languageId}
    if (languageId) {
      const userwordsInLanguage: Array<UserWord> = await words.getUserwordsByLanguage(
        languageId,
        Number(user.id)
      );
      return createLambdaResponse(200, userwordsInLanguage);
    }

    return createLambdaResponse(400, { error: 'Invalid request parameters' });
  } catch (error) {
    console.error('Error in getWords handler:', error);
    return createLambdaResponse(500, { error: 'Internal server error' });
  }
};
