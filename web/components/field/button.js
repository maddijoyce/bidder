import React, { Component } from 'react';
import PropTypes from 'prop-types';
import c from 'classnames';
import { Link } from 'react-router-dom';

import './button.css';

class Button extends Component {
  static propTypes = {
    text: PropTypes.string,
    icon: PropTypes.func,
    type: PropTypes.string,
    className: PropTypes.string,
    onClick: PropTypes.func,
    link: PropTypes.string,
  };

  static defaultProps = {
    onClick: () => {},
    type: 'button',
  };

  render() {
    const { text, icon: Icon, type, className, onClick, link } = this.props;

    if (link) {
      return (
        <Link to={link} className={c('button', className, { iconOnly: Icon && !text })}>
          {Icon && <Icon className="button-icon" />}
          <span className="button-text">{text}</span>
        </Link>
      );
    } else {
      return (
        <button type={type} className={c('button', className, { iconOnly: Icon && !text })} onClick={onClick}>
          {Icon && <Icon className="button-icon" />}
          <span className="button-text">{text}</span>
        </button>
      );
    }
  }
}

export default Button;
