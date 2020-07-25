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

type ListForSelectProps = {
  options: { id: string, name: string }[],
  activeId?: string,
  listHeader?: string,
  onClick?: (id: string) => void
}


////////////////////////////////////////////////////////////////////////////////
// 
// COMPONENT
// 
////////////////////////////////////////////////////////////////////////////////

const SelectList = (props: ListForSelectProps) => {

  const {
    activeId = '',
    onClick = (id: string) => {}
  } = props;

  const onClickOptionHandler = (id: string) => {
    onClick(id);
  }

  const renderHeader = () => {
    const { listHeader = '' } = props;

    if (!listHeader) {
      return null;
    }

    return (
      <SelectListItem
        id=""
        text={listHeader}
        isHeader={true}
      />
    );
  }

  const renderItems = () => {

    const { options } = props;

    return (
      options.map(item => (
        <SelectListItem
          key={item.id}
          id={item.id}
          text={item.name}
          isActive={activeId === item.id}
          onClick={onClickOptionHandler}
        />
      ))
    );
  }


  // RENDER
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
