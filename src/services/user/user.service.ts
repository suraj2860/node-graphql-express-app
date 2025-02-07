import { createHmac, randomBytes } from "crypto";
import { prismaClient } from "../../lib/db";
import { CreateUserRequest } from "./interfaces/create-user-req";

class UserService {
  public static CreateUser(request: CreateUserRequest) {
    const { firstName, lastName, email, password, profileImageUrl } = request;

    const salt = randomBytes(32).toString('hex');
    const hashedPassword = createHmac("sha256", salt)
      .update(password)
      .digest("hex");

    return prismaClient.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        profileImageUrl,
        salt,
      },
    });
  }
}

export default UserService;
