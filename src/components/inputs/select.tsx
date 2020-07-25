import React, { useState, useRef } from 'react';
// custom components
import Backdrop from '../backdrop';
import SelectList from './listForSelect';
// svg
import arrowDown from '../../assets/svg/arrowDown.svg';
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
  onChange?: (data: string) => void
}


////////////////////////////////////////////////////////////////////////////////
// 
// COMPONENT
// 
////////////////////////////////////////////////////////////////////////////////

const Select = (props: SelectProps) => {

  const [showModal, setShowModal] = useState(false);

  // refs
  const divRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLLabelElement>(null);
  // desctructure props
  const {
    id = '',
    label = '',
    onChange = (id: string) => {},
    value = '',
    options,
    listHeader = 'Выберите вариант ...'
  } = props;

  // EVENT HANDLERS
  const onClickOptionHandler = (id: string) => {
    onChange(id);
    setShowModal(false);
  }
  const onClickInputHandler = () => {
    setShowModal(true);
  }
  const onClickArrowHandler = () => {
    setShowModal(true);
  }
  const onClickBackdropHandler = () => {
    setShowModal(false);
  }
  
  // UTILS
  const valueById = (id: string): string => {
    return options.find(option => option.id === id)?.name || '';
  }
  const classesForLabel = () => {
    const { value = '' } = props;
    let labelClassName = '';
    if (value) {
      labelClassName = 'active';
    }

    return labelClassName;
  }

  // define <list> and <backdrop>
  let list = null;
  let backdrop = null;
  if (showModal) {
    // list
    list = (
      <SelectList
        options={options}
        activeId={value}
        listHeader={listHeader}
        onClick={onClickOptionHandler}
      />
    );
    // backdrop
    backdrop = (
      <Backdrop
        onClick={onClickBackdropHandler}
      />
    );
  }

  // RENDER
  return (
    <div
      className="input-field1"
      ref={divRef}
    >
      <div className="select-wrapper">
        {/* input */}
        <input
          readOnly
          id={id}
          value={valueById(value)}
          onClick={onClickInputHandler}
        />
        {/* list */}
        {list}
        {/* backdrop */}
        {backdrop}
        {/* arrow svg */}
        <img
          src={arrowDown}
          alt=''
          className="caret"
          onClick={onClickArrowHandler}
        />
        {/* label */}
        <label
          htmlFor={id}
          ref={labelRef}
          className={classesForLabel()}
        >
          {label}
        </label> 

      </div>
    </div>
  );
}

export default Select;
