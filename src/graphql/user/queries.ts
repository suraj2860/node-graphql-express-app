import gql from "graphql-tag";

export const queries = `
    hello: String
    getUsers: [User!]!
    getUserById(id: ID!): User!
    getUserByUserName(userName: String!): User!
`;
