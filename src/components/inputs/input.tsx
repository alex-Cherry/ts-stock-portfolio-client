import React, { ChangeEvent, KeyboardEvent, useRef } from 'react';
// utils
import { setClass, removeClass } from '../../utils/checkClassesForRefObjects';
// types
import { inputType } from '../../types/inputTypes';
// css
import './inputs.scss';


////////////////////////////////////////////////////////////////////////////////
// 
// EXTRA
// 
////////////////////////////////////////////////////////////////////////////////

type InputProps = {
  id: string,
  label?: string,
  type?: inputType,
  value: string,
  errorMsg?: string,
  validate?: boolean,
  valid?: boolean,
  inputRef?: React.RefObject<HTMLInputElement>,
  onChange?: (data: string) => void,
  onFocus?: () => void,
  onBlur?: () => void,
  onPressEnter?: () => void
}


////////////////////////////////////////////////////////////////////////////////
// 
// COMPONENT
// 
////////////////////////////////////////////////////////////////////////////////

// FormInput
const Input = (props: InputProps) => {

  const {
    id = '',
    label = 'input',
    type = 'text',
    value = '',
    errorMsg = '',
    validate = false,
    valid = true,
    inputRef,
    onChange = (data: string) => {},
    onFocus = () => {},
    onBlur = () => {},
    onPressEnter = () => {}
  } = props;
  // define refs
  const divRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLLabelElement>(null);

  // EVENT HANDLERS
  //  => onFocus
  const onFocusInputHandler = () => {
    setClass(labelRef, 'active');

    if (validate) {
      if (valid) {
        setClass(labelRef, 'color-valid');
      } else {
        setClass(labelRef, 'color-invalid');
      }
    } else {
      setClass(labelRef, 'color-focus');
    }
    // onFocus from props
    onFocus();
  }
  //  => onBlur
  const onBlurInputHandler = () => {
    if (!value.trim()) {
      removeClass(labelRef, 'active');
    }
    removeClass(labelRef, 'color-valid');
    removeClass(labelRef, 'color-invalid');
    removeClass(labelRef, 'color-focus');
    onBlur();
  }
  //  => onChange
  const onChangeInputHandler = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  }
  //  => onKeyPress
  const onKeyPressInputHandler = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      onPressEnter();
    }
  }

  // let pattern = null;
  // if (type === 'number') {
  //   pattern = '\d+';
  // }

  // define css-classes for the element
  const classNames = ["input-field1"];
  if (validate) {
    if (valid) {
      classNames.push('valid');
    } else {
      classNames.push('invalid');
    }
  }

  let labelClassname = '';
  if (value.trim()) {
    labelClassname = 'active';
  }
  
  // RENDER
  return (
    // <div className="input-field1 error">
    <div
      className={classNames.join(' ')}
      ref={divRef}
    >
      {/* input */}
      <input
        type={type}
        id={id}
        value={value}
        ref={inputRef}
        
        onFocus={onFocusInputHandler}
        onBlur={onBlurInputHandler}
        onChange={onChangeInputHandler}
        onKeyPress={onKeyPressInputHandler}
      />
      {/* label */}
      <label
        htmlFor={id}
        ref={labelRef}
        className={labelClassname}
      >
        {label}
      </label> 
      {/* error */}
      {validate && !valid && errorMsg && (
        <span>{errorMsg}</span>
      )}
    </div>
  );
}

export default Input;
