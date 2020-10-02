import React, { useState, useRef } from 'react';
// custom components
import Backdrop from '../backdrop';
import SelectList from './selectList';
// third-party libs
import classNames from 'classnames';
// svg
import imgArrowDown from '../../assets/svg/arrowDown.svg';
// css
import './inputs.scss';


////////////////////////////////////////////////////////////////////////////////
// 
// EXTRA
// 
////////////////////////////////////////////////////////////////////////////////

type SelectProps = {
  id: string,
  // A label for a component "Select".
  // It's displayed when no option is chosen
  label?: string,
  // id of the selected item
  value?: string,
  // A text of the the first item in a select list.
  // It's like an info item and doesn't have id.
  // This first item isn't clickable
  listHeader?: string,
  // Items of the select list.
  // Each item has two string fields: id and name.
  options: { id: string, name: string }[],
  // Extra classes, that you can apply to the root element,
  // when you use this component inside other ones.
  // It's assumed that will be used classes that define
  // positioning of the component
  className?: string,

  // => Events
  // A change of a value in a select list
  onChange?: (data: string) => void
}


////////////////////////////////////////////////////////////////////////////////
// 
// COMPONENT
// 
////////////////////////////////////////////////////////////////////////////////

const Select = (props: SelectProps) => {

  const [showModal, setShowModal] = useState(false);

  // desctructure props
  const {
    id = '',
    label = '',
    onChange = (id: string) => {},
    value = '',
    options,
    listHeader = 'Выберите вариант ...'
  } = props;
  //  
  const classLabelActive = 'input-field__label--active';
  // refs
  const divRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLLabelElement>(null);


  // ===< EVENT HANDLERS >===
  // 
  const onClickOptionHandler = (id: string) => {
    onChange(id);
    setShowModal(false);
  }
  // const onClickInputHandler = () => {
  //   setShowModal(true);
  // }
  const onClickArrowHandler = () => {
    setShowModal(true);
  }
  const onClickBackdropHandler = () => {
    setShowModal(false);
  }
  

  // ===< UTILS >===
  // 
  /**
   * 
   * @param id
   * 
   * Returns a value from the list by the given id
   */
  const valueById = (id: string): string => {
    return options.find(option => option.id === id)?.name || '';
  }
  /**
   * Defines classes, that need to apply to the root element
   */
  const getClasses = (): string => {

    const {
      className = ''
    } = props;

    const classes = classNames(
      // default classes
      'input-field',
      // classes from props
      { [`${className}`]: !!className }
    );

    return classes;
  }
  /**
   * Defines classes for the label
   */
  const getClassesForLabel = (): string => {

    const classes = classNames(
      // default classes
      'input-field__label',
      // class, when there is a value in the input.
      // we apply '--active' modificator
      { [`${classLabelActive}`]: !!value }
    );

    return classes;
  }
  /**
   * Func returns modal window with the list of the options
   */
  const renderModalSelectList = () => {
    if (!showModal) {
      return null;
    }

    return (
      <>
        {/* Backdrop */}
        <Backdrop
          onClick={ onClickBackdropHandler }
        />
        {/* Select List */}
        <SelectList
          options={ options }
          activeId={ value }
          listHeader={ listHeader }
          onClick={ onClickOptionHandler }
        />
      </>
    );
  }


  // ===< RENDER >===
  // 
  return (
    <div
      className={ getClasses() }
      ref={ divRef }
    >
        {/* Input */}
        <input
          readOnly
          id={ id }
          className="input-field__input"
          value={ valueById(value) }
          // onClick={ onClickInputHandler }
        />

        {/* arrow svg */}
        <img
          src={ imgArrowDown }
          alt=''
          className="input-field__caret"
          onClick={ onClickArrowHandler }
        />

        {/* Label */}
        <label
          htmlFor={ id }
          ref={ labelRef }
          className={ getClassesForLabel() }
        >
          { label }
        </label> 

        {/* List */}
        { renderModalSelectList() }

    </div>
  );
}

export default Select;
