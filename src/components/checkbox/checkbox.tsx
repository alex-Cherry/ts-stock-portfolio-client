import React from 'react';
// third-party libs
import classNames from 'classnames';
// css
import './checkbox.scss';


////////////////////////////////////////////////////////////////////////////////
// 
// EXTRA
// 
////////////////////////////////////////////////////////////////////////////////

type CheckboxProps = {
  // id of the element
  id: string,
  // text of the label of the checkbox
  text: string
  // value of the checkbox
  value: boolean,
  // extra classes, that you can apply to the root element,
  // when you use this component inside other ones.
  // It's assumed that will be used classes that define
  // positioning of the component
  className?: string,
  // 
  onChange?: () => void
}


////////////////////////////////////////////////////////////////////////////////
// 
// COMPONENT
// 
////////////////////////////////////////////////////////////////////////////////

const Checkbox = (props: CheckboxProps) => {

  const { id, text, value, onChange } = props;

  // UTILS
  /**
   * func defines classes, that need to apply to the root element
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


  // RENDER
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
