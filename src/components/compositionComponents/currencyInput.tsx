import React from 'react';
import { Input } from '../inputs';
// import input checker
import { validate as validateInput, ValidationsRuleType } from '../../utils/inputChecker/validate';

export enum Currencies {
  RUB = 'RUB',
  USD = 'USD'
}

const CurrencySymbols = {
  'RUB': String.fromCharCode(0x20BD),
  'USD': String.fromCharCode(0x24)
}

type CurrencyInputProps =  {
  id: string,
  label: string,
  value: number,
  touched?: boolean,
  validate?: boolean,
  validations?: ValidationsRuleType,
  currency?: Currencies,
  groupSeparator?: ' ' | ',',
  decimalSeparator?: '.' | ',',
  symbolPosition?: 'prefix' | 'postfix',
  integerDigits?: number,
  fractionDigits?: number,
  onChange: (data: number, valid: boolean) => void,
  onPressEnter?: () => void
};

type CurrencyInputState = {
  changed: boolean,
  touched: boolean,
  valid: boolean,
  errorMessage: string
}

class CurrencyInput extends React.Component<CurrencyInputProps, CurrencyInputState> {

  // INSTANCE FIELDS
  private inputRef: React.RefObject<HTMLInputElement>;
  private cursorPosition: number = 0;
  private numGroups: number = 0;
  private prevValue: number = 0;

  // CONSTRUCTOR
  constructor(props: CurrencyInputProps) {
    super(props);
    this.inputRef = React.createRef<HTMLInputElement>();
  }

  // STATE
  state = {
    changed: false,
    touched: this.props.touched || false,
    valid: true,
    errorMessage: ''
  }

  // LIFECYCLE HOOKS
  componentDidMount = () => {
    if (this.inputRef.current) {
      this.inputRef.current.addEventListener('input', this.onChangeHandler);
    }
    
    this.numGroups = this.getNumGroups(this.props.value);
    this.prevValue = this.props.value;
  }
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

