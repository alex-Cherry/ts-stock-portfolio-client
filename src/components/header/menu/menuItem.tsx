import React from 'react';
import { NavLink } from 'react-router-dom';
// css
import './menu.scss';


////////////////////////////////////////////////////////////////////////////////
// 
// EXTRA
// 
////////////////////////////////////////////////////////////////////////////////

export type MenuItemProps = {
  // A text of a menu item
  text: string,
  // Path of a page, where a menu item leads in.
  // Path is used without a slash at start
  path: string,
  // This component uses "NavLink" (from react-router-dom) for its rendering.
  // "NavLink" has "activeClassName"-property.
  // "useActiveClass" is a flag, whether should use this property or not
  useActiveClass?: boolean,

  // => Events
  // A click on a menu item
  onClick?: (e: React.MouseEvent<HTMLElement>) => void
}


////////////////////////////////////////////////////////////////////////////////
// 
// COMPONENT
// 
////////////////////////////////////////////////////////////////////////////////

const MenuItem = (props: MenuItemProps) => {

  const {
    text,
    path,
    useActiveClass = false,
    onClick = () => {}
  } = props;


  // ===< EVENT HANDLERS >===
  // 
  const onClickHandler = (e: React.MouseEvent<HTMLElement>) => {
    onClick(e);
  }


  // ===< RENDER >===
  // 
  return (
    <li className="menu__item">
      <NavLink
        className="menu__link"
        to={ `/${path}` }
        activeClassName={ useActiveClass ? "menu__item--active" : "" }
        onClick={ onClickHandler }
      >
        { text }
      </NavLink>
    </li>
  );
}

export default MenuItem;
