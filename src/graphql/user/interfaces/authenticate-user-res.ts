import { User } from "./user";

export interface AuthenticateUserResponse{
    user: User;
    authToken: string
}