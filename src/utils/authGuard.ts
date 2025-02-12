import { AuthenticationError } from "apollo-server-express";
import { AuthContext } from "../middlewares/auth.middleware";

export const authGuard = (resolver: Function) => {
    return async (parent: any, args: any, context: AuthContext, info: any) => {
      if (!context.user) {
        throw new AuthenticationError("Authentication required");
      }
      return resolver(parent, args, context, info);
    };
  };