import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './overlay.css';

class Overlay extends Component {
  static propTypes = {
    code: PropTypes.string,
    title: PropTypes.string,
    detail: PropTypes.node,
    error: PropTypes.object,
  };

  static defaultProps = {
    code: "Error",
    title: "Something's gone wrong",
    detail: (<span>
      If you'd like to <a href="mailto:error@bidder.maddijoyce.com">let us know</a>,
      we'll see what we can do to fix it.
    </span>),
  };

  render() {
    const { code, title, detail, error } = this.props;
    if (error) console.error(error);
    let content = [
      code && <h6 key="code" className="overlay-code">{code}</h6>,
      title && <h1 key="title" className="overlay-title">{title}</h1>,
      detail && <p key="detail" className="overlay-detail">{detail}</p>,
    ].filter(Boolean);
    content = [].concat(...content.map(e => [
      <hr key={`${e.key}-rule`} className="overlay-rule" />,
      e,
    ])).slice(1);

    return (
      <div className="overlay">
        <div className="overlay-content">{content}</div>
      </div>
    );
  }
}

export default Overlay;
