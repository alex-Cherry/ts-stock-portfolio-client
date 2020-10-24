import React, { ChangeEvent, KeyboardEvent } from 'react';
// Third-party libs
import classNames from 'classnames';
import { v4 as uuid } from 'uuid';
// Utils
import { validate as validateInput, ValidationsRuleType } from '../../utils/inputChecker/validate';
// CSS
import './inputs.scss';


// DESCRIPTION:
// 
// This component allows users to enter text data.
// 


////////////////////////////////////////////////////////////////////////////////
// 
// EXTRA
// 
////////////////////////////////////////////////////////////////////////////////

export type inputType = 'text' | 'password' | 'email';

// PROPS
type InputProps = {
  // A label of the input
  label: string,
  // A value of the input
  value: string,
  // id of the input-element
  id?: string,
  // Define a type of the component
  type?: inputType,
  // Extra classes, that you can apply to the root element,
  //  when you use this component inside other ones.
  // It's assumed that will be used classes that define
  //  positioning of the component
  className?: string,
  // Specifies whether display an error in case of non-valid value
  validate?: boolean,
  // The flag shows that all fields must be validated
  //  regardless whether they is changed or not
  forceValidation?: boolean,
  // Rules which will be used to validate the value
  validations?: ValidationsRuleType,

  inputRef?: React.RefObject<HTMLInputElement>,

  // This function defines how the value will be displayed in the input-element.
  // If this function isn't set, the value will be displayed with no formatting (transformation)
  formatValueFunction?: (data: string) => string,
  // This function is opposite of the previous one.
  // It gets the plain value from the formatted (transformed) one.
  // If the function isn't set there won't be the reverse transformation
  interpretValueFunction?: (data: string) => string,

  // => Events
  onChange?: (value: string, valid: boolean) => void,
  onKeyPress?: (event: KeyboardEvent<HTMLInputElement>) => void,
  onPressEnter?: () => void,
  onChangeValidity?: (valid: boolean) => void
};

// STATE
type InputState = {
  isTouched: boolean,
  isFocused: boolean,
  // errorMessage: string
};


////////////////////////////////////////////////////////////////////////////////
// 
// COMPONENT
// 
////////////////////////////////////////////////////////////////////////////////
class Input extends React.Component<InputProps, InputState>  {

  // ===< CLASS FIELDS >===
  // 
  private id: string = '';
  private isChanged: boolean = false;
  private errorMessage: string = '';
  // Classes for the label
  // -> for position
  private classLabelActive = 'input-field__label--active';
  // -> for color
  private classLabelValid = 'input-field__label--valid';
  private classLabelInvalid = 'input-field__label--invalid';
  private classLabelFocused = 'input-field__label--focused';
  // Classes for the input
  private classInputValid = 'input-field__input--valid';
  private classInputInvalid = 'input-field__input--invalid';


  // ===< CONSTRUCTOR >===
  // 
  constructor(props: InputProps) {
    super(props);

    const { id = '' } = this.props;
    // Generate id
    this.id = id ? id : 'input_' + uuid();
    // State
    this.state = {
      isTouched: false,
      isFocused: false,
      // errorMessage: ''
    }
  }


  // ===< LIFECYCLE >===
  // 
  /**
   * => componentDidMount()
   */
  componentDidMount = () => {
    const { forceValidation = false } = this.props;

    if (forceValidation && this.needValidate()) {
      this.forceValidation();
    }
  }
  /**
   * => componentDidUpdate()
   */
  componentDidUpdate = (prevProps: InputProps) => {
    
    // Destructure the props
    const {
      forceValidation: prevForceValidation = false
    } = prevProps;
    const {
      forceValidation = false
    } = this.props;

    // Force validation
    if (prevForceValidation !== forceValidation && forceValidation && this.needValidate()) {
      this.forceValidation();
    }
  }


  // ===< EVENT HANDLERS >===
  // 
  /**
   * => Input - "onFocus"
   */
  onFocusInputHandler = () => {
    this.setFocused(true);
  }
  /**
   * => Input - "onBlur"
   */
  onBlurInputHandler = () => {
    this.setFocused(false);
    if (this.needValidate()) {
      // The input becomes touched
      this.setTouched();
    }
  }
  /**
   * => Input - "onChange"
   * 
   */ 
  onChangeInputHandler = (event: ChangeEvent<HTMLInputElement>) => {
    
    const {
      onChange = (value: string, valid: boolean) => {}
    } = this.props;
    
    let value = event.target.value;
    let valid = true;

    if (this.needValidate()) {
      // The input becomes touched
      this.setChanged();
      // Transpile the value
      value = this.interpretValue(value);
      // Validate the value
      valid = this.doValidate(value);
    }
    // Run the event "onChange" from the props
    onChange(value, valid);
  }
  /**
   * => Input - "onKeyDown"
   */
  onKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
    // Destructure the props
    const {
      onPressEnter = () => {},
      onKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {}
    } = this.props;

