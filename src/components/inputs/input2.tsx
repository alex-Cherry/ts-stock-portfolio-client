import React, { ChangeEvent, KeyboardEvent } from 'react';
// Third-party libs
import classNames from 'classnames';
import { v4 as uuid } from 'uuid';
// Utils
import { validate as validateInput, ValidationsRuleType } from '../../utils/inputChecker/validate';
// CSS
import './inputs.scss';


////////////////////////////////////////////////////////////////////////////////
// 
// EXTRA
// 
////////////////////////////////////////////////////////////////////////////////

export type inputType = 'text' | 'password' | 'email' | 'number';

// PROPS
type InputProps = {
  // A label of the input
  label: string,
  // A value of the input
  data: string,
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

  // => Events
  onChange?: (value: string, valid: boolean) => void,
  onPressEnter?: () => void
};

// STATE
type InputState = {
  isTouched: boolean,
  isFocused: boolean
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
      isFocused: false
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
    const { forceValidation: prevForceValidation = false } = prevProps;
    const { forceValidation = false } = this.props;

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
    const { onChange = (value: string, valid: boolean) => {} } = this.props;

    const value = event.target.value;
    let valid = true;

    if (this.needValidate()) {
      // The input becomes touched
      this.setChanged();
      // Validate the value
      valid = this.doValidate(value);
    }
    // Run the event "onChange" from the props
    onChange(value, valid);
  }
  /**
   * => Input - "onKeyPress"
   */
  onKeyPressInputHandler = (event: KeyboardEvent<HTMLInputElement>) => {
    const { onPressEnter = () => {} } = this.props;
    if (event.key === 'Enter') {
      // Run the event from the props
      onPressEnter();
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
    const { data } = this.props;
    return !!data.trim();
  }
  /**
   * => isValid()
   * 
   * The function returns the flag whether the value is valid or not
   */
  isValid = (): boolean => {
    return !this.errorMessage;
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
  }
  /**
   * => renderErrors()
   * 
   * The function returns a block with an error description
   */
  renderErrors = () => {
    if (this.needApplyValidation() && !this.isValid()) {
      return (
        <span className="input-field__error">{ this.errorMessage }</span>  
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
    const { data } = this.props;

    if (this.needValidate()) {
      this.doValidate(data);
      this.setChanged();
      this.setTouched();
    }
  }


  // ===< RENDER >===
  // 
  render = () => {

    const {
      label,
      data,
      type="text"
    } = this.props;

    return (
      <div
        className={ this.getClasses() }
      >
        {/* Input */}
        <input
          id={ this.id }
          type={ type }
          value={ data }
          // ref={ inputRef }
          className={ this.getClassesForInput() }
          
          onFocus={ this.onFocusInputHandler }
          onBlur={ this.onBlurInputHandler }
          onChange={ this.onChangeInputHandler }
          onKeyPress={ this.onKeyPressInputHandler }
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
