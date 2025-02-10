import { gql } from 'graphql-tag';

export const typeDefs = `
  type User {
    id: ID!
    firstName: String!
    lastName: String
    userName: String!
    isActive: Boolean!
    createdAt: String!
    updatedAt: String!
  }

  type AuthPayload {
    user: User!  
    authToken: String!
  }
  
  input CreateUserInput{
    firstName: String!
    lastName: String
    userName: String!
    password: String!
  }

  input UpdateUserInput{
    id: ID!
    firstName: String
    lastName: String
    isActive: Boolean
  }

  input AuthenticateUserInput {
    userName: String!
    password: String!
  }
`;
