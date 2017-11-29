export const FIELD_UPDATE = 'Field/UPDATE';
export const FORM_UPDATE = 'Field/FORM_UPDATE';
export const FORM_CLEAR = 'Field/FORM_CLEAR';

export const updateField = ({ form, name, value }) => ({ form, name, value, type: FIELD_UPDATE });
export const updateForm = ({ form, values }) => ({ form, values, type: FORM_UPDATE });
export const clearForm = ({ form }) => ({ form, type: FORM_CLEAR });

export default function fieldReducer(fields = {}, { type, form, name, value, values } = {}) {
  let returnFields;

  switch (type) {
    case FIELD_UPDATE: {
      returnFields = {
        ...fields,
        [form]: Object.assign({}, fields[form]),
      };
      returnFields[form][name] = value;
      break;
    }
    case FORM_UPDATE: {
      returnFields = {
        ...fields,
        [form]: Object.assign({}, values),
      };
      break;
    }
    case FORM_CLEAR: {
      returnFields = {
        ...fields,
        [form]: {},
      };
      break;
    }
    default: {
      returnFields = fields;
      break;
    }
  }

  return returnFields;
}
