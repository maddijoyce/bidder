import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import { connect } from 'react-redux';

import Modal from '../../components/modal';
import { openModal, closeModal } from '../../components/modal/reducer';
import { Form, Field, Button } from '../../components/field';
import { updateForm, clearForm } from '../../components/field/reducer';

import query from './me.graphql';
import mutation from './signup.graphql';
import Envelope from '../../components/icons/envelope.svg';
import Lock from '../../components/icons/lock.svg';
import User from '../../components/icons/user.svg';
import Phone from '../../components/icons/phone.svg';
import Chevron from '../../components/icons/chevron-double-right.svg';

class SignUp extends Component {
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
    const { onSignUp, onComplete, onError } = this.props;

    try {
      const result = await onSignUp(values);
      localStorage.setItem('authorization', result.data.signUp.token);
      onComplete();
    } catch (e) {
      onError(e.graphQLErrors[0].state);
    }
  }

  render() {
    const { onSignUp } = this.props;

    return (
      <Modal name="signUp">
        <h4 className="modal-title">Sign In To Bidder</h4>
        <p className="modal-title">Already have an account? <button onClick={onSignUp} className="link">Sign In Now</button></p>
        <hr />
        <Form name="signUp" validation={SignUp.validation} onSubmit={this.onSubmit} className="modal-form">
          <Field name="email" type="email" label="Email Address" icon={Envelope} focus />
          <Field name="password" type="password" label="Password" icon={Lock} />
          <Field name="name" type="text" label="Name" icon={User} />
          <Field name="phone" type="text" label="Phone Number" icon={Phone} />
          <Button className="blue" type="submit" text="Sign Up" icon={Chevron} />
        </Form>
      </Modal>
    );
  }
}

const composed = compose(
  graphql(mutation, {
    props: ({ mutate }) => ({
      onSignUp: ({ email, password, ...fields }) => mutate({
        variables: {
          email,
          password,
          fields,
        },
        update(store, { data: { signUp } }) {
          store.writeQuery({
            query,
            data: {
              me: signUp.user,
            },
          });
        },
      }),
    }),
  }),
  connect(null, (dispatch) => ({
    onSignIn() { dispatch(openModal('signIn')); },
    onError(values) { dispatch(updateForm({ form: 'signUpErrors', values })); },
    onComplete() {
      dispatch(closeModal('signUp'));
      dispatch(clearForm({ form: 'signUp' }));
      dispatch(clearForm({ form: 'signUpErrors' }));
    },
  }))
)(SignUp);

export default composed;
