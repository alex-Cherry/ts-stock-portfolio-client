import React from 'react';
// third-party libs
import classNames from 'classnames';
// css
import './badge.scss';


////////////////////////////////////////////////////////////////////////////////
// 
// EXTRA
// 
////////////////////////////////////////////////////////////////////////////////

type BadgeProps = {
  // text of the notification
  text: string,
  // extra classes, that you can apply to the root element,
  // when you use this component inside other ones.
  // It's assumed that will be used classes that define
  // positioning of the component
  className?: string,
  // mark, that special class will be applied
  active?: boolean,
  // 
  onClick?: () => void
};


////////////////////////////////////////////////////////////////////////////////
// 
// COMPONENT
// 
////////////////////////////////////////////////////////////////////////////////

const Badge = (props: BadgeProps) => {

  // desctructure props
  const {
    text,
    onClick = () => {}
  } = props;


  // UTILS
  /**
   * defines classes, that need to apply to the root element
   */
  const getClasses = (): string => {

    const {
      active = false,
      className = ''
    } = props;

    const classes = classNames(
      // default classes
      'badge',
      // if the element is active, add a spec class
      { 'badge--active': active },
      // classes from props
      { [`${className}`]: !!className }
    );

    return classes;
  }
  
  
  // RENDER
  return (
    <span
      className={getClasses()}
      onClick={onClick}
    >
      { text }
    </span>
  );

}

export default Badge;
