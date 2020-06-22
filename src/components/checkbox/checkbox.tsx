import React from 'react';
import './checkbox.scss';

type CheckboxProps = {
  id: string,
  text: string
  value: boolean,
  onChange?: () => void
}

const Checkbox = (props: CheckboxProps) => {

  const { id, text, value, onChange } = props;

  return (
    <div className="input-checkbox">
      <label>
        <input type="checkbox" id={id} checked={value} onChange={onChange} />
        <span>{text}</span>
      </label>
    </div>
  );
}

export default Checkbox;
