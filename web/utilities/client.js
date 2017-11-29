import { ApolloClient } from 'apollo-client';
import { getMainDefinition } from 'apollo-utilities';
import { ApolloLink, split } from 'apollo-link';
import { WebSocketLink } from 'apollo-link-ws';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

export default function createAppClient() {
  let client;

  const httpLink = createHttpLink({
    uri: process.env.GRAPHQL,
  });
  const wsLink = new WebSocketLink({
    uri: process.env.WS,
    options: {
      reconnect: true,
    },
  });

  const authHeaders = new ApolloLink((operation, forward) => {
    const token = localStorage.getItem('authorization');
    if (token) {
      operation.setContext({ headers: {
        authorization: `Bearer ${token}`,
      } });
    }
    return forward(operation).map(response => {
      const { response: { headers } } = operation.getContext();
      const token = (headers.get('Authorization') || '').split(' ');

      if (token[0] === 'Bearer' && token[1]) {
        localStorage.setItem('authorization', token[1]);
      } else if (token[0] === 'Error') {
        localStorage.removeItem('authorization');
        client.resetStore();
      }
      return response;
    });
  });

  const link = split(
    ({ query }) => {
      const { kind, operation } = getMainDefinition(query);
      return kind === 'OperationDefinition' && operation === 'subscription';
    },
    wsLink,
    authHeaders.concat(httpLink)
  );

  client = new ApolloClient({
    link,
    cache: new InMemoryCache(),
    queryDeduplication: true,
    dataIdFromObject(result) {
      let dataId;
      if (result.id && result.__typename) {
        dataId = `${result.__typename}-${result.id}`;
      }
      return dataId;
    },
  });

  return client;
}
