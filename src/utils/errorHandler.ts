import { ApolloError, AuthenticationError, UserInputError } from "apollo-server-express";

export const errorHandler = (error: any, message: string) => {
    console.error(`${message} :: `, error);
  
    if (error instanceof UserInputError || error instanceof AuthenticationError || error instanceof ApolloError) {
      throw error; // Re-throw known Apollo errors to be properly handled by GraphQL
    }
  
    throw new ApolloError(message, 'INTERNAL_SERVER_ERROR');
  };