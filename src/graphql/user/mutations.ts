import gql from "graphql-tag";

export const mutations = `
    createUser(request: CreateUserInput): String
    updateUser(request: UpdateUserInput): User
    deleteUser(id: ID!): Boolean
`;
