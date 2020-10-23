import React, { KeyboardEvent } from 'react';
// Custom components
import Input from './input';
// Currency utils
import  {
  getNumGroups,
  formatStrValue as formatValue,
  getIntegerPart,
  getIntegerPartWithSeparators,
  getSumFromString,
  getFractionalPart
} from './currencyUtils';
// Utils
import { ValidationsRuleType } from '../../utils/inputChecker/validate';


// DESCRIPTION:
// 
// This component allows to edit a monetory value.
// A currency symbol are also displayed along with the sum.
// 
// Available currencies are defined in the enum "Currencies".
// In the constant "CurrencySymbols" are determined appropriate currency symbols.
// 
// In the base of the component is a custom react component "Input".
// 


////////////////////////////////////////////////////////////////////////////////
// 
// EXTRA
// 
////////////////////////////////////////////////////////////////////////////////

// Available currencies
export enum Currencies {
  RUB = 'RUB',
  USD = 'USD'
}
// Appropriate currency symbols
const CurrencySymbols = {
  'RUB': String.fromCharCode(0x20BD),
  'USD': String.fromCharCode(0x24)
}

type DecimalSeparatorType = '.' | ',';

type GroupSeparatorType = ' ' | ',';

type CurrencyPositionType = 'prefix' | 'postfix' | 'none';

export type CurrencySettings = {
  currencyPosition: CurrencyPositionType,
  currencySymbol: string,
  groupSeparator: GroupSeparatorType,
  decimalSeparator: DecimalSeparatorType,
  integerDigits: number,
  fractionDigits: number
};


// PROPS
type CurrencyInputProps =  {
  // A label
  label: string,
  // A value
  value: number,
  // Extra classes, that you can apply to the root element,
  //  when you use this component inside other ones.
  // It's assumed that will be used classes that define
  //  positioning of the component
  className?: string,
  // The flag shows that all fields must be validated
  //  regardless whether they is changed or not
  forceValidation?: boolean,
  // Specifies whether
  //  - validate the value
  //  - display an error message in the case of non-valid value
  validate?: boolean,
  // Stores validations which will be used for check of the value
  validations?: ValidationsRuleType,
  // Specifies the currency
  currency?: Currencies,
  // Specifies a sign that separates thousands groups.
  //  1000000 => ',' => 1,000,000
  //  1000000 => ' ' => 1 000 000
  groupSeparator?: GroupSeparatorType,
  // Specifies a sign that separates the integer part from the fractional.
  //  100.55 => ',' => 100,55
  //  100.55 => '.' => 100.55
  decimalSeparator?: DecimalSeparatorType,
  // Specifies the position of the currency symbol:
  // - postfix: 1000 $
  // - prefix: $ 1000
  // - none: 1000
  currencyPosition?: CurrencyPositionType,
  // Amount of digits in the integer part
  integerDigits?: number,
  // Amount of digits in the fractional part
  fractionDigits?: number,

  // => Events
  onChange: (data: number, valid: boolean) => void,
  onPressEnter?: () => void
};

// STATE
type CurrencyInputState = {
}


////////////////////////////////////////////////////////////////////////////////
// 
// COMPONENT
// 
////////////////////////////////////////////////////////////////////////////////

class CurrencyInput extends React.Component<CurrencyInputProps, CurrencyInputState> {

  // ===< CLASS FIELDS >===
  // 
  // Stores the ref to the input element
  //  that's in the base of the component "Input"
  private inputRef: React.RefObject<HTMLInputElement>;
  // Stores the cursor position in the input element
  private cursorPosition: number = 0;
  // Stores amount of thousands groups
  private numGroups: number = 0;
  //
  private pressedKey: string = '';


  // ===< CONSTRUCTOR >===
  // 
  constructor(props: CurrencyInputProps) {
    super(props);
    // The necessary check
    if (this.getDecimalSeparator() === this.getGroupSeparator()) {
      throw new Error(`Incorrect settings for the element "CurrencyInput".\nThe group and the decimal separators must be different.`);
    }
    // Initialize refs
    this.inputRef = React.createRef<HTMLInputElement>();
    // Initialize variables
    this.numGroups = getNumGroups(this.props.value);
  }


