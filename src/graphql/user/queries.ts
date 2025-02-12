import gql from "graphql-tag";

export const queries = `
    healthcheck: String
    getUsers: [User!]!
    getUserById(id: ID!): User!
    getUserByUserName(userName: String!): User!
`;
