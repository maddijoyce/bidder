import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import c from 'classnames';

import Times from '../icons/times.svg';
import { closeModal } from './reducer';
import './modal.css';

class Modal extends Component {
  static propTypes = {
    name: PropTypes.string,
    current: PropTypes.string,
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
    onClose: PropTypes.func,
  };

  render() {
    const { name, current, children, onClose } = this.props;

    return (
      <div onClick={onClose} className={c('modal-bg', { visible: name === current })}>
        <div className={c('modal', 'card')}>
          <Times className="modal-icon" />
          {children}
        </div>
      </div>
    );
  }
}

const composed = connect(({ modal }) => ({
  current: modal.current,
}), (dispatch, { name, onClose }) => ({
  onClose(e) {
    if (e.target === e.currentTarget) {
      dispatch(closeModal(name));
      if (onClose) onClose();
    }
  },
}))(Modal);

export default composed;
