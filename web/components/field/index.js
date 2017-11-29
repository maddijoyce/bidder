import { connect } from 'react-redux';

import AreaField from './area';
import ImageField from './image';
import TextField from './field';
import { updateField } from './reducer';

const fieldState = connect(({ fields }, { form, name, validation }) => ({
  value: (fields[form] || {})[name] || '',
  error: (fields[`${form}Errors`] || {})[name] || '',
  validation: validation[name],
}), (dispatch, { form, name }) => ({
  onChange(value) { dispatch(updateField({ form, name, value })); },
  onDataChange(field, value) { dispatch(updateField({ form, name: `${name}${field}`, value })); },
  onError(value) { dispatch(updateField({ form: `${form}Errors`, name, value })); },
}));

export const Area = fieldState(AreaField);
export const Image = fieldState(ImageField);
export const Field = fieldState(TextField);
export { default as Form } from './form';
export { default as Button } from './button';
