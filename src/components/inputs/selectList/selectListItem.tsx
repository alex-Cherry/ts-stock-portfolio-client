import React from 'react';
// third-party libs
import classNames from 'classnames';


////////////////////////////////////////////////////////////////////////////////
// 
// EXTRA
// 
////////////////////////////////////////////////////////////////////////////////

type SelectListItemProps = {
  id: string,
  // A text of an item
  text: string,
  // Whether an item is active
  isActive?: boolean,
  // Whether an item is a header
  isHeader?: boolean,
  // className?: string,

  // => Events
  onClick?: (id: string) => void
}


////////////////////////////////////////////////////////////////////////////////
// 
// COMPONENT
// 
////////////////////////////////////////////////////////////////////////////////

const SelectListItem = (props: SelectListItemProps) => {

  const {
    id,
    text,
    isActive = false,
    onClick = (id: string) => {}
  } = props;


  // ===< UTILS >===
  // 
  /**
   * Defines classes, that need to apply to the root element
   */
  const getClasses = (): string => {
    const { isHeader = '' } = props;

    const classes = classNames(
      // default classes
      'select-list__item',
      // class for active element
      { 'select-list__item--selected': isActive },
      // class for header-element
      { 'select-list__item--header': isHeader },
    );

    return classes;
  }


  // ===< RENDER >===
  // 
  return (
    <li
      className={ getClasses() }
      onClick={ () => onClick(id) }
    >
      { text }
      {/* if the element is active, display tick */}
      { isActive && <span className="select-list__tick"></span> }
    </li>
  );
}

export default SelectListItem;
