import React, { Component, Children } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import c from 'classnames';
import equals from 'shallow-equals';

import { updateForm, updateField } from './reducer';

class Form extends Component {
  static propTypes = {
    name: PropTypes.string,
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
    validation: PropTypes.object,
    loading: PropTypes.bool,
    className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    onSubmit: PropTypes.func,
    initial: PropTypes.object,
    setValues: PropTypes.func,
  };

  static defaultProps = {
    validation: {},
    onSubmit: () => {},
  };

  componentWillMount() {
    this.initializeForm();
  }

  componentWillReceiveProps(nextProps) {
    this.initializeForm(nextProps);
  }

  initializeForm = (nextProps) => {
    const { initial, children, setValues } = this.props;
    const initialFields = {};

    if (initial && !nextProps) {
      Children.forEach(children, ({ props: { name } }) => {
        if (name) initialFields[name] = initial[name];
      });
      setValues(initialFields)
    } else if (nextProps && !equals(initial, nextProps.initial)) {
      Children.forEach(children, ({ props: { name } }) => {
        if (name) initialFields[name] = (nextProps.initial || {})[name];
      });
      setValues(initialFields);
    }
  };

  onSubmit = async (e) => {
    e.preventDefault();
    const { values, validation, setErrors, setLoading, onSubmit } = this.props;

    const errors = { length: 0 };
    Object.keys(validation).forEach(name => {
      validation[name].forEach(func => {
        const error = func(values[name]);
        if (!errors[name] && error) {
          errors[name] = error;
          errors.length++;
        }
      });
    });
    setErrors(errors);

    if (!errors.length) {
      setLoading(true);
      await onSubmit(values);
      setLoading(false);
    }
  }

  render() {
    const { name, children, validation, loading, className } = this.props;
    return (
      <form className={c('form', className)} name={name} onSubmit={this.onSubmit} noValidate>
        {Children.map(children, child => (
          child && typeof child.type === 'function' && child.type.name !== 'SVG' ?
          React.cloneElement(child, {
            validation,
            loading,
            form: name,
          }) :
          child
        ))}
      </form>
    );
  }
}

const withState = connect(({ fields }, { name }) => ({
  values: fields[name] || {},
  loading: (fields[`${name}Errors`] || {}).loading,
}), (dispatch, { name }) => ({
  setValues(values) { dispatch(updateForm({ form: name, values })); },
  setErrors(values) { dispatch(updateForm({ form: `${name}Errors`, values })); },
  setLoading(value) { dispatch(updateField({ form: `${name}Errors`, name: 'loading', value })); },
}))(Form);

export default withState;
