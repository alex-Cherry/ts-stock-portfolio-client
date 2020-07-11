////////////////////////////////////////////////////////////////////////////////
// 
// IMPORT
// 
////////////////////////////////////////////////////////////////////////////////
import React, { MouseEvent } from 'react';
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
    const { isFixed = false } = props;
    // define default classes
    const classes = ["btn-floating", "btn-floating_theme_base"];
    // if isFixed, add to the root element
    // extra class, setting fixed position
    if (isFixed) {
      classes.push('btn-floating_fixed');
    }

    return classes.join(' ');
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
      onClick={clickHandler}
    >
      <MaterialIcon
        iconName={iconName}
        className="btn-floating__icon"
      />
    </div>
  );
}

export default FloatingButton;
