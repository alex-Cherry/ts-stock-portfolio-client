import React from 'react';
// third-party libs
import classNames from 'classnames';


////////////////////////////////////////////////////////////////////////////////
// 
// EXTRA
// 
////////////////////////////////////////////////////////////////////////////////

// PROPS
export type TabInnerProps = {
  // A text of the tab
  text: string,
  // Whether the tab is in active state or not
  active?: boolean,
  // Actially, this property is like an id of the tab.
  // It's necessary in order to we can differ one tab from other
  value?: number,
  // This property has a reference to the tab
  refTab?: React.RefObject<HTMLDivElement>,

  // => Events
  onClick?: (val: number) => void
};


////////////////////////////////////////////////////////////////////////////////
// 
// COMPONENT
// 
////////////////////////////////////////////////////////////////////////////////

const Tab = (props: TabInnerProps) => {

  // ===< PROPS >===
  // 
  const {
    text,
    active = false,
    value = 0,
    refTab = null,
    onClick = (val: number) => {}
  } = props;


  // ===< UTILS >===
  // 
  /**
   * Defines classes to apply to the root element
   */
  const getClasses = (): string => {
    const classes = classNames(
      // default classes
      'tabs__tab',
      // active state
      { 'tabs__tab--active': active }
    );

    return classes;
  }


  // ===< EVENT HANDLERS >===
  // 
  const onClickHandler = () => {
    onClick(value);
  }


  // ===< RENDER >===
  // 
  return (
    <div
      className={ getClasses() }
      onClick={ onClickHandler }
      ref={ refTab }
    >
      { text }
    </div>
  );
}

export default Tab;
