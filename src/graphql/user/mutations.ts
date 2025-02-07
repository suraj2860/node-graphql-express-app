import gql from "graphql-tag";

export const mutations = `
    createUser(firstName: String!, lastName: String, userName: String!, password: String!): String
`;
