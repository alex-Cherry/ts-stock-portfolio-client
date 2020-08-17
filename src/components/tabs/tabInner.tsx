import React from 'react';
// third-party libs
import classNames from 'classnames';


////////////////////////////////////////////////////////////////////////////////
// 
// EXTRA
// 
////////////////////////////////////////////////////////////////////////////////

export type TabInnerProps = {
  text: string,
  active?: boolean,
  value?: number,
  refTab?: React.RefObject<HTMLDivElement>,
  onClick?: (val: number) => void
};


////////////////////////////////////////////////////////////////////////////////
// 
// COMPONENT
// 
////////////////////////////////////////////////////////////////////////////////

const Tab = (props: TabInnerProps) => {

  const {
    text,
    active = false,
    value = 0,
    refTab = null,
    onClick = (val: number) => {}
  } = props;


  // UTILS
  /**
   * defines classes, that need to apply to the root element
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


  // EVENT HANDLERS
  const onClickHandler = () => {
    onClick(value);
  }


  // RENDER
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
