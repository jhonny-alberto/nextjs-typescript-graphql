import { InMemoryCache, NormalizedCacheObject } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import { createUploadLink } from 'apollo-upload-client';

const isSSR = typeof window === 'undefined';

function createLink() {
  return createUploadLink({
    uri: isSSR ? process.env.API_ENDPOINT : `${window.location.origin}/graphql`,
    //uri: process.env.API_ENDPOINT + '/query',
    credentials: 'include',
    headers: {
      ['x-api-key']: process.env.API_KEY,
    },
  });
}

function createApolloClient() {
  return new ApolloClient({
    ssrMode: isSSR,
    link: createLink() as any,
    cache: new InMemoryCache(),
    defaultOptions: {
      query: {
        fetchPolicy: 'no-cache',
        errorPolicy: 'all',
      },
    },
  });
}

export function initializeApollo(initialState: any = null) {
  let apolloClient: ApolloClient<NormalizedCacheObject> | undefined;

  // Create new client for each ssr request
  if (!apolloClient || isSSR) {
    apolloClient = createApolloClient();
  }

  // If your page has Next.js data fetching methods that use Apollo Client, the initial state
  // get hydrated here
  if (initialState) {
    apolloClient.cache.restore(initialState);
  }

  return apolloClient;
}
