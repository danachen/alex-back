import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { createLambdaResponse, getUserFromToken } from '../../utils/lambda-middleware';
import texts from '../../services/texts';
import users from '../../services/users';
import { Text } from '../../types';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    // Extract and verify token
    const token = event.headers.Authorization?.replace('Bearer ', '');
    const user = await getUserFromToken(token);

    if (!user) {
      return createLambdaResponse(401, { error: 'Invalid token' });
    }

    // Handle different routes based on path parameters
    if (event.pathParameters?.languageId) {
      // GET /api/texts/language/{languageId}
      const { languageId } = event.pathParameters;
      const allTexts: Array<Text> = await texts.getByUserAndLanguage(Number(user.id), languageId);
      return createLambdaResponse(200, allTexts);
    } 
    
    if (event.pathParameters?.id) {
      // GET /api/texts/{id}
      const { id } = event.pathParameters;
      const textById: Text = await texts.getById(Number(id));

      if (textById.userId === user.id) {
        return createLambdaResponse(200, textById);
      }
      return createLambdaResponse(404, { error: 'Text not found' });
    }

    // GET /api/texts
    const isAdmin = await users.isAdmin(Number(user.id));
    if (isAdmin) {
      const allTexts: Array<Text> = await texts.getAll();
      return createLambdaResponse(200, allTexts);
    }

    return createLambdaResponse(404, { error: 'Not found' });
  } catch (error) {
    console.error('Error in getTexts handler:', error);
    return createLambdaResponse(500, { error: 'Internal server error' });
  }
};
