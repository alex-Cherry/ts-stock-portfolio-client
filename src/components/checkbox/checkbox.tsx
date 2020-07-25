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
  className?: string,
  onChange?: () => void
}


////////////////////////////////////////////////////////////////////////////////
// 
// COMPONENT
// 
////////////////////////////////////////////////////////////////////////////////

const Checkbox = (props: CheckboxProps) => {

  const { id, text, value, onChange } = props;

  const getClasses = (): string => {

    const { className } = props;

    const classes = ['input-checkbox'];

    if (className) {
      classes.push(className);
    }

    return classes.join(' ');
  }

  return (
    <div className={ getClasses() }>
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
