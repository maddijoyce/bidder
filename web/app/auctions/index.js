import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import { Link } from 'react-router-dom';
import moment from 'moment';

import colourize, { truncate } from '../../utilities/colourize';
import Countdown from './countdown';
import query from './auctions.graphql';
import Plus from '../../components/icons/plus.svg';
import { Button } from '../../components/field';
import './auctions.css';

class Auctions extends Component {
  static propTypes = {
    me: PropTypes.object,
    myAuctions: PropTypes.array,
    liveAuctions: PropTypes.array,
  };

  renderTile({ id, title, description, price, picture, finishAt }) {
    let thumb;
    if (picture) {
      thumb = (
        <div className="thumb">
          <div className="blur" style={{ backgroundImage: `url(${picture})` }} />
          <div className="focus" style={{ backgroundImage: `url(${picture})` }} />
        </div>
      );
    } else {
      thumb = (
        <div className="thumb" style={{ backgroundColor: colourize(title) }}>
          <h3 className="thumb-title">{title}</h3>
        </div>
      );
    }
    const time = moment(finishAt);

    return (
      <Link key={id} to={id} className="tile card">
        {thumb}
        <h3 className="title">{title}</h3>
        <p className="description">{truncate(description)}</p>
        <p className="price">{price || 0}</p>
        <p className="time">{time.isAfter() ? 'Finishes' : 'Finished'} <Countdown time={time} /></p>
      </Link>
    );
  }

  renderMyAuctions() {
    const { myAuctions } = this.props;

    return (
      <div className="collection">
        <h1>My Auctions</h1>
        {myAuctions.map(this.renderTile)}
        <div className="tile">
          <h3 className="title">Create a new auction?</h3>
          <Button link="/new" text="New Auction" icon={Plus} className="blue" />
        </div>
      </div>
    )
  }

  render() {
    const { me, liveAuctions } = this.props;

    return (
      <div className="collections">
        {me && this.renderMyAuctions()}
        <div className="collection">
          <h1>Live Auctions</h1>
          {liveAuctions.map(this.renderTile)}
        </div>
      </div>
    );
  }
}

const composed = compose(
  graphql(query, {
    props: ({ data: { myAuctions, liveAuctions } }) => ({
      myAuctions: myAuctions || [],
      liveAuctions: liveAuctions || [],
    }),
    options: ({ me }) => ({
      variables: { me: (me || {}).id },
    }),
  }),
)(Auctions);

export default composed;