    // Key "Enter"
    if (event.key === 'Enter') {
      onPressEnter()

    // Another key
    } else {
      onKeyPress(event);
    }
  }


  // ===< UTILS >===
  // 
  /**
   * => getClasses()
   * 
   * Defines classes to apply to the root element
   */
  getClasses = (): string => {

    const { className = '' } = this.props;

    const classes = classNames(
      // Default classes
      'input-field',
      // Classes from the props
      { [`${className}`]: !!className }
    );

    return classes;
  }
  /**
   * => getClassesForInput()
   * 
   * Defines classes to apply to the input
   */
  getClassesForInput = (): string => {

    const classes = classNames(
      // Default classes
      'input-field__input',

      // The next classes are applied when this.needApplyValidation() and
      // -> valid
      { [`${this.classInputValid}`]: this.needApplyValidation() && this.isValid() },
      // -> not valid
      { [`${this.classInputInvalid}`]: this.needApplyValidation() && !this.isValid() }
    );

    return classes;
  }
  /**
   * => getClassesForLabel()
   * 
   * Defines classes to apply to the label
   */
  getClassesForLabel = (): string => {
    
    const { isFocused } = this.state;

    const classes = classNames(
      // Default classes
      'input-field__label',
      // When there is a value in the input or the input is focused,
      //  we apply '--active' modificator
      { [`${this.classLabelActive}`]: this.isValueSet() || isFocused },

      // The next classes are mutually exclusive
      { [`${this.classLabelValid}`]: isFocused && this.needApplyValidation() && this.isValid() },
      { [`${this.classLabelInvalid}`]: isFocused && this.needApplyValidation() && !this.isValid() },
      { [`${this.classLabelFocused}`]: isFocused && !this.needApplyValidation() }
    );

    return classes;
  }
  /**
   * => isValueSet()
   * 
   * The function returns the flag whether there is a value is in the input
   */
  isValueSet = (): boolean => {
    const { value } = this.props;
    return !!value.trim();
  }
  /**
   * => isValid()
   * 
   * The function returns the flag whether the value is valid or not
   */
  isValid = (): boolean => {
    return !this.getError();
  }
  /**
   * => needValidate()
   * 
   * Returns whether to validate the value in the input
   */
  needValidate = (): boolean => {
    const { validate = false } = this.props;
    return validate;
  }
  /**
   * => needApplyValidation()
   */
  needApplyValidation = (): boolean => {
    const { isTouched } = this.state;
    return this.needValidate() && isTouched;
  }
  /**
   * => setChanged()
   * 
   * The function sets the variable "isChanged" to "true"
   */
  setChanged = (): void => {
    if (!this.isChanged) {
      this.isChanged = true;
    }
  }
  /**
   * => setFocused()
   * 
   * Sets the state "isFocused" to the parameter
   * 
   * @param value - the assignable value
   */
  setFocused = (value: boolean): void => {
    this.setState({ isFocused: value });
  }
  /**
   * => setTouched()
   * 
   * The function sets the state "isTouched" to "true"
   */
  setTouched = (): void => {
    const { isTouched } = this.state;
    // We change the state only if the value is changed and isn't touched yet.
    // We avoid frequent state changes
    if (this.isChanged && !isTouched) {
      this.setState({ isTouched: true });
    }
  }
  /**
   * => setError()
   * 
   * The function sets the variable "errorMessage" to the parameter "msg"
   * 
   * @param msg - the assignable message
   */
  setError = (msg: string): void => {
    this.errorMessage = msg;
    // this.setState({ errorMessage: msg })
  }
  /**
   * => getError()
   * 
   * The function gets the variable "errorMessage"
   * 
   * @param msg - the assignable message
   */
  getError = (): string => {
    return this.errorMessage;
    // return this.state.errorMessage;
  }
  /**
   * => renderErrors()
   * 
   * The function returns a block with an error description
   */
  renderErrors = () => {
    if (this.needApplyValidation() && !this.isValid()) {
      return (
        <span className="input-field__error">{ this.getError() }</span>  
      );
    }
    return null;
  }
  /**
   * => doValidate()
   * 
   * The function validates the parameter according to specified rules.
   * Also sets the error messsage
   * 
   * @param value - the value to validate
   */
  doValidate = (value: string): boolean => {
    // Get the rules from the props
    const { validations = {} } = this.props;
    // Validate the value
    const { valid, msg } = validateInput(value, validations);
    // The error msg
    this.setError(msg);

    return valid;
  }
  /**
   * => forceValidation()
   * 
   * 
   */
  forceValidation = (): void => {
    // 
    const { value } = this.props;

    if (this.needValidate()) {
      this.doValidate(value);
      this.setChanged();
      this.setTouched();
    }
  }
  /**
   * => formatValue()
   * 
   * This function defines how the value will be displayed in the input-element.
   * 
   * @param data - the string to format
   */
  formatValue = (data: string): string => {
    const {
      formatValueFunction = (data: string): string => { return data; }
    } = this.props;
    return formatValueFunction(data);
  }
  /**
   * => interpretValue()
   * 
   * Thsi function tries to get the plain value from the formatted one.
   * 
   * @param data - the string to interpret
   */
  interpretValue = (data: string): string => {
    const {
      interpretValueFunction = (data: string): string => { return data; }
    } = this.props;
    return interpretValueFunction(data);
  }


  // ===< RENDER >===
  // 
  render = () => {
    
    const {
      label,
      value,
      type="text",
      inputRef
    } = this.props;

    return (
      <div
        className={ this.getClasses() }
      >
        {/* Input */}
        <input
          id={ this.id }
          type={ type }
          value={ this.formatValue(value) }
          className={ this.getClassesForInput() }
          // Ref
          ref={ inputRef }
          // Events
          onFocus={ this.onFocusInputHandler }
          onBlur={ this.onBlurInputHandler }
          onChange={ this.onChangeInputHandler }
          onKeyDown={ this.onKeyDownHandler }
        />

        {/* Label */}
        <label
          htmlFor={ this.id }
          className={ this.getClassesForLabel() }
        >
          { label }
        </label> 

        {/* Error */}
        { this.renderErrors() }

      </div>
    );
  }
}

export default Input;
