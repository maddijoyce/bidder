import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import { connect } from 'react-redux';
import moment from 'moment';

import { Form, Field, Button } from '../../components/field';
import { updateForm } from '../../components/field/reducer';
import { openModal } from '../../components/modal/reducer';
import query from './auction.graphql';
import mutation from './bid.graphql';
import subscription from './subscription.graphql';
import Countdown from './countdown';
import Enter from '../../components/icons/sign-in.svg';
import Dollar from '../../components/icons/dollar-sign.svg';
import Plane from '../../components/icons/paper-plane.svg';
import ChevronLeft from '../../components/icons/chevron-left.svg';
import Pencil from '../../components/icons/pen.svg';

class ViewAuction extends Component {
  static propTypes = {
    auction: PropTypes.object,
    me: PropTypes.object,
    onSignIn: PropTypes.func,
    subscribeToBids: PropTypes.func,
  };

  componentWillReceiveProps({ subscribeToBids, auction }) {
    if (auction.id) {
      subscribeToBids(auction.id);
    }
  }

  isMine = () => {
    const { auction, me } = this.props;
    return auction.createdBy && me && (auction.createdBy.id === me.id);
  };

  canBid = () => {
    const { auction, me } = this.props;
    return auction.createdBy && me && (auction.createdBy.id !== me.id);
  };

  onSubmit = async ({ amount }) => {
    const { onBid, onError } = this.props;

    try {
      await onBid(amount);
    } catch (e) {
      if (e.graphQLErrors) {
        onError(e.graphQLErrors[0].state);
      } else {
        console.log(e);
      }
    }
  }

  render() {
    const { auction, me, onSignIn } = this.props;
    const time = moment(auction.finishAt);

    return (
      <div className="collections">
        <h1>
          <Button link="/" icon={ChevronLeft} className="clear" />
          {auction.title}
          {this.isMine() && <Button link={`/${auction.id}/edit`} icon={Pencil} className="clear" />}
        </h1>
        <div className="collection">
          <div className="details">
            <div className="thumb">
              <div className="blur" style={{ backgroundImage: `url(${auction.picture})` }} />
              <div className="focus" style={{ backgroundImage: `url(${auction.picture})` }} />
            </div>
            <p className="description">{auction.description}</p>
          </div>
          <div className="bids">
            <p className="price">{auction.price || 0}</p>
            <p className="time">{time.isAfter() ? 'Finishes' : 'Finished'} <Countdown time={time} /></p>
            {(auction.bids || []).map(({ amount, user, createdAt }, i) => (
              <p key={i} className="bid">
                <strong>${amount}</strong>
                <span className="sub"> {user.name}, {moment(createdAt).fromNow()}</span>
              </p>
            ))}
            {this.canBid() && (<Form name="bid" onSubmit={this.onSubmit}>
              <Field name="amount" label="Bid Amount" icon={Dollar} />
              <Button text="Make Your Bid" icon={Plane} className="blue" type="submit" />
            </Form>)}
            {!me && (
              <Button text="Sign In To Bid" icon={Enter} className="blue" onClick={onSignIn} />
            )}
          </div>
        </div>
      </div>
    );
  }
}

const composed = compose(
  graphql(mutation, {
    props: ({ mutate, ownProps: { match: { params }, me } }) => ({
      onBid: (amount) => mutate({
        variables: {
          amount,
          id: params.id,
          me: me.id,
        },
      }),
    }),
  }),
  graphql(query, {
    props: ({ data: { auction, subscribeToMore } }) => ({
      auction: auction || {},
      subscribeToBids: (id) => (subscribeToMore({
        document: subscription,
        variables: { id },
        updateQuery: ({ auction, ...rest }, { subscriptionData }) => ({
          auction: Object.assign({}, auction, subscriptionData.data.bidMade),
          ...rest,
        }),
      })),
    }),
    options: ({ match: { params } }) => ({
      variables: {
        id: params.id,
      },
    }),
  }),
  connect(null, (dispatch) => ({
    onSignIn() { dispatch(openModal('signIn')); },
    onError(values) { dispatch(updateForm({ form: 'bidErrors', values })); },
  })),
)(ViewAuction);

export default composed;
