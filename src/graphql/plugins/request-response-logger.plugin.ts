import { ApolloServerPlugin } from '@apollo/server';
import { requestResponseLogger } from '../../utils/logger';
import { GraphQLContext } from '../../app';

const requestResponseLoggerPlugin: ApolloServerPlugin = {
  async requestDidStart({ request, contextValue }) {
    const { requestId } = contextValue as GraphQLContext;
    const { query, variables, operationName } = request;

    // Skip introspection queries
    if (query?.includes('__schema') || query?.includes('__type')) {
      return {};
    }

    // Retrieve requestId from context
    // const requestId = request.contextValue.requestId;
    const cleanedQuery = query?.replace(/\s+/g, ' ').trim();

    requestResponseLogger.info({
      requestId,
      event: 'GraphQL Request',
      operation: operationName || 'Unnamed Operation',
      query: cleanedQuery,
      variables,
      timestamp: new Date().toISOString(),
    });

    return {
      async willSendResponse({ response, operationName }) {
        //console.log(response);

        if (
          response.body.kind === 'single' &&
          response.body.singleResult.errors !== undefined &&
          Array.isArray(response.body.singleResult.errors) &&
          response.body.singleResult.errors.length > 0 
        ) {
          return; // Skip logging response here, let errorLogger handle it
        }
        // requestResponseLogger.info({
        //   requestId,
        //   event: 'GraphQL Response',
        //   operation: operationName || 'Unnamed Operation',
        //   response: response.body,
        //   timestamp: new Date().toISOString(),
        // });
      },
    };
  },
};

export default requestResponseLoggerPlugin;
