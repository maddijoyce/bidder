import React from 'react';

import Field from './field';
import Button from './button';

class Image extends Field {
  onRemove = (e) => {
    e.preventDefault();
    const { onChange, onError } = this.props;
    onChange(null);
    onError(null);
  }

  onChange = (e) => {
    const { onChange, onDataChange, onError } = this.props;
    const file = e.target.files[0];

    if (!file.type.match('image\/(png|gif|jpeg)')) {
      onError('must be a jpeg, png or gif');
    } else if (file.size > 1048576) {
      onError('must be less than 1MB');
    } else {
      var reader = new FileReader();
      reader.onload = (e) => { onChange(e.target.result); }
      reader.readAsDataURL(file);
      onDataChange('File', file);
    }
    e.target.value = null;
  }

  renderInput() {
    const { name, label, value, focus, display } = this.props;

    return [value && (
      <div
        key="display"
        className="field-display"
        style={{ backgroundImage: `url(${value})` }}
      />
    ), !value && (
      <p key="placeholder" className="field-input field-placeholder">Click to add a {name}</p>
    ), (
      <div key="buttons" className="field-buttons">
        {value && <Button className="blue" onClick={this.onRemove} text={`Remove ${label}`} />}
      </div>
    ), (
      <input
        key="input"
        className="field-input--hidden"
        type="file"
        id={name}
        name={name}
        onChange={this.onChange}
        autoComplete="off"
        autoFocus={focus}
        readOnly={display}
      />
    )];
  }
}

export default Image;
