import { APIGatewayProxyHandler } from 'aws-lambda';

export const handler: APIGatewayProxyHandler = async () => {
  return {
    statusCode: 301,
    headers: {
      Location: 'https://tryalexandria.com',
      'Access-Control-Allow-Origin': '*',
    },
    body: '',
  };
};
