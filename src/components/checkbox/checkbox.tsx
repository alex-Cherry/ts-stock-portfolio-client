import React from 'react';
// css
import './checkbox.scss';


////////////////////////////////////////////////////////////////////////////////
// 
// EXTRA
// 
////////////////////////////////////////////////////////////////////////////////

type CheckboxProps = {
  id: string,
  text: string
  value: boolean,
  onChange?: () => void
}


////////////////////////////////////////////////////////////////////////////////
// 
// COMPONENT
// 
////////////////////////////////////////////////////////////////////////////////

const Checkbox = (props: CheckboxProps) => {

  const { id, text, value, onChange } = props;

  return (
    <div className="input-checkbox">
      <label className="input-checkbox__label input-checkbox__label_theme_base">
        <input
          id={id}
          type="checkbox"
          className="input-checkbox__input"
          checked={value}
          onChange={onChange}
        />
        <span className="input-checkbox__text">{ text }</span>
      </label>
    </div>
  );
}

export default Checkbox;
