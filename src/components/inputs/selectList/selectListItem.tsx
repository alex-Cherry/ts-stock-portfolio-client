import React from 'react';

type SelectListItemProps = {
  id: string,
  text: string,
  isActive?: boolean,
  isHeader?: boolean,
  className?: string,
  onClick?: (id: string) => void
}

const SelectListItem = (props: SelectListItemProps) => {

  const {
    id,
    text,
    isActive = false,
    onClick = (id: string) => {}
  } = props;

  const getClasses = (): string => {
    const { isHeader = '' } = props;

    const classes = ['select-list__item'];
    if (isActive) {
      classes.push('select-list__item_selected');
    }
    if (isHeader) {
      classes.push('select-list__item_header');
    }

    return classes.join(' ');
  }


  // RENDER
  return (
    <li
      className={ getClasses() }
      onClick={() => onClick(id)}
    >
      { text }
      {/* if the element is active, display tick */}
      { isActive && <span className="select-list__tick"></span> }
    </li>
  );
}

export default SelectListItem;
