import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose, withApollo } from 'react-apollo';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import colourize, { initialize } from '../../utilities/colourize';
import { openModal } from '../../components/modal/reducer';

import Logo from '../../components/icons/logo.svg';
import Enter from '../../components/icons/sign-in.svg';
import Exit from '../../components/icons/sign-out.svg';
import './header.css';

class Header extends Component {
  static propTypes = {
    me: PropTypes.object,
    client: PropTypes.object,
    onSignIn: PropTypes.func,
  };

  onSignOut = () => {
    const { client } = this.props;
    localStorage.removeItem('authorization');
    client.resetStore();
    window.location.reload();
  }

  render() {
    const { me, onSignIn } = this.props;

    return (
      <header>
        <Link to="/"><Logo className="logo" /></Link>
        <div className="spacer" />
        {me ? [
          <div key="initial" className="initial" style={{ background: colourize(me.email) }}>
            <span className="initial-text">{initialize(me.name)}</span>
          </div>,
          <button onClick={this.onSignOut} key="signOutButton" className="nav">
            <Exit />
            <span className="text">Sign Out</span>
          </button>
        ] : [
          <button onClick={onSignIn} key="signInButton" className="nav">
            <Enter />
            <span className="text">Sign In</span>
          </button>,
        ]}
      </header>
    );
  }
}

const composed = compose(
  connect(null, (dispatch) => ({
    onSignIn() { dispatch(openModal('signIn')); },
  })),
  withApollo,
)(Header);

export default composed;
