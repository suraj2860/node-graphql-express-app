import express, { Request } from 'express';
import { expressMiddleware } from '@apollo/server/express4';
import createAplloGraphqlServer from './graphql';
import { AuthContext, authMiddleware } from './middlewares/auth.middleware';
import { randomBytes } from 'crypto';

export interface GraphQLContext extends AuthContext {
  requestId: string;
}

export const createApp = async () => {
  const app = express();
  app.use(express.json());

  app.get('/', (req, res) => {
    res.json({ message: '🚀 Server is up and running...' });
  });

  // GraphQL Middleware
  app.use(
    '/graphql',
    expressMiddleware(await createAplloGraphqlServer(), {
      context: async ({ req }: { req: Request }): Promise<GraphQLContext> => {
        const user = await authMiddleware(req);

        // Generate requestId (timestamp + random number)
        const requestId = `${Date.now()}-${randomBytes(4).toString('hex')}`;

        return { ...user, requestId }; // Include requestId in context
      },
    })
  );

  return app;
};
