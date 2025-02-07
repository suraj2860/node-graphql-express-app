import express from "express";
import { expressMiddleware } from "@apollo/server/express4";
import createAplloGraphqlServer from "./graphql";

export const createApp = async () => {
  const app = express();
  app.use(express.json());

  app.get("/", (req, res) => {
    res.json({ message: "🚀 Server is up and running..." });
  });

  // GraphQL Middleware
  // @ts-ignore
  app.use("/graphql", expressMiddleware(await createAplloGraphqlServer()));

  return app;
};