  // ===< LIFECYCLE >===
  // 
  /**
   * componentDidMount
   */
  componentDidMount = () => {
  }
  /**
   * => componentDidUpdate()
   */
  componentDidUpdate = (prevProps: CurrencyInputProps) => {
    if (!this.inputRef.current) {
      return;
    }
    // Set the cursor at the specified position
    this.inputRef.current.setSelectionRange(this.cursorPosition, this.cursorPosition);
  }


  // ===< EVENT HANDLERS >===
  // 
  /**
   * => Input - "onChange"
   */
  onChangeHandler = (data: string, valid: boolean) => {
    
    // 
    if (!this.inputRef.current) {
      return;
    }

    const {
      value,
      onChange = (data: number, valid: boolean) => {} // Get the event "onChange"
    } = this.props;

    // Save the previous value
    const prevValue: number = value;

    // Save the current position of the cursor
    this.cursorPosition = this.inputRef.current.selectionStart || 0;


    try {

      // An user pressed not acceptable symbol,
      if (!this.userEnteredAcceptableSymbol(this.pressedKey)) {
        // Return the cursor to its previous position.
        this.cursorPosition -= 1;
        // Interrupt the processing
        throw new Error('Not acceptable symbol');
      }


      // An user pressed the button "Backspace"
      //  and removed the decimal separator
      if (this.userRemovedDecimalSeparator(this.pressedKey, data)) {
        // Interrupt the processing
        throw new Error('Not a number');
      }


      // Convert the new value to the type "number"
      let newValueAsNumber = getSumFromString(data, this.getCurrencySettings());


      // An user entered the decimal separator in the integer part
      if (this.userEnteredDecimalSeparatorInTheIntegerPart(this.pressedKey, newValueAsNumber, prevValue)) {
        // Get the integer part with separators
        const integerPartWithSeparators = getIntegerPartWithSeparators(prevValue, this.getCurrencySettings());
        // Move the cursor to the position after the decimal separator
        this.cursorPosition = integerPartWithSeparators.length + 1;
        // Interrupt the processing
        throw new Error('Not a number');
      }


      // An user entered the decimal separator in the fractional part
      if (this.userEnteredDecimalSeparatorInTheFractionalPart(this.pressedKey, newValueAsNumber, prevValue)) {
        // Return the cursor to the previous position
        this.cursorPosition -= 1;
        // Interrupt the processing
        throw new Error('Not a number');
      }


      // Check whether the length of the integer part
      //  exceeds the specified length or not
      if (this.lengthOfIntegerPartExceeded(newValueAsNumber)) {
        // Return the cursor to the previous position
        this.cursorPosition -= 1;
        // Interrupt the processing
        throw new Error('The length of the integer part was exceeded')
      }


      // An user changed the integer part of the number,
      //  and the integer part was "0"
      if (this.userChangedZeroIntegerPart(newValueAsNumber, prevValue)) {
        // We removed the "0" and leave only the new digit (in the integer part)
        newValueAsNumber = +`${this.pressedKey}.${getFractionalPart(newValueAsNumber, this.getCurrencySettings())}`;
        this.cursorPosition = 1;
      }


      // Compute the number of thousands groups
      const numGroups = getNumGroups(newValueAsNumber);

      // If the number of thousands groups is changed,
      //  it's necessary to consider the group separator.
      // So additionally move the cursor in the required direction
      this.cursorPosition += 1 * (numGroups - this.numGroups);

      // Update variables
      this.numGroups = numGroups;
      

      // Run the event "onChange" from the props with the new value
      onChange(newValueAsNumber, valid);

    } catch {

      // Leave the previous value and
      //  run the event "onChange" from the props
      onChange(prevValue, true);

    } finally {

      // Zero the entered symbol
      this.pressedKey = '';

    }
  }
  /**
   * => Input - "onPressEnter"
   */
  onPressEnterHandler = () => {
    const { onPressEnter = () => {} } = this.props;
    // Run the event from the props
    onPressEnter();
  }
  /**
   * => Input - "onKeyPress"
   */
  onKeyPressHandler = (event: KeyboardEvent<HTMLInputElement>) => {
    this.pressedKey = event.key;
  }


  // ===< UTILS >===
  // 

