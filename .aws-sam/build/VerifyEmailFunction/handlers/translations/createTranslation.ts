import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { createLambdaResponse } from '../../utils/lambda-middleware';
import { createTranslation } from '../../services/translationService';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    if (!event.body) {
      return createLambdaResponse(400, { error: 'Request body is required' });
    }

    const translationData = JSON.parse(event.body);
    const newTranslation = await createTranslation(translationData);
    
    return createLambdaResponse(201, newTranslation);
  } catch (error) {
    console.error('Error in createTranslation:', error);
    return createLambdaResponse(500, { error: 'Internal server error' });
  }
};
