import React from 'react';
// third-party libs
import classNames from 'classnames';
// css
import './checkbox.scss';


// DESCRIPTION:
// 
// This is a checkbox.
//


////////////////////////////////////////////////////////////////////////////////
// 
// EXTRA
// 
////////////////////////////////////////////////////////////////////////////////

type CheckboxProps = {
  id: string,
  // A label text of the checkbox
  text: string
  // A value of the checkbox
  value: boolean,
  // Extra classes, that you can apply to the root element,
  //  when you use this component inside other ones.
  // It's assumed that will be used classes that define
  //  positioning of the component
  className?: string,

  // => Events
  // A changing tick in the checkbox
  onChange?: () => void
}


////////////////////////////////////////////////////////////////////////////////
// 
// COMPONENT
// 
////////////////////////////////////////////////////////////////////////////////

const Checkbox = (props: CheckboxProps) => {

  const { id, text, value, onChange } = props;


  // ===< UTILS >===
  // 
  /**
   * Func defines classes to apply to the root element
   */
  const getClasses = (): string => {

    const { className } = props;

    const classes = classNames(
      // define default classes
      'input-checkbox',
      // extra classes
      { [`${className}`]: !!className }
    );

    return classes;
  }


  // ===< RENDER >===
  // 
  return (
    <div className={ getClasses() }>
      <label className="input-checkbox__label">
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
