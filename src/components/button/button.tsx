import React from 'react';
// third-party libs
import classNames from 'classnames';
// custom components
import MaterialIcon from '../materialIcon';
// css
import './button.scss';


// DESCRIPTION:
// 
// This is a button.
// 


////////////////////////////////////////////////////////////////////////////////
// 
// EXTRA
// 
////////////////////////////////////////////////////////////////////////////////

type ButtonProps = {
  // A text of the button
  text: string,
  // A material icon's name
  iconName?: string,
  // Extra classes, that you can apply to the root element
  //  when you use this component inside other ones.
  // It's assumed that will be used classes that define
  //  positioning of the component
  className?: string,
  // Whether the button is active or disabled
  disabled?: boolean,
  
  // => Events
  // A click on the button
  onClick?: () => void
}


////////////////////////////////////////////////////////////////////////////////
// 
// COMPONENT
// 
////////////////////////////////////////////////////////////////////////////////

const Button = (props: ButtonProps) => {

  const {
    text,
    disabled = false,
    onClick = () => {}
  } = props;


  // ===< UTILS >===
  // 
  /**
   * Defines classes to apply to the root element
   */
  const getClasses = (): string => {

    const {
      disabled = false,
      className = ''
    } = props;

    const classes = classNames(
      // default classes
      'btn',
      // if the button is disabled
      { 'btn--disabled': disabled },
      // classes from props
      { [`${className}`]: !!className }
    );

    return classes;
  }
  /**
   * If the iconName isn't set, return null;
   *  if the iconName is set, return a component "MaterialIcon"
   */
  const renderIcon = () => {
    const { iconName = '' } = props;
    // return null
    if (!iconName) {
      return null;
    }
    // return MaterialIcon
    return (
      <MaterialIcon
        iconName={iconName}
        className="btn__icon"
      />
    );
  }


  // ===< RENDER >===
  // 
  return (
    <button
      className={ getClasses() }
      disabled={ disabled }
      onClick={ onClick }
    >
      <div className="btn__block">
        {/* text */}
        { text }
        {/* icon */}
        { renderIcon() }
      </div>
    </button>
  );
}

export default Button;
