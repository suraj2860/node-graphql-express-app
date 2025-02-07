import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { prismaClient } from "./lib/db";
import createAplloGraphqlServer from "./graphql";

async function init() {
  const app = express();
  const PORT = Number(process.env.PORT) || 8448;

  app.use(express.json());

  app.get("/", (req, res) => {
    res.json({ message: "Server is up and running..." });
  });

  // @ts-ignore
  app.use("/graphql", expressMiddleware(await createAplloGraphqlServer()));

  app.listen(PORT, () => console.log(`Server started at PORT:${PORT}`));
}

init();
