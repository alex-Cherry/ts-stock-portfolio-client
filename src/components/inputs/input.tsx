import React, { ChangeEvent, KeyboardEvent, useRef } from 'react';
// third-party libs
import classNames from 'classnames';
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
  className?: string,
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
  // 
  // classes for label
  const classLabelActive = 'input-field__label--active';
  const classLabelValid = 'input-field__label--valid';
  const classLabelInvalid = 'input-field__label--invalid';
  const classLabelFocused = 'input-field__label--focused';
  // classes for input
  const classInputValid = 'input-field__input--valid';
  const classInputInvalid = 'input-field__input--invalid';
  // define refs
  const divRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLLabelElement>(null);


  // EVENT HANDLERS
  //  => onFocus
  const onFocusInputHandler = () => {
    setClass(labelRef, classLabelActive);

    if (validate) {
      if (valid) {
        setClass(labelRef, classLabelValid);
      } else {
        setClass(labelRef, classLabelInvalid);
      }
    } else {
      setClass(labelRef, classLabelFocused);
    }
    // onFocus from props
    onFocus();
  }
  //  => onBlur
  const onBlurInputHandler = () => {
    if (!isValueSet()) {
      removeClass(labelRef, classLabelActive);
    }
    removeClass(labelRef, classLabelValid);
    removeClass(labelRef, classLabelInvalid);
    removeClass(labelRef, classLabelFocused);
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


  // UTILS
  /**
   * func defines, whether there is a value in the input or not
   */
  const isValueSet = (): boolean => {
    const { value } = props;
    return !!value.trim();
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
   * defines classes for the input
   */
  const getClassesForInput = (): string => {

    const classes = classNames(
      // default classes
      'input-field__input',
      // class, if a value in the input is valid
      { [`${classInputValid}`]: validate && valid  },
      // class, if a value in the input isn't valid
      { [`${classInputInvalid}`]: validate && !valid  }
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
      { [`${classLabelActive}`]: isValueSet() }
    );

    return classes;
  }
  /**
   * func returns a block with an error description
   */
  const renderErrors = () => {
    if (validate && !valid && errorMsg) {
      return (
        <span className="input-field__error">{ errorMsg }</span>  
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
        id={ id }
        type={ type }
        value={ value }
        ref={ inputRef }
        className={ getClassesForInput() }
        
        onFocus={ onFocusInputHandler }
        onBlur={ onBlurInputHandler }
        onChange={ onChangeInputHandler }
        onKeyPress={ onKeyPressInputHandler }
      />

      {/* Label */}
      <label
        htmlFor={ id }
        ref={ labelRef }
        className={ getClassesForLabel() }
      >
        { label }
      </label> 

      {/* Error */}
      { renderErrors() }

    </div>
  );
}

export default Input;
