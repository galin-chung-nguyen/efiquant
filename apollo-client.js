import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://localhost:3001/graphql',
  // uri: "http://172.16.0.86:3001/graphql",
  cache: new InMemoryCache(),
});

export const makeGraphqlQuery = async (query, variables = {}, context = {}) =>
  client.query({ ...query, variables, context });
export const makeGraphqlMutation = async (
  mutation,
  variables = {},
  context = {},
) => client.mutate({ variables, mutation, context });

export default client;
