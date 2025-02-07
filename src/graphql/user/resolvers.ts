import { CreateUserRequest } from "../../interfaces/create-user-req";
import UserService from "../../services/user.service";

const queries = {
  hello: () => "hello world!",
  getUsers: async () => {
    try {
      return await UserService.getUsers();
    } catch (error: any) {
      throw new Error(error.message);
    }
  },
};

const mutations = {
  createUser: async (_: any, request: CreateUserRequest) => {
    try {
      const response = await UserService.createUser(request);
      return response.id;
    } catch (error: any) {
      throw new Error(error.message);
    }
  },
};

export const resolvers = { queries, mutations };
