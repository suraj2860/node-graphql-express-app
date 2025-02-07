import { gql } from "graphql-tag";

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
`;
