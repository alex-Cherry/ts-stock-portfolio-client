import React, { MouseEvent } from 'react';
// third-party libs
import classNames from 'classnames';
// custom components
import MaterialIcon from '../materialIcon';
// css
import './floatingButton.scss';


// DESCRIPTION:
// 
// This is a button. It has a circle form.
// If assign the property "isFixed", then the button is placed in the bottom-left corner
//  and at the top of the elements.
// 


////////////////////////////////////////////////////////////////////////////////
// 
// EXTRA
// 
////////////////////////////////////////////////////////////////////////////////

type FloatingButtonProps = {
  // A material icon's name
  iconName: string,
  // Extra classes, that you can apply to the root element,
  //  when you use this component inside other ones.
  // It's assumed that will be used classes that define
  //  positioning of the component
  className?: string,
  // Defines whether display the button in the bottom-left corner or not
  isFixed?: boolean,

  // => Events
  // A click on the button
  onClick?: () => void
}


////////////////////////////////////////////////////////////////////////////////
// 
// COMPONENT
// 
////////////////////////////////////////////////////////////////////////////////

const FloatingButton = (props: FloatingButtonProps) => {

  const {
    iconName = '',
    onClick = () => {}
  } = props;


  // ===< UTILS >===
  // 
  /**
   * Function returns the string, including classes for the root element
   */
  const getClasses = (): string => {

    const {
      isFixed = false,
      className = ''
    } = props;

    const classes = classNames(
      // define default classes
      'btn-floating',
      // extra classes
      { [`${className}`]: !!className },
      // if isFixed, add to the root element
      // extra class, setting fixed position
      { 'btn-floating--fixed': isFixed }
    );

    return classes;
  }


  // ===< EVENT HANDLERS >===
  // 
  const clickHandler = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    onClick();
  }

  
  // ===< RENDER >===
  // 
  return (
    <div
      className={ getClasses() }
      onClick={ clickHandler }
    >
      <MaterialIcon
        iconName={iconName}
        className="btn-floating__icon"
      />
    </div>
  );
}

export default FloatingButton;
