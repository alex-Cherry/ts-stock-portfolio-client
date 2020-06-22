////////////////////////////////////////////////////////////////////////////////
// 
// IMPORT
// 
////////////////////////////////////////////////////////////////////////////////
import React from 'react';


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

const ListForSelect = (props: ListForSelectProps) => {

  const {
    options,
    listHeader = 'Выберите вариант...',
    activeId = '',
    onClick = (id: string) => {}
  } = props;

  const onClickOptionHandler = (id: string) => {
    onClick(id);
  }

  return (
    <ul className='select-list' style={{ top: '-10px' }}>

        {/* Header of list */}
        <li
          className="header"
          onClick={() => onClickOptionHandler('')}
        >
          <span>{listHeader}</span>
        </li>

        {/* Options */}
        {
          options.map(item => (
            <li
              key={item.id}
              className={activeId === item.id ? 'selected' : ''}
              onClick={() => onClickOptionHandler(item.id)}
            >
              <span className="select-list-item-title">{item.name}</span>
              <span className="select-list-item-tick"></span>
            </li>
          ))
        }
        
      </ul>
  );
}

export default ListForSelect;
