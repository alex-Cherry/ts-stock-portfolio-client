import React from 'react';
import { Input } from '../inputs';
// Input checker
import { validate as validateInput, ValidationsRuleType } from '../../utils/inputChecker/validate';


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

// PROPS
type CurrencyInputProps =  {
  id: string,
  // A label
  label: string,
  // A value
  value: number,
  // Extra classes, that you can apply to the root element,
  //  when you use this component inside other ones.
  // It's assumed that will be used classes that define
  //  positioning of the component
  className?: string,
  // The mark = "true" when
  //  - the value in the input is changed;
  //  - focus on the input is blurred
  touched?: boolean,
  // Specifies whether
  //  - validate the value
  //  - display an error message in the case of non-valid value
  validate?: boolean,
  // Stores validations which will be used for check of the value
  validations?: ValidationsRuleType,
  // Specifies the currency
  currency?: Currencies,
  // Specifies a sign that separates thousands groups
  groupSeparator?: ' ' | ',',
  // Specifies a sign that separates the integer part from the fractional
  decimalSeparator?: '.' | ',',
  // Specifies the position of the currency symbol:
  // - postfix: 1000 $
  // - prefix: $ 1000
  symbolPosition?: 'prefix' | 'postfix',
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
  // The flag = "true" when a value is changed.
  changed: boolean,
  // The flag = "true" when
  //  - a value in the input is changed;
  //  - focus on the input is blurred
  touched: boolean,
  // The flag that a value is valid
  valid: boolean,
  // An error message
  errorMessage: string
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
  // Stores the value that was before changing
  private prevValue: number = 0;


  // ===< CONSTRUCTOR >===
  // 
  constructor(props: CurrencyInputProps) {
    super(props);

    this.inputRef = React.createRef<HTMLInputElement>();

    const {

      integerDigits = 7,
      fractionDigits = 2,
      decimalSeparator = ','
    } = this.props;

    const regExp = new RegExp(`^\\d{${integerDigits}}[${decimalSeparator}]\\d{${fractionDigits}}$`);
    console.log(regExp)
    const sum1 = '1231231,45';
    const sum2 = '1231231,456';
    const sum3 = '123123112,45';
    const sum4 = '12312.45';
    console.log(`${sum1} = `, regExp.test(sum1));
    console.log(`${sum2} = `, regExp.test(sum2));
    console.log(`${sum3} = `, regExp.test(sum3));
    console.log(`${sum4} = `, regExp.test(sum4));

  }


  // ===< STATE >===
  // 
  state = {
    changed: false,
    touched: this.props.touched || false,
    valid: true,
    errorMessage: ''
  }


  // ===< LIFECYCLE >===
  // 
  /**
   * componentDidMount
   */
  componentDidMount = () => {
    if (this.inputRef.current) {
      this.inputRef.current.addEventListener('input', this.onChangeHandler);
    }
    // Initialize var-s
    this.numGroups = this.getNumGroups(this.props.value);
    this.prevValue = this.props.value;
  }
  /**
   * componentDidUpdate
   */
  componentDidUpdate = (prevProps: CurrencyInputProps) => {
    const { value, touched = false } = this.props;
    this.prevValue = value;

    if (prevProps.touched !== touched) {
      this.setState({ touched });
      // validate data
      this.doValidate(value);
    }

    if (!this.inputRef.current) {
      return;
    }
    // Set the cursor at the specified position
    this.inputRef.current.setSelectionRange(this.cursorPosition, this.cursorPosition);
  }


  // ===< EVENT HANDLERS >===
  // 
  // => "onChange"
  onChangeHandler = (event: Event) => {
    if (!this.inputRef.current) {
      return;
    }
    const {
      onChange,
      integerDigits = 7,
      fractionDigits = 2,
      decimalSeparator = ','
    } = this.props;

    this.cursorPosition = this.inputRef.current.selectionStart || 0;
    // event.data = a symbol an user inputs
    const sign = (event as InputEvent).data || '';

    Promise.resolve(this.inputRef.current.value)

      // =>
      .then(stringSum => {
        // If an user entered a symbol equal to the decimal separator,
        //  move the cursor to the start position of the fractional part
        if (sign === decimalSeparator) {
          // Get the integer part with separators
          const integerPartWithSeparators = this.getIntegerPartWithSeparators(this.prevValue);
          // Move the cursor to the position after the decimal separator
          this.cursorPosition = integerPartWithSeparators.length + 1;

          // Throw an error, because there is no need
          //  to do the further handle
          throw new Error('Not a Number');
        }
        return stringSum;
      })

      // =>
      .then(stringSum => {
        // Here we check the next situation:
        //  if the cursor is right after the decimal separator
        //  and an user press key "Backspace",
        //  in other words he tries to remove the decimal separator

        const strPrevValue = this.formatValue(this.prevValue);
        const diff = this.differenceBetweenArrays(strPrevValue.split(''), stringSum.split(''));
        // If the situation described above has place,
        if (diff.length > 0 && diff[0] === decimalSeparator) {
          // We leave the previous value
          stringSum = strPrevValue;
        }

        return stringSum;
      })

      // =>
      .then(stringSum => {
        // Check, whether an user entered an unacceptable symbol.
        // Acceptable symbols:
        // - any digit
        // - decimal separator
        const regexNotDigit = new RegExp(`[^0-9${decimalSeparator}]`, 'gi');

        // If there is any unacceptable symbol
        if (regexNotDigit.test(sign)) {
          // Decrease one position of the cursor.
          // In other words returns the cursor
          //  to the previous position
          this.cursorPosition -= 1;

          // Interrupt the processing
          throw new Error('Not a Number');
        }

        // Get a number from the "stringSum" and return it
        return this.getSumFromString(stringSum);
      })

      // =>
      .then(intSum => {
        // Here we handle the next situation:
        //  we change the integer part of the value,
        //    and the previous value has "0" in the integer part.
        //  We must replace the "0" with the entered symbol.
        // 
        // e.g. we have the value "0.50" in the input.
        // Our cursor places at the beginning, i.e. has the index "0".
        // We input the symbol "1".
        // We must get the value "1.50" in the input, not "10.50"
        
        let result = intSum;
        // Save the integer part the current value in the input
        const stringIntegerPart = this.getIntegerPart(intSum);
        // Save the integer part the previous value
        const stringIntegerPartPrevValue = this.getIntegerPart(this.prevValue);
        // Save the fractional part the current value
        const stringFractionalPart = this.getFractionalPart(intSum);
        // Check the required condition
        if (stringIntegerPart !== stringIntegerPartPrevValue && stringIntegerPartPrevValue === '0') {
          this.cursorPosition = 1;
          result = +`${sign}.${stringFractionalPart}`;
        }

        return result;
      })

      // =>
      .then(intSum => {
        // Check whether the length of the integer part
        //  exceeds the specified length or not
        const stringIntegerPart = this.getIntegerPart(intSum);
        if (stringIntegerPart.length > integerDigits) {
          // Decrease one position of the cursor.
          // In other words returns the cursor
          //  to the previous position
          this.cursorPosition -= 1;

          // Interrupt the processing
          throw new Error('The length of the integer part was exceeded')
        }

        return intSum;
      })

      // =>
      .then(intSum => {
        // Here we handle the fractional part of the number

        // Save the integer part of the number
        const stringIntegerPart = this.getIntegerPart(intSum);
        // Get the fractional part of the number as a string
        let stringFractionalPart = this.getFractionalPart(intSum);
        // Leave that num of digits, which have been specified
        stringFractionalPart = stringFractionalPart.substr(0, fractionDigits);
        // Form the result
        const result = +`${stringIntegerPart}.${stringFractionalPart}`;

        return result;
      })

      // =>
      .then(intSum => {
        const numGroups = this.getNumGroups(intSum);
        // If num of thousand groups is changed,
        //  it's necessary to consider the group separator.
        // So additionally move the cursor in the required direction
        if (numGroups > this.numGroups) {
          this.cursorPosition += 1;
        } else if (numGroups < this.numGroups) {
          this.cursorPosition -= 1;
        }

        // Update var-s
        this.prevValue = intSum;
        this.numGroups = numGroups;
        // Validate the new value
        const { valid } = this.doValidate(intSum);
        
        // Launch the handler-method from the props with the new value
        onChange(intSum, valid);
      })

      // =>
      .catch(() => {
        // Leave the previous value and
        //  launch the handler-method from the props
        onChange(this.prevValue, true);
      })

      // =>
      // Always execute
      .finally(() => {
        this.setState({ changed: true });
      });
  }
  // => "onBlur"
  onBlurHandler = () => {
    const { validate } = this.props;
    const { changed } = this.state;

    if (!validate) {
      return;
    }

    if (changed) {
      this.setState({ touched: true });
    }
  }
  // => "onPress"
  onPressEnterHandler = () => {
    const { onPressEnter = () => {} } = this.props;
    onPressEnter();
  }


  // ===< UTILS >===
  // 
  /**
   * Converts a string to a number
   * 
   * @param data - the string you want to convert to a number 
   */
  getSumFromString = (data: string): number => {
    const { decimalSeparator = ',' } = this.props;

    // Remove any symbol except a digit or the specified separator
    const regexNotDigit = new RegExp(`[^0-9${decimalSeparator}]`, 'gi');
    const result = +data
      .replace(regexNotDigit, '')
      .replace(decimalSeparator, '.'); // replace decimal separator with default separator

    return result;
  }
  /**
   * returns a representation for a currency.
   * the currency is set in the props 
   */
  getCurrencySymbol = (): string => {
    const { currency = Currencies.RUB } = this.props;
    return CurrencySymbols[currency];
  }
  /**
   * get a string representation of an interger part of a number
   * 
   * @param data - the number that the integer part to be get of
   */
  getIntegerPart = (data: number): string => {
    const { fractionDigits = 2 } = this.props;
    // get the string representation of the data
    const stringData = data.toFixed(fractionDigits);
    // get the position of the default decimal separator
    const separatorPosition = stringData.indexOf('.');
    // the integer part
    const integerPart = stringData.substr(0, separatorPosition);
    
    return integerPart;
  }
  /**
   * get a string representation of an interger part of a number.
   * thousands groups in the representation are separated with the value provided in the props
   * 
   * @param data - the number that the integer part to be get of
   */
  getIntegerPartWithSeparators = (data: number): string => {
    // get the thousands groups separator
    const { groupSeparator = ' ' } = this.props;
    // get the integer part as a string
    let integerPart = this.getIntegerPart(data);
    // transpile the string to an array, and reverse this array
    const integerPartArray = integerPart.split('').reverse();
    // insert the group separator after each third symbol
    const integerPartArrayWithSeparators: string[] = [];
    integerPartArray.forEach((item, index) => {
      integerPartArrayWithSeparators.push(item);
      if ((index + 1) % 3 === 0 && (index + 1) < integerPartArray.length) {
        integerPartArrayWithSeparators.push(groupSeparator);
      }
    });
    // from the array get the string with the group separator
    integerPart = integerPartArrayWithSeparators.reverse().join('');

    return integerPart;
  }
  /**
   * get a string representation of a fractional part of a number.
   * 
   * @param data - the number that the fractional part to be get of
   */
  getFractionalPart = (data: number): string => {
    const { fractionDigits = 2 } = this.props;
    // get the string representation of the data
    const stringData = '' + data;
    // get the position of the default decimal separator
    const separatorPosition = stringData.indexOf('.');
    // set the default fractional part
    let fractionalPart = '0'.repeat(fractionDigits);
    if (separatorPosition !== -1) {
      // get the fractional part of the data
      // and pad with "0" to get the length of the specified value
      fractionalPart = stringData.substr(separatorPosition + 1).padEnd(fractionDigits, '0');
    }

    return fractionalPart;
  }
  /**
   * converts a number to a string with the provided setting
   * 
   * @param data - the number which converted to a formatted string
   */
  getValueAsStringWithSeparators = (data: number) => {
    const { decimalSeparator = ',' } = this.props;
    // the integer part
    const integerPart = this.getIntegerPartWithSeparators(data);
    // the fractional part
    const fractionalPart = this.getFractionalPart(data);

    return `${integerPart}${decimalSeparator}${fractionalPart}`;
  }
  /**
   * converts a number to a string with the provided setting.
   * also it's added a currency symbol to the returned string
   * 
   * @param data - the number which converted to a formatted string
   */
  formatValue = (data: number): string => {
    const { symbolPosition = 'postfix' } = this.props;
    // form result
    const prefix = symbolPosition === 'prefix' ? this.getCurrencySymbol() + ' ': '';
    const postfix = symbolPosition === 'postfix' ? ' ' + this.getCurrencySymbol(): '';
    const result = `${prefix}${this.getValueAsStringWithSeparators(data)}${postfix}`;

    return result;
  }
  /**
   * returns number of a thousands groups
   * 
   * @param data - the provided number
   */
  getNumGroups = (data: number): number => {
    const stringIntegerPart = this.getIntegerPart(data);
    return Math.ceil(stringIntegerPart.length / 3);
  }
  /**
   * fulfills a check of a number's correctness
   * with the specified validations.
   * 
   * returns an object containing the fields:
   * - valid - a number is valid
   * - msg - an error message if a number isn't valid
   * 
   * @param value - the number which to be checked
   */
  doValidate = (value: number): { valid: boolean, msg: string } => {
    
    const {
      validate = false,
      validations = {}
    } = this.props;

    // default value
    if (!validate) {
      return { valid: true, msg: '' };
    }

    const { valid, msg } = validateInput('' + value, validations);
    this.setState({
      valid,
      errorMessage: msg
    });

    return { valid, msg };
  }
  /**
   * returns a difference between arrays
   * 
   * @param arr1 
   * @param arr2 
   */
  differenceBetweenArrays = (arr1: Array<string>, arr2: Array<string>): Array<string> => {
    return arr1.filter(elem => !arr2.includes(elem));
  }


  // *** RENDER
  render() {

    // props
    const {
      id,
      label,
      value,

      integerDigits = 7,
      fractionDigits = 2,
      decimalSeparator = ',',

      className = '',
      validate = false
    } = this.props;
    // state
    const {
      valid,
      errorMessage,
      touched
    } = this.state;

    return (
      <Input
        id={ id }
        label={ label }
        type="text"
        className={ className }
        data={ this.formatValue(value) }
        // valid={ valid }
        // validate={ validate && touched }
        // errorMsg={ errorMessage }
        // inputRef={ this.inputRef }
        // onBlur={ this.onBlurHandler }
        // onPressEnter={ this.onPressEnterHandler }
      />
    );
  }
  
}

export default CurrencyInput;
