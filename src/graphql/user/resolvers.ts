import { CreateUserRequest } from "../../services/user/interfaces/create-user-req";
import UserService from "../../services/user/user.service";

const queries = {
    hello: () => "hello world!"
};

const mutations = {
    createUser: async (_: any, request: CreateUserRequest) => {
        const res = await UserService.CreateUser(request);
        return res.id;
    }
};

export const resolvers = { queries, mutations };