import React, { MouseEvent } from 'react';
// third-party libs
import classNames from 'classnames';
// custom components
import MaterialIcon from '../materialIcon';
// css
import './floatingButton.scss';


////////////////////////////////////////////////////////////////////////////////
// 
// EXTRA
// 
////////////////////////////////////////////////////////////////////////////////

type FloatingButtonProps = {
  // material icon's name
  iconName: string,
  // extra classes, that you can apply to the root element,
  // when you use this component inside other ones.
  // It's assumed that will be used classes that define
  // positioning of the component
  className?: string,
  // define, whether display button in the bottom-left corner or not
  isFixed?: boolean,
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


  // UTILS
  /**
   * function returns a string, including classes for the root element
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


  // EVENT HANDLERS
  const clickHandler = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    onClick();
  }

  
  // RENDER
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
