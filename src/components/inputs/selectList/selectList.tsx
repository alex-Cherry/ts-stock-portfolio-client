import React from 'react';
// custom components
import SelectListItem from './selectListItem';
// css
import './selectList.scss';


////////////////////////////////////////////////////////////////////////////////
// 
// EXTRA
// 
////////////////////////////////////////////////////////////////////////////////

type SelectListProps = {
  // Options of an element
  options: { id: string, name: string }[],
  // ID of an active element
  activeId?: string,
  // A text of the the first item in a list.
  // This first item isn't clickable
  listHeader?: string,

  // => Events
  // A handler fo the event-click on a list's item
  onClick?: (id: string) => void
}


////////////////////////////////////////////////////////////////////////////////
// 
// COMPONENT
// 
////////////////////////////////////////////////////////////////////////////////

const SelectList = (props: SelectListProps) => {

  const {
    activeId = '',
    onClick = (id: string) => {}
  } = props;


  // ===< EVENT HANDLERS >===
  // 
  /**
   * => SelectListItem - "onClick"
   */
  const onClickOptionHandler = (id: string) => {
    onClick(id);
  }


  // ===< UTILS >===
  // 
  /**
   * => renderHeader()
   * 
   * Renders the item of the list, that is a header
   */
  const renderHeader = () => {
    const { listHeader = '' } = props;

    if (!listHeader) {
      return null;
    }

    return (
      <SelectListItem
        id=""
        text={ listHeader }
        isHeader={ true }
      />
    );
  }
  /**
   * => renderItems()
   * 
   * Renders the items of the list, except for a header
   */
  const renderItems = () => {

    const { options } = props;

    return (
      options.map(item => (
        <SelectListItem
          key={ item.id }
          id={ item.id }
          text={ item.name }
          isActive={ activeId === item.id }
          onClick={ onClickOptionHandler }
        />
      ))
    );
  }


  // ===< RENDER >===
  // 
  return (
    <ul className='select-list' style={{ top: '-10px' }}>
      {/* Header of list */}
      { renderHeader() }
      {/* Options */}
      { renderItems() }
    </ul>
  );
}

export default SelectList;
