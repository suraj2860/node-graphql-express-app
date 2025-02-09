import { CreateUserRequest } from "../graphql/user/interfaces/create-user-req";
import { UpdateUserRequest } from "../graphql/user/interfaces/update-user-req";
import User from "../models/user";

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

  public static async getUserById(id: number) {
    try {
      return await User.findByPk(id);
    } catch (error: any) {
      console.error("Failed to fetch user by Id : ", error);
      throw new Error(
        "An unexpected error occurred while fetching user by Id."
      );
    }
  }

  public static async getUserByUserName(userName: String) {
    try {
      return await User.findOne({ where: { userName } });
    } catch (error: any) {
      console.error("Failed to fetch user by userName : ", error);
      throw new Error(
        "An unexpected error occurred while fetching user by userName."
      );
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
      console.error("Failed to update user : ", error);
      throw new Error("An unexpected error occurred while updating user.");
    }
  }

  public static async deleteUser(id: number) {
    try{

    } catch(error: any){

    }
  }
}

export default UserService;
