import { AuthenticationError, UserInputError } from 'apollo-server-express';
import bcrypt from 'bcrypt';
import { CreateUserRequest, UpdateUserRequest, AuthenticateUserRequest, AuthenticateUserResponse, User } from './interfaces/index';
import UserService from '../../services/user.service';
import { generateToken } from '../../utils/jwt';
import { errorHandler } from '../../utils/errorHandler';
import { authGuard } from '../../utils/authGuard';

const queries = {
  healthcheck: () => 'OK',

  getUsers: authGuard(async () => {
    try {
      const users = await UserService.getUsers();
      if (!users || users.length === 0) {
        throw new UserInputError('No users found.');
      }
      return users;
    } catch (error) {
      errorHandler(error, 'Failed to fetch users');
    }
  }),

  getUserById: authGuard(async (_: any, { id }: { id: number }) => {
    try {
      if (!id) throw new UserInputError('User ID is required.');

      const user = await UserService.getUserById(id);
      if (!user) throw new UserInputError(`User with ID ${id} not found.`);

      return user;
    } catch (error) {
      errorHandler(error, 'Failed to fetch user by ID');
    }
  }),

  getUserByUserName: authGuard( async (_: any, { userName }: { userName: string }) => {
    try {
      if (!userName) throw new UserInputError('Username is required.');

      const user = await UserService.getUserByUserName(userName);
      if (!user) throw new UserInputError(`User with username "${userName}" not found.`);

      return user;
    } catch (error) {
      errorHandler(error, 'Failed to fetch user by username');
    }
  }),
};

const mutations = {
  createUser: authGuard( async (_: any, { request }: { request: CreateUserRequest }) => {
    try {
      const existingUser = await UserService.getUserByUserName(request.userName);
      if (existingUser) {
        console.error('User already exists.');
        throw new UserInputError(`Username "${request.userName}" is already taken.`);
      }

      const response = await UserService.createUser(request);
      return response.id;
    } catch (error: any) {
      errorHandler(error, 'Failed to create user');
    }
  }),
  updateUser: authGuard( async (_: any, { request }: { request: UpdateUserRequest }) => {
    try {
      if (!request.id) {
        throw new UserInputError('User ID is required.');
      }

      const user = await UserService.getUserById(request.id);
      if (!user) {
        throw new UserInputError(`User with ID "${request.id}" not found.`);
      }

      return await UserService.updateUser(user, request);
    } catch (error: any) {
      errorHandler(error, 'Failed to update user');
    }
  }),
  deleteUser: authGuard( async (_: any, { id }: { id: number }) => {
    try {
      if (!id) {
        throw new UserInputError('User ID is required.');
      }

      const user = await UserService.getUserById(id);
      if (!user) {
        throw new UserInputError(`User with ID "${id}" not found.`);
      }

      await user.destroy();

      return true;
    } catch (error: any) {
      errorHandler(error, 'Failed to delete user');
    }
  }),
  authenticateUser: async (_: any, { request }: { request: AuthenticateUserRequest }): Promise<AuthenticateUserResponse | undefined> => {
    try {
      if (!request.userName || !request.password) {
        throw new UserInputError('Username and password are required.');
      }

      const user = await UserService.getUserByUserNameInternal(request.userName);
      if (!user) {
        throw new AuthenticationError('Invalid credentials.');
      }

      const isMatch = await bcrypt.compare(request.password, user.password);
      if (!isMatch) {
        throw new AuthenticationError('Invalid credentials.');
      }

      const { password, ...userWithoutPassword } = user.toJSON();

      // const userDetails: User = {
      //   id: user.id,
      //   firstName: user.firstName,
      //   lastName: user.lastName,
      //   userName: user.userName,
      //   isActive: user.isActive,
      //   createdAt: user.createdAt,
      //   updatedAt: user.updatedAt,
      //   deletedAt: user.deletedAt ?? null
      // }

      // console.log({ authToken: generateToken(user), user: userWithoutPassword });

      const authenticateUserResponse: AuthenticateUserResponse = {
        authToken: generateToken(user),
        user: userWithoutPassword,
      };

      return authenticateUserResponse;
    } catch (error) {
      errorHandler(error, 'Failed to authenticate user');
    }
  },
};

export const resolvers = { queries, mutations };
