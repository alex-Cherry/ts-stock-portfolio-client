import React from 'react';
// third-party libs
import classNames from 'classnames';
// custom components
import MaterialIcon from '../materialIcon';
// css
import './button.scss';


////////////////////////////////////////////////////////////////////////////////
// 
// EXTRA
// 
////////////////////////////////////////////////////////////////////////////////

type ButtonProps = {
  // text on the button
  text: string,
  // material icon's name
  iconName?: string,
  // extra classes, that you can apply to the root element
  // when you use this component inside other ones.
  // It's assumed that will be used classes that define
  // positioning of the component
  className?: string,
  // whether button is active or disabled
  disabled?: boolean,
  // 
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


  // UTILS
  /**
   * defines classes, that need to apply to the root element
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
   * if iconName isn't set, return null;
   * if iconName is set, return MaterialIcon
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


  // RENDER
  return (
    <button
      className={ getClasses() }
      disabled={ disabled }
      onClick={ onClick }
    >
      <div className="d-flex">
        {/* text */}
        { text }
        {/* icon */}
        { renderIcon() }
      </div>
    </button>
  );
}

export default Button;
