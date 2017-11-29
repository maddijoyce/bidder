import React from 'react';
import PropTypes from 'prop-types';
import { ApolloProvider } from 'react-apollo';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';

import Layout from './layout';

const RootContainer = ({ client, store, history }) => (
  <ApolloProvider client={client}>
    <Provider store={store}>
      <ConnectedRouter key={Math.random()} history={history}>
        <Layout />
      </ConnectedRouter>
    </Provider>
  </ApolloProvider>
);

RootContainer.propTypes = {
  client: PropTypes.object,
  store: PropTypes.object,
  history: PropTypes.object,
};

export default RootContainer;
