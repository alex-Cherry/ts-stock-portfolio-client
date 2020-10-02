import React, { ChangeEvent, KeyboardEvent, useRef } from 'react';
// third-party libs
import classNames from 'classnames';
// utils
import { setClass, removeClass } from '../../utils/checkClassesForRefObjects';
// css
import './inputs.scss';


////////////////////////////////////////////////////////////////////////////////
// 
// EXTRA
// 
////////////////////////////////////////////////////////////////////////////////

export type inputType = 'text' | 'password' | 'email' | 'number';


// at the core of the react-component "Input" is an html-element "input"
type InputProps = {
  id: string,
  // A label of an input
  label: string,
  // Define a type of a component
  type?: inputType,
  // Specifies a value of an input
  value: string,
  // Extra classes, that you can apply to the root element,
  // when you use this component inside other ones.
  // It's assumed that will be used classes that define
  // positioning of the component
  className?: string,
  // An error message. It's displayed if the property "valid" = false
  errorMsg?: string,
  // Specifies whether display an error in the case of non-valid value.
  // If "validate" = false, "errorMsg" won't be displayed in any case,
  // If "validate" = true, "errorMsg" will be displayed if "valid" = false
  validate?: boolean,
  // Specifies whether a value is valid or not
  valid?: boolean,
  // In the base of a component "Input" is html-element "input".
  // So this prop has a reference to this input.
  // It's nec. for manipulating with it by outer elements
  inputRef?: React.RefObject<HTMLInputElement>,

  // => Events
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
  // classes for the label
  const classLabelActive = 'input-field__label--active';
  const classLabelValid = 'input-field__label--valid';
  const classLabelInvalid = 'input-field__label--invalid';
  const classLabelFocused = 'input-field__label--focused';
  // classes for the input
  const classInputValid = 'input-field__input--valid';
  const classInputInvalid = 'input-field__input--invalid';
  // define refs
  const divRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLLabelElement>(null);


  // ===< EVENT HANDLERS >===
  // 
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


  // *** UTILS
  /**
   * Func defines, whether there is a value in the input or not
   */
  const isValueSet = (): boolean => {
    const { value } = props;
    return !!value.trim();
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
   * Defines classes for the input
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
   * Defines classes for the label
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
   * Func returns a block with an error description
   */
  const renderErrors = () => {
    if (validate && !valid && errorMsg) {
      return (
        <span className="input-field__error">{ errorMsg }</span>  
      );
    }

    return null;
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