    this.inputRef.current.setSelectionRange(this.cursorPosition, this.cursorPosition);
  }

  // EVENT HANDLERS
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
    const sign = (event as InputEvent).data || '';

    Promise.resolve(this.inputRef.current.value)
      // 
      .then(stringSum => {
        // if a user entered a decimal separator,
        // move a cursor to a fractional part
        if (sign === decimalSeparator) {
          // get integer part with separators
          const integerPartWithSeparators = this.getIntegerPartWithSeparators(this.prevValue);
          // move a cursor to a position after a decimal separator
          this.cursorPosition = integerPartWithSeparators.length + 1;

          throw new Error('Not a Number');
        }
        return stringSum;
      })
      // 
      .then(stringSum => {
        const strPrevValue = this.formatValue(this.prevValue);
        const diff = this.differenceBetweenArrays(strPrevValue.split(''), stringSum.split(''));
        if (diff.length > 0 && diff[0] === decimalSeparator) {
          stringSum = strPrevValue;
        }

        return stringSum;
      })
      // 
      .then(stringSum => {
        // check, whether a user entered an unacceptable symbol
        const regexNotDigit = new RegExp(`[^0-9${decimalSeparator}]`, 'gi');
        if (regexNotDigit.test(sign)) {
          // move a cursor
          this.cursorPosition -= 1;

          throw new Error('Not a Number');
        }

        return this.getSumFromString(stringSum);
      })
      // 
      .then(intSum => {
        let result = intSum;

        const stringIntegerPart = this.getIntegerPart(intSum);
        const stringIntegerPartPrevValue = this.getIntegerPart(this.prevValue);
        const stringFractionalPart = this.getFractionalPart(intSum);
        if (stringIntegerPart !== stringIntegerPartPrevValue && stringIntegerPartPrevValue === '0') {
          this.cursorPosition = 1;
          result = +`${sign}.${stringFractionalPart}`;
        }

        return result;
      })
      // 
      .then(intSum => {
        // check, whether a length of an integer part
        // exceeds a specified length or not
        const stringIntegerPart = this.getIntegerPart(intSum);
        if (stringIntegerPart.length > integerDigits) {
          // move a cursor
          this.cursorPosition -= 1;

          throw new Error('The length of the integer part was exceeded')
        }
        return intSum;
      })
      // 
      .then(intSum => {
        // a fractional part handle with another method.
        // leave that num of digits, what have been specified
        const stringIntegerPart = this.getIntegerPart(intSum);
        let stringFractionalPart = this.getFractionalPart(intSum);
        stringFractionalPart = stringFractionalPart.substr(0, fractionDigits);
        // form result
        const result = +`${stringIntegerPart}.${stringFractionalPart}`;
        return result;
      })
      // 
      .then(intSum => {
        const numGroups = this.getNumGroups(intSum);
          
        if (numGroups > this.numGroups) {
          this.cursorPosition += 1;
        } else if (numGroups < this.numGroups) {
          this.cursorPosition -= 1;
        }

        // 
        this.prevValue = intSum;
        this.numGroups = numGroups;
        // 
        const { valid } = this.doValidate(intSum);
        // const { valid: isValid, msg } = validateInput('' + intSum, validations);
        // this.setState({
        //   valid: isValid,
        //   errorMessage: msg
        // });
        
        // launch handler from props
        onChange(intSum, valid);
      })
      // 
      .catch(() => {
        // leave a previous value and
        // launch handler from props
        onChange(this.prevValue, true);
      })
      // 
      .finally(() => {
        this.setState({ changed: true });
      });
  }
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
  onPressEnterHandler = () => {
    const { onPressEnter = () => {} } = this.props;
    onPressEnter();
  }

  // UTILS
  getSumFromString = (data: string): number => {
    const { decimalSeparator = ',' } = this.props;

    // remove any symbol except a digit or a specified separator
    const regexNotDigit = new RegExp(`[^0-9${decimalSeparator}]`, 'gi');
    const result = +data
      .replace(regexNotDigit, '')
      .replace(decimalSeparator, '.'); // replace decimal separator with default separator

    return result;
  }
  getCurrencySymbol = (): string => {
    const { currency = Currencies.RUB } = this.props;
    return CurrencySymbols[currency];
  }
  getIntegerPart = (data: number): string => {
    const { fractionDigits = 2 } = this.props;
    // get string representation of value
    const stringData = data.toFixed(fractionDigits);
    // get position of decimal separator
    const separatorPosition = stringData.indexOf('.');
    // integer part
    const integerPart = stringData.substr(0, separatorPosition);
    
    return integerPart;
  }
  getIntegerPartWithSeparators = (data: number): string => {
    const { groupSeparator = ' ' } = this.props;
    let integerPart = this.getIntegerPart(data);
    // transpile string to array, and reverse array
    const integerPartArray = integerPart.split('').reverse();
    // insert group separator after each third symbol
    const integerPartArrayWithSeparators: string[] = [];
    integerPartArray.forEach((item, index) => {
      integerPartArrayWithSeparators.push(item);
      if ((index + 1) % 3 === 0 && (index + 1) < integerPartArray.length) {
        integerPartArrayWithSeparators.push(groupSeparator);
      }
    });
    // from array get string with group separator
    integerPart = integerPartArrayWithSeparators.reverse().join('');

    return integerPart;
  }
  getFractionalPart = (data: number): string => {
    const { fractionDigits = 2 } = this.props;
    // get string representation of value
    const stringData = '' + data;
    // get position of decimal separator
    const separatorPosition = stringData.indexOf('.');
    // fractional part
    let fractionalPart = '0'.repeat(fractionDigits);
    if (separatorPosition !== -1) {
      fractionalPart = stringData.substr(separatorPosition + 1).padEnd(fractionDigits, '0');
    }

    return fractionalPart;
  }
  getValueAsStringWithSeparators = (data: number) => {
    const { decimalSeparator = ',' } = this.props;
    // integer part
    const integerPart = this.getIntegerPartWithSeparators(data);
    // fractional part
    const fractionalPart = this.getFractionalPart(data);

    return `${integerPart}${decimalSeparator}${fractionalPart}`;
  }
  formatValue = (data: number): string => {
    const { symbolPosition = 'postfix' } = this.props;
    // form result
    const prefix = symbolPosition === 'prefix' ? this.getCurrencySymbol() + ' ': '';
    const postfix = symbolPosition === 'postfix' ? ' ' + this.getCurrencySymbol(): '';
    const result = `${prefix}${this.getValueAsStringWithSeparators(data)}${postfix}`;

    return result;
  }
  getNumGroups = (data: number): number => {
    const stringIntegerPart = this.getIntegerPart(data);
    return Math.ceil(stringIntegerPart.length / 3);
  }
  doValidate = (value: number): { valid: boolean, msg: string } => {
    const { validations = {} } = this.props;

    const { valid, msg } = validateInput('' + value, validations);
    this.setState({
      valid,
      errorMessage: msg
    });

    return { valid, msg };
  }
  differenceBetweenArrays = (arr1: Array<string>, arr2: Array<string>): Array<string> => {
    return arr1.filter(elem => !arr2.includes(elem));
  }

  // RENDER
  render() {

    // props
    const {
      id,
      label,
      value,
      validate
    } = this.props;
    // state
    const {
      valid,
      errorMessage,
      touched
    } = this.state;

    return (
      <Input
        id={id}
        label={label}
        type="text"
        value={this.formatValue(value)}
        valid={valid}
        validate={validate && touched}
        errorMsg={errorMessage}
        inputRef={this.inputRef}
        onBlur={this.onBlurHandler}
        onPressEnter={this.onPressEnterHandler}
      />
    );
  }
  
}

export default CurrencyInput;
