import React, { Component } from 'react';
import PropTypes from 'prop-types';
import c from 'classnames';

import './field.css';

class Field extends Component {
  static propTypes = {
    type: PropTypes.string,
    name: PropTypes.string,
    label: PropTypes.string,
    placeholder: PropTypes.string,
    icon: PropTypes.func,
    value: PropTypes.node,
    loading: PropTypes.bool,
    focus: PropTypes.bool,
    onChange: PropTypes.func,
    onError: PropTypes.func,
    error: PropTypes.string,
    validation: PropTypes.array,
    className: PropTypes.string,
  };

  static defaultProps = {
    validation: [],
  };

  static pad(number) {
    return `${number < 10 ? '0' : ''}${number}`;
  }

  static formatDate(date) {
    return date.getFullYear() +
      '-' + Field.pad(date.getMonth() + 1) +
      '-' + Field.pad(date.getDate()) +
      'T' + Field.pad(date.getHours()) +
      ':' + Field.pad(date.getMinutes());
  }

  onChange = (e) => {
    const { onChange, onError, error, validation } = this.props;
    const value = e.target.value;

    if (error) {
      let newError;
      validation.forEach(func => {
        newError = newError || func(value);
      })
      onError(newError);
    }
    onChange(value);
  }

  renderInput() {
    const { type, name, placeholder, value, focus } = this.props;

    let formattedValue = value;
    const extraProps = {};
    if (type === 'number') {
      extraProps.pattern = "[0-9]*";
      extraProps.inputMode = "numeric";
    } else if (type === 'datetime-local') {
      formattedValue = new Date(value);
      formattedValue = Field.formatDate(formattedValue);
    }

    return (
      <input
        className="field-input"
        type={type}
        id={name}
        name={name}
        placeholder={placeholder}
        value={formattedValue}
        onChange={this.onChange}
        autoComplete="off"
        autoFocus={focus}
        {...extraProps}
      />
    );
  }

  render() {
    const { name, label, error, loading, className, icon: Icon } = this.props;

    return (
      <label htmlFor={name} className={c('field', className, { error, loading, hasIcon: Icon })}>
        {Icon && <Icon className="field-icon" />}
        <div className="field-label">
          <span>{label}</span>
          <span className="field-error">&nbsp;{error}</span>
        </div>
        {this.renderInput()}
      </label>
    );
  }
}

export default Field;
