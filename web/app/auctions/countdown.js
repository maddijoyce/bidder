import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

class Countdown extends Component {
  static propTypes = {
    time: PropTypes.instanceOf(moment).isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      elapsed: 0,
    };
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      this.setState({ elapsed: this.state.elapsed + 1 });
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    const { time } = this.props;
    return (
      <span className="countdown">
        {time.fromNow()}
      </span>
    );
  }
}

export default Countdown;
