import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { createLambdaResponse, getUserFromToken } from '../../utils/lambda-middleware';
import languages from '../../services/languages';
import { Language } from '../../types';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    // Extract and verify token
    const token = event.headers.Authorization?.replace('Bearer ', '');
    const user = await getUserFromToken(token);

    if (!user) {
      return createLambdaResponse(401, { error: 'Invalid token' });
    }

    const allLanguages: Array<Language> = await languages.getAll();
    
    // Set cache headers (one hour cache)
    const headers = {
      'Cache-Control': 'public, max-age=3600'
    };

    return createLambdaResponse(200, allLanguages, headers);
  } catch (error) {
    console.error('Error in getLanguages handler:', error);
    return createLambdaResponse(500, { error: 'Internal server error' });
  }
};
