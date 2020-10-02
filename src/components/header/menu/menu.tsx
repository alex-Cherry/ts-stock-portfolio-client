import React from 'react';
// third-party libs
import classNames from 'classnames';
// custom components
import MenuItem, { MenuItemProps } from './menuItem';
// css
import './menu.scss';


////////////////////////////////////////////////////////////////////////////////
// 
// EXTRA
// 
////////////////////////////////////////////////////////////////////////////////

type MenuProps = {
  // Items of a menu
  items: MenuItemProps[],
  // Extra classes, that you can apply to the root element,
  // when you use this component inside other ones.
  // It's assumed that will be used classes that define
  // positioning of the component
  className?: string,
  // Component "Menu" uses component "MenuItem",
  // which uses "NavLink" (from react-router-dom) for its rendering.
  // "NavLink" has "activeClassName"-property.
  // "useActiveClass" is a flag, whether should use this property or not
  useActiveClass?: boolean
}


////////////////////////////////////////////////////////////////////////////////
// 
// COMPONENT
// 
////////////////////////////////////////////////////////////////////////////////

const Menu = (props: MenuProps) => {

  // ===< UTILS >===
  // 
  /**
   * Func maps each element of items array
   * to a react component "MenuItem"
   * and render these components
   */
  const renderItems = () => {
    const { items, useActiveClass = false } = props;
    return items.map((item, idx) => <MenuItem key={ idx } { ...item } useActiveClass={ useActiveClass }  />)
  }
  /**
   * Defines classes, that need to apply to the root element
   */
  const getClasses = (): string => {

    const { className } = props;

    const classes = classNames(
      // default classes
      'menu',
      // classes from props
      { [`${className}`]: !!className }
    );

    return classes;
  }


  // ===< RENDER >===
  // 
  return (
    <ul className={ getClasses() }>
      { renderItems() }
    </ul>
  );
}

export default Menu;
