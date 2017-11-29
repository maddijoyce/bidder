import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import createHistory from 'history/createBrowserHistory';

import createClient from '../utilities/client';
import createStore from '../utilities/store';
import Root from './root';

const history = createHistory();
const client = createClient();
const store = createStore({ client, history });

render((<AppContainer>
  <Root client={client} store={store} history={history} />
</AppContainer>), document.getElementById('root'));

if (module.hot) {
  module.hot.accept('./root.js', () => {
    const NewRoot = require('./root').default;
    render((<AppContainer>
      <NewRoot client={client} store={store} history={history} />
    </AppContainer>), document.getElementById('root'));
  })
}
