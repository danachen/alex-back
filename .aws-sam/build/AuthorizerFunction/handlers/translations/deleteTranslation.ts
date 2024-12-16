import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { createLambdaResponse } from '../../utils/lambda-middleware';
import { deleteTranslation } from '../../services/translationService';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const translationId = event.pathParameters?.id;
    if (!translationId) {
      return createLambdaResponse(400, { error: 'Translation ID is required' });
    }

    await deleteTranslation(translationId);
    return createLambdaResponse(204, null);
  } catch (error) {
    console.error('Error in deleteTranslation:', error);
    return createLambdaResponse(500, { error: 'Internal server error' });
  }
};
