import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { createLambdaResponse } from '../../utils/lambda-middleware';
import { getWebDictionaries } from '../../services/webDictionaryService';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const languageId = event.pathParameters?.languageId;
    
    if (!languageId) {
      return createLambdaResponse(400, { error: 'Language ID is required' });
    }

    const dictionaries = await getWebDictionaries(languageId);
    return createLambdaResponse(200, dictionaries, {
      'Cache-Control': 'public, max-age=3600'
    });
  } catch (error) {
    console.error('Error in getWebDictionaries:', error);
    return createLambdaResponse(500, { error: 'Internal server error' });
  }
};
