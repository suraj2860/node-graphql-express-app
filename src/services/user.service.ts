import sequelize from "../config/sequelize";
import { CreateUserRequest } from "../interfaces/create-user-req";
import User from "../models/user";

class UserService {
  /**
   * Creates a new user with proper error handling.
   * @param request - Object containing user details.
   * @returns The created user object or an error message.
   */
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
      // Log and return a generic error message
      console.error("Error creating user: ", error);
      throw new Error("An unexpected error occurred while creating the user.");
    }
  }

  public static async getUsers() {
    try {
      return await User.findAll();
    } catch (error: any) {
      console.error("Error fetching users: ", error);
      throw new Error("An unexpected error occurred while fetching users.");
    }
  }
}

export default UserService;
