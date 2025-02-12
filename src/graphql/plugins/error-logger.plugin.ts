import { ApolloServerPlugin } from '@apollo/server';
import { errorLogger } from '../../utils/logger';
import { GraphQLContext } from '../../app';

const errorLoggerPlugin: ApolloServerPlugin = {
  async requestDidStart({ request, contextValue }) {
    const { requestId } = contextValue as GraphQLContext;
    return {
      async didEncounterErrors({ errors }) {
        // const requestId = requestContext.contextValue.requestId; // Retrieve requestId
        //console.log(errors);
        await Promise.all(
          errors.map(async (error) => {
            errorLogger.error({
              requestId,
              event: 'GraphQL Error',
              message: error.message,
              path: error.path,
              locations: error.locations,
              stack: error.extensions?.exception?.stacktrace || '',
              timestamp: new Date().toISOString(),
            });
          })
        );
      },
    };
  },
};

export default errorLoggerPlugin;
