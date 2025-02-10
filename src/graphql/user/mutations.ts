import gql from "graphql-tag";

export const mutations = `
    authenticateUser(request: AuthenticateUserInput): AuthPayload!
    createUser(request: CreateUserInput): String
    updateUser(request: UpdateUserInput): User
    deleteUser(id: ID!): Boolean
`;
