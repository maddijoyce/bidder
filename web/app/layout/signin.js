import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import { connect } from 'react-redux';

import Modal from '../../components/modal';
import { openModal, closeModal } from '../../components/modal/reducer';
import { Form, Field, Button } from '../../components/field';
import { updateForm, clearForm } from '../../components/field/reducer';

import query from './me.graphql';
import mutation from './signin.graphql';
import Envelope from '../../components/icons/envelope.svg';
import Lock from '../../components/icons/lock.svg';
import Chevron from '../../components/icons/chevron-double-right.svg';

class SignIn extends Component {
  static propTypes = {
    onSignUp: PropTypes.func,
    onComplete: PropTypes.func,
    onError: PropTypes.func,
  };

  static validation = {
    email: [
      (v) => (!v && 'is missing'),
      (v) => (!/@/.test(v) && 'is missing an @'),
      (v) => (!/^[^@ ]+@[^@ ]+\.[^@ ]+$/.test(v) && 'is incomplete'),
    ],
    password: [
      (v) => (!v && 'is missing'),
    ],
  };

  onSubmit = async (values) => {
    const { onSignIn, onComplete, onError } = this.props;

    try {
      const result = await onSignIn(values);
      localStorage.setItem('authorization', result.data.signIn.token);
      onComplete();
    } catch (e) {
      onError(e.graphQLErrors[0].state);
    }
  }

  render() {
    const { onSignUp } = this.props;

    return (
      <Modal name="signIn">
        <h4 className="modal-title">Sign In To Bidder</h4>
        <p className="modal-title">Don't have an account? <button onClick={onSignUp} className="link">Sign Up Now</button></p>
        <hr />
        <Form name="signIn" validation={SignIn.validation} onSubmit={this.onSubmit} className="modal-form">
          <Field name="email" type="email" label="Email Address" icon={Envelope} focus />
          <Field name="password" type="password" label="Password" icon={Lock} />
          <Button className="blue" type="submit" text="Sign In" icon={Chevron} />
        </Form>
      </Modal>
    );
  }
}

const composed = compose(
  graphql(mutation, {
    props: ({ mutate }) => ({
      onSignIn: ({ email, password }) => mutate({
        variables: {
          email,
          password,
        },
        update(store, { data: { signIn } }) {
          store.writeQuery({
            query,
            data: {
              me: signIn.user,
            },
          });
        },
      }),
    }),
  }),
  connect(null, (dispatch) => ({
    onSignUp() { dispatch(openModal('signUp')); },
    onError(values) { dispatch(updateForm({ form: 'signInErrors', values })); },
    onComplete() {
      dispatch(closeModal('signIn'));
      dispatch(clearForm({ form: 'signIn' }));
      dispatch(clearForm({ form: 'signInErrors' }));
    },
  }))
)(SignIn);

export default composed;
