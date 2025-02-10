import { ApolloError } from 'apollo-server-express';
import { AuthenticateUserRequest } from '../graphql/user/interfaces/authenticate-user-req';
import { CreateUserRequest } from '../graphql/user/interfaces/create-user-req';
import { UpdateUserRequest } from '../graphql/user/interfaces/update-user-req';
import User from '../models/user';
import AppConstants from '../config/constants';

class UserService {
  public static async createUser(request: CreateUserRequest) {
    const { firstName, lastName, userName, password } = request;

    try {
      return await User.create({
        firstName,
        lastName,
        userName,
        password, // Password hashing happens in the model hook
        isActive: true,
      });
    } catch (error: any) {
      console.error('Error creating user: ', error.stack || error);
      throw new ApolloError('An unexpected error occurred while creating the user.', AppConstants.INTERNAL_SERVER_ERROR_CODE);
    }
  }

  public static async authenticateUser(request: AuthenticateUserRequest) {
    try {
    } catch (error: any) {
      console.error('Error authenticating user: ', error.stack || error);
      throw new ApolloError('An unexpected error occurred while authenticating the user.', AppConstants.INTERNAL_SERVER_ERROR_CODE);
    }
  }

  public static async getUsers() {
    try {
      return await User.findAll({ attributes: { exclude: ['password'] } });
    } catch (error: any) {
      console.error('Error fetching users: ', error.stack || error);
      throw new ApolloError('An unexpected error occurred while fetching users.', AppConstants.INTERNAL_SERVER_ERROR_CODE);
    }
  }

  public static async getUserById(id: number) {
    try {
      return await User.findByPk(id, { attributes: { exclude: ['password'] } });
    } catch (error: any) {
      console.error('Failed to fetch user by Id : ', error.stack || error);
      throw new ApolloError('An unexpected error occurred while fetching user by Id.', AppConstants.INTERNAL_SERVER_ERROR_CODE);
    }
  }

  public static async getUserByUserName(userName: String) {
    try {
      return await User.findOne({
        where: { userName },
        attributes: { exclude: ['password'] },
      });
    } catch (error: any) {
      console.error('Failed to fetch user by userName : ', error.stack || error);
      throw new ApolloError('An unexpected error occurred while fetching user by userName.', AppConstants.INTERNAL_SERVER_ERROR_CODE);
    }
  }

  public static async getUserByUserNameInternal(userName: String) {
    try {
      return await User.findOne({ where: { userName } });
    } catch (error: any) {
      console.error('Failed to fetch user by userName : ', error.stack || error);
      throw new ApolloError('An unexpected error occurred while fetching user by userName.', AppConstants.INTERNAL_SERVER_ERROR_CODE);
    }
  }

  public static async updateUser(user: User, request: UpdateUserRequest) {
    try {
      user.firstName = request.firstName ?? user.firstName;
      user.lastName = request.lastName ?? user.lastName;
      user.isActive = request.isActive ?? user.isActive;
      await user.save();

      return user;
    } catch (error: any) {
      console.error('Failed to update user : ', error.stack || error);
      throw new ApolloError('An unexpected error occurred while updating user.', AppConstants.INTERNAL_SERVER_ERROR_CODE);
    }
  }

  public static async deleteUser(id: number) {
    try {
    } catch (error: any) {}
  }

  public static async validatePassword(id: number) {
    try {
    } catch (error: any) {}
  }
}

export default UserService;
