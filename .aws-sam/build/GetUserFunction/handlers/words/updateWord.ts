import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { createLambdaResponse } from '../../utils/lambda-middleware';
import { updateWord } from '../../services/wordService';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const wordId = event.pathParameters?.id;
    if (!wordId) {
      return createLambdaResponse(400, { error: 'Word ID is required' });
    }

    const wordData = JSON.parse(event.body || '{}');
    const updatedWord = await updateWord(wordId, wordData);

    if (!updatedWord) {
      return createLambdaResponse(404, { error: 'Word not found' });
    }

    return createLambdaResponse(200, updatedWord);
  } catch (error) {
    console.error('Error in updateWord:', error);
    return createLambdaResponse(500, { error: 'Internal server error' });
  }
};
