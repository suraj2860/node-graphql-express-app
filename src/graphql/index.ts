import { ApolloServer } from '@apollo/server';
import { User } from './user';
import AppConstants from '../config/constants';
import errorLoggerPlugin from './plugins/error-logger.plugin';
import requestResponseLoggerPlugin from './plugins/request-response-logger.plugin';

async function createAplloGraphqlServer() {
  // Create GraphQL Server
  const gqlServer = new ApolloServer({
    typeDefs: `
        ${User.typeDefs}
        type Query {
            ${User.queries}
        }
        type Mutation {
            ${User.mutations}
        }
    `,
    resolvers: {
      Query: {
        ...User.resolvers.queries,
      },
      Mutation: {
        ...User.resolvers.mutations,
      },
    },
    plugins: [requestResponseLoggerPlugin, errorLoggerPlugin],
    includeStacktraceInErrorResponses: process.env.NODE_ENV !== AppConstants.PROD_ENVIRONMENT, // Show stacktrace only in dev
    formatError: (error) => {
      if (process.env.NODE_ENV === AppConstants.PROD_ENVIRONMENT) {
        return {
          message: error.message || AppConstants.INTERNAL_SERVER_ERROR_MESSAGE,
          extensions: {
            code: error.extensions?.code || AppConstants.INTERNAL_SERVER_ERROR_CODE,
          },
        };
      }
      return error; // Keep full error details in dev mode
    },
  });

  // Start the GraphQL Server
  await gqlServer.start();

  return gqlServer;
}

export default createAplloGraphqlServer;