  getCurrencyPosition = (): CurrencyPositionType => {
    return this.props.currencyPosition || 'none';
  }
  getDecimalSeparator = (): DecimalSeparatorType => {
    return this.props.decimalSeparator || ',';
  }
  getGroupSeparator = (): GroupSeparatorType => {
    return this.props.groupSeparator || ' ';
  }
  getIntegerDigits = (): number => {
    return this.props.integerDigits || 7;
  }
  getFractionDigits = (): number => {
    return this.props.fractionDigits || 2;
  }
  backspaceSymbol = (): string => {
    return 'Backspace';
  }

  /**
   * => getCurrencySymbol()
   * 
   * Returns the representation for the currency.
   * The currency is set in the props 
   */
  getCurrencySymbol = (): string => {
    const { currency = Currencies.RUB } = this.props;
    return CurrencySymbols[currency];
  }

  getCurrencySettings = (): CurrencySettings => {
    return {
      'currencyPosition': this.getCurrencyPosition(),
      'currencySymbol': this.getCurrencySymbol(),
      'decimalSeparator': this.getDecimalSeparator(),
      'groupSeparator': this.getGroupSeparator(),
      'integerDigits': this.getIntegerDigits(),
      'fractionDigits': this.getFractionDigits()
    }
  }


  userEnteredAcceptableSymbol = (enteredSymbol: string): boolean => {

    let result = true;

    // regex = any digit or the decimal separator
    const regex = new RegExp(`[0-9${this.getDecimalSeparator()}]`);

    // Acceptable symbols:
    // - any digit: 0-9;
    // - the decimal separator;
    // - backspace
    if (!regex.test(enteredSymbol) && enteredSymbol !== this.backspaceSymbol()) {
      result = false;
    }

    return result;
  }

  userEnteredDecimalSeparatorInTheIntegerPart = (enteredSymbol: string, newValue: number, prevValue: number): boolean => {

    let result = false;

    // 
    if (enteredSymbol === this.getDecimalSeparator()) {
      // If the integer parts are different,
      //  it means an user entered the decimal separator in the integer part
      if (getIntegerPart(newValue) !== getIntegerPart(prevValue)) {
        result = true;
      }
    }

    return result;
  }

  userEnteredDecimalSeparatorInTheFractionalPart = (enteredSymbol: string, newValue: number, prevValue: number): boolean => {

    let result = false;

    // 
    if (enteredSymbol === this.getDecimalSeparator()) {
      // If the integer parts are equal,
      //  it means an user entered the decimal separator in the fractional part
      if (getIntegerPart(newValue) === getIntegerPart(prevValue)) {
        result = true;
      }
    }

    return result;
  }

  userRemovedDecimalSeparator = (enteredSymbol: string, newValue: string): boolean => {

    let result = false;

    // An user pressed the button "Backspace"
    if (enteredSymbol === this.backspaceSymbol()) {
      // If we can't find the decimal separator in the new value,
      //  it means an user removed it
      result = (newValue.indexOf(this.getDecimalSeparator()) === -1);
    }

    return result;
  }

  lengthOfIntegerPartExceeded = (value: number): boolean => {

    let result = false;

    // Get the integer part of the value
    const integerPart = getIntegerPart(value);

    // Check whether the length of the integer part
    //  exceeds the specified length or not
    if (integerPart.length > this.getIntegerDigits()) {
      result = true;
    }

    return result;
  }

  userChangedZeroIntegerPart = (newValue: number, prevValue: number): boolean => {

    let result = false;

    // Get the integer parts of the new and the previous values
    const integerPart = getIntegerPart(newValue);
    const integerPartOfPrevValue = getIntegerPart(prevValue);

    // The integer part of the previous value was "0",
    //  and the integer part of the new value isn't.
    if (integerPartOfPrevValue === '0' && integerPart !== '0') {
      result = true;
    }

    return result;

  }


  // ===< RENDER >===
  // 
  render() {

    // Destructure the props
    const {
      label,
      value,
      className = '',
      forceValidation = false,
      validate = false,
      validations = {}
    } = this.props;

    console.log('value = ', value);

    return (
      <Input
        label={ label }
        type="text"
        className={ className }
        data={ '' + value }
        validate={ validate }
        forceValidation={ forceValidation }
        validations={ validations }
        inputRef={ this.inputRef }

        formatValueFunction={ formatValue(this.getCurrencySettings()) }

        onChange={ this.onChangeHandler }
        onKeyPress={ this.onKeyPressHandler }
        onPressEnter={ this.onPressEnterHandler }
      />
    );
  }
  
}

export default CurrencyInput;
