import { CreateUserRequest } from "./interfaces/create-user-req";
import { UpdateUserRequest } from "./interfaces/update-user-req";
import UserService from "../../services/user.service";
import { UserInputError } from "apollo-server-express";

const queries = {
  hello: () => "Hello, world!",

  getUsers: async () => {
    try {
      const users = await UserService.getUsers();
      if (!users || users.length === 0) {
        throw new UserInputError("No users found.");
      }
      return users;
    } catch (error) {
      if (error instanceof UserInputError) throw error;
      throw new Error("Failed to fetch users.");
    }
  },

  getUserById: async (_: any, { id }: { id: number }) => {
    try {
      if (!id) throw new UserInputError("User ID is required.");

      const user = await UserService.getUserById(id);
      if (!user) throw new UserInputError(`User with ID ${id} not found.`);

      return user;
    } catch (error) {
      if (error instanceof UserInputError) throw error;
      throw new Error("Failed to fetch user by ID.");
    }
  },

  getUserByUserName: async (_: any, { userName }: { userName: string }) => {
    try {
      if (!userName) throw new UserInputError("Username is required.");

      const user = await UserService.getUserByUserName(userName);
      if (!user)
        throw new UserInputError(`User with username "${userName}" not found.`);

      return user;
    } catch (error) {
      if (error instanceof UserInputError) throw error;
      throw new Error("Failed to fetch user by username.");
    }
  },
};

const mutations = {
  createUser: async (_: any, { request }: { request: CreateUserRequest }) => {
    try {
      const existingUser = await UserService.getUserByUserName(
        request.userName
      );
      if (existingUser) {
        console.error("User already exists.");
        throw new UserInputError(
          `Username "${request.userName}" is already taken.`
        );
      }

      const response = await UserService.createUser(request);
      return response.id;
    } catch (error: any) {
      if (error instanceof UserInputError) throw error;

      console.error("Error creating user:", error);
      throw new Error("Failed to create user.");
    }
  },
  updateUser: async (_: any, { request }: { request: UpdateUserRequest }) => {
    try {
      if (!request.id) {
        throw new UserInputError("User ID is required.");
      }

      const user = await UserService.getUserById(request.id);
      if (!user) {
        throw new UserInputError(`User with ID "${request.id}" not found.`);
      }

      return await UserService.updateUser(user, request);
    } catch (error: any) {
      if (error instanceof UserInputError) throw error;

      console.error("Error updating user:", error);
      throw new Error("Failed to update user.");
    }
  },
  deleteUser: async (_: any, { id }: { id: number }) => {
    try {
      if (!id) {
        throw new UserInputError("User ID is required.");
      }

      const user = await UserService.getUserById(id);
      if (!user) {
        throw new UserInputError(`User with ID "${id}" not found.`);
      }

      await user.destroy();

      return true;
    } catch (error: any) {
      if (error instanceof UserInputError) throw error;

      console.error("Error deleteing user:", error);
      throw new Error("Failed to delete user.");
    }
  },
};

export const resolvers = { queries, mutations };
