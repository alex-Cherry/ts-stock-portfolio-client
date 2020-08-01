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
  label?: string,
  value?: string,
  listHeader?: string,
  options: { id: string, name: string }[],
  errorMsg?: string,
  validate?: boolean,
  valid?: boolean,
  className?: string,
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


  // EVENT HANDLERS
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
  

  // UTILS
  /**
   * 
   * @param id: string
   * 
   * returns a value from the list by a given id
   */
  const valueById = (id: string): string => {
    return options.find(option => option.id === id)?.name || '';
  }
  /**
   * defines classes, that need to apply to the root element
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
   * defines classes for the label
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
   * func returns modal window with the list of the options
   */
  const renderModalSelectList = () => {
    if (showModal) {
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

    return null;
  }


  // RENDER
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
