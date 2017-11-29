import React from 'react';
import PropTypes from 'prop-types';
import { Switch, Route } from 'react-router-dom';
import { graphql, compose } from 'react-apollo';

import '../../components/styles';

import query from './me.graphql';
import Header from './header';
import SignIn from './signin';
import SignUp from './signup';

import Auctions from '../auctions';
import EditAuction from '../auctions/edit';
import ViewAuction from '../auctions/view';

import Overlay from '../../components/overlay';

const Layout = ({ me }) => (
  <div className="main">
    <Header me={me} />
    <SignIn />
    <SignUp />
    <Switch>
      <Route path="/" exact render={(m) => <Auctions {...m} me={me} />} />
      <Route path="/new" render={(m) => <EditAuction {...m} me={me} isNew />} />
      <Route path="/:id" exact render={(m) => <ViewAuction {...m} me={me} />} />
      <Route path="/:id/edit" render={(m) => <EditAuction {...m} me={me} />} />
      <Route render={(m) => <Overlay code="404 Error" title="We Couldn't Find That Page" {...m} />} />
    </Switch>
  </div>
);

Layout.propTypes = {
  me: PropTypes.object,
};

const composed = compose(
  graphql(query, {
    props: ({ data: { me } }) => ({
      me,
    }),
  }),
)(Layout);

export default composed;
