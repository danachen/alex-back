import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { createLambdaResponse, getUserFromToken } from '../../utils/lambda-middleware';
import translations from '../../services/translations';
import { Translation } from '../../types';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    // Extract and verify token
    const token = event.headers.Authorization?.replace('Bearer ', '');
    const user = await getUserFromToken(token);

    if (!user) {
      return createLambdaResponse(401, { error: 'Invalid token' });
    }

    const id = event.pathParameters?.id;
    if (!id) {
      return createLambdaResponse(400, { error: 'Translation ID is required' });
    }

    if (!event.body) {
      return createLambdaResponse(400, { error: 'Missing request body' });
    }

    const { translation: translationText } = JSON.parse(event.body);
    if (!translationText) {
      return createLambdaResponse(400, { error: 'Translation text is required' });
    }

    const updatedTranslation: Translation = await translations.update(Number(id), translationText);
    const context: string = await translations.getUserTranslationContext(Number(user.id), Number(id));

    return createLambdaResponse(200, { ...updatedTranslation, context });
  } catch (error) {
    console.error('Error in updateTranslation handler:', error);
    return createLambdaResponse(500, { error: 'Internal server error' });
  }
};
