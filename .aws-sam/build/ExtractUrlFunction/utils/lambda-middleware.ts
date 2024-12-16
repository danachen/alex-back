import { APIGatewayProxyEvent, APIGatewayAuthorizerResult, APIGatewayTokenAuthorizerEvent } from 'aws-lambda';
import jwt from 'jsonwebtoken';
import { config } from '../utils/config';

export const extractToken = (authHeader?: string): string | null => {
  if (!authHeader || !authHeader.toLowerCase().startsWith('bearer ')) {
    return null;
  }
  return authHeader.substring(7);
};

export const getUserFromToken = async (token: string | null) => {
  if (!token) {
    return null;
  }

  try {
    const decodedToken = jwt.verify(token, config.JWT_SECRET) as { id: string };
    if (!decodedToken.id) {
      return null;
    }
    return decodedToken;
  } catch (error) {
    return null;
  }
};

export const createLambdaResponse = (statusCode: number, body: any, headers: Record<string, string> = {}) => ({
  statusCode,
  body: JSON.stringify(body),
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
    ...headers,
  },
});

// JWT Authorizer for API Gateway
export const authorizer = async (event: APIGatewayTokenAuthorizerEvent): Promise<APIGatewayAuthorizerResult> => {
  try {
    const token = event.authorizationToken.replace('Bearer ', '');
    const decodedToken = jwt.verify(token, config.JWT_SECRET) as { id: string };

    if (!decodedToken.id) {
      throw new Error('Invalid token');
    }

    return {
      principalId: decodedToken.id,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: event.methodArn,
          },
        ],
      },
      context: {
        userId: decodedToken.id,
      },
    };
  } catch (error) {
    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: event.methodArn,
          },
        ],
      },
    };
  }
};
