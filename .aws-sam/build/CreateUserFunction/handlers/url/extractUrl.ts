import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { createLambdaResponse, getUserFromToken } from '../../utils/lambda-middleware';
import url from '../../services/url';

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

    const { urlToExtract } = JSON.parse(event.body);
    
    if (!urlToExtract) {
      return createLambdaResponse(400, { error: 'URL is required' });
    }

    const extractedContent = await url.extract(urlToExtract);
    return createLambdaResponse(200, extractedContent);
  } catch (error) {
    console.error('Error in extractUrl handler:', error);
    return createLambdaResponse(500, { error: 'Internal server error' });
  }
};
