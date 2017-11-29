import React from 'react';

import Field from './field';

class Area extends Field {
  componentDidMount() {
    let parent = this.area.parentElement;
    while (parent && window.getComputedStyle(parent).overflow !== 'scroll') {
      parent = parent.parentElement;
    }
    this.scroll = parent || document.body;

    this.resizeContent();
  }

  componentDidUpdate() {
    this.resizeContent();
  }

  resizeContent() {
    const scrollLeft = this.scroll.scrollLeft;
    const scrollTop = this.scroll.scrollTop;

    this.area.style.height = 'auto';
    this.area.style.height = `${this.area.scrollHeight}px`,

    this.scroll.scrollLeft = scrollLeft;
    this.scroll.scrollTop = scrollTop;
  }

  renderInput() {
    const { name, value, focus, display } = this.props;

    return (
      <textarea
        ref={(c) => { this.area = c; }}
        className="field-input"
        id={name}
        name={name}
        value={value}
        onChange={this.onChange}
        autoComplete="off"
        autoFocus={focus}
        readOnly={display}
      />
    );
  }
}

export default Area;
