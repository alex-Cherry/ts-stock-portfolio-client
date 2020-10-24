import {
  CurrencySettings
} from './currencyInput';


/**
 * => getNumGroups()
 * 
 * Returns number of a thousands groups
 * 
 * @param data
 */
export const getNumGroups = (data: number): number => {
  const stringIntegerPart = getIntegerPart(data);
  return Math.ceil(stringIntegerPart.length / 3);
}


/**
 * => getSumFromString()
 * 
 * Converts a string to a number.
 * The string can contain any symbols, they will be removed
 * 
 * @param data - the string to convert to a number 
 */
export const getSumFromString = (data: string, settings: CurrencySettings): number => {

  const { decimalSeparator, fractionDigits } = settings;

  let integerPart = '';
  let fractionalPart = '0'.repeat(fractionDigits);
  
  // Remove any symbol except a digit or the specified separator
  const regexNotDigit = new RegExp(`[^0-9${decimalSeparator}.]`, 'gi');
  let strData = data
    .replace(regexNotDigit, '')
    .replace(decimalSeparator, '.'); // replace the decimal separator with the default separator

  // Define the integer part.
  // Find the position of the decimal separator
  let indexSeparator = strData.indexOf('.');
  if (indexSeparator === -1) {
    integerPart = strData;
    strData = '';

  } else {
    integerPart = strData.slice(0, indexSeparator);
    strData = strData.slice(indexSeparator + 1);

  }

  // Define the fractional part.
  // Find the position of the decimal separator
  indexSeparator = strData.indexOf('.');
  if (indexSeparator === -1) {
    fractionalPart = strData;

  } else {
    fractionalPart = strData.slice(0, indexSeparator);

  }

  // Format the fractional part.
  // The length of the part must have the specified value
  fractionalPart = fractionalPart
    .slice(0, fractionDigits)

  // Form the result string and convert it to the type "number"
  const result = +`${integerPart}.${fractionalPart}`;

  return result;
}


/**
 * => getIntegerPart()
 * 
 * Gets a string representation of the interger part of the number
 * 
 * @param data - the number that the integer part to be get of
 */
export const getIntegerPart = (data: number): string => {

  // Get the string representation of the data
  const stringData = data.toFixed(2);

  // Get the position of the default decimal separator
  const separatorPosition = stringData.indexOf('.');

  // Form the integer part
  const integerPart = stringData.substr(0, separatorPosition);
  
  return integerPart;
}


/**
 * => getIntegerPartWithSeparators()
 * 
 * Gets a string representation of the interger part of the number.
 *  Thousands groups in the representation are separated with the value provided in the props
 * 
 * @param data - the number that the integer part to be get of
 */
export const getIntegerPartWithSeparators = (data: number, settings: CurrencySettings): string => {
  
  // Get the thousands groups separator
  const { groupSeparator } = settings;

  // Get the integer part as a string
  let integerPart = getIntegerPart(data);

  // Convert the string to an array and reverse this array
  const integerPartArray = integerPart.split('').reverse();

  // Insert the group separator after each third symbol
  const integerPartArrayWithSeparators: string[] = [];
  integerPartArray.forEach((item, index) => {
    integerPartArrayWithSeparators.push(item);
    if ((index + 1) % 3 === 0 && (index + 1) < integerPartArray.length) {
      integerPartArrayWithSeparators.push(groupSeparator);
    }
  });

  // Reverse the array back
  //  and we get the necessary value
  integerPart = integerPartArrayWithSeparators.reverse().join('');

  return integerPart;
}


/**
 * => getFractionalPart()
 * 
 * Gets a string representation of the fractional part of the number.
 * 
 * @param data - the number that the fractional part to be get of
 */
export const getFractionalPart = (data: number, settings: CurrencySettings): string => {

  const { fractionDigits } = settings;

  // Get the string representation of the data
  const stringData = '' + data;

  // Get the position of the default decimal separator
  const separatorPosition = stringData.indexOf('.');

  // Set the default fractional part
  let fractionalPart = '0'.repeat(fractionDigits);

  // Form the fractional part.
  // Here we handle the situation,
  //  when the parameter "data" has the fractional part,
  //  so there is the separator
  if (separatorPosition !== -1) {
    // Get the fractional part of the data
    //  and pad with "0" to get the length of the specified value
    fractionalPart = stringData
      .substr(separatorPosition + 1)
      .padEnd(fractionDigits, '0');
  }

  return fractionalPart;
}


/**
 * => getValueAsStringWithSeparators()
 * 
 * Converts a number to a string with provided settings
 * 
 * @param data - the number to convert to a string
 */
const getValueAsStringWithSeparators = (data: number, settings: CurrencySettings) => {

  const { decimalSeparator } = settings;

  // Get the integer part
  const integerPart = getIntegerPartWithSeparators(data, settings);
  // Get the fractional part
  const fractionalPart = getFractionalPart(data, settings);

  return `${integerPart}${decimalSeparator}${fractionalPart}`;
}


/**
 * => formatValue()
 * 
 * Converts a number to a string with the provided settings.
 * It also adds the currency symbol to the returned string
 * 
 * @param data - the number to convert to a formatted string
 */
export const formatStrValue = (settings: CurrencySettings) => (data: string): string => {

  // Convert to the type "Number"
  const numData: number = getSumFromString(data, settings);

  return formatNumValue(settings)(numData);
}


/**
 * => formatNumValue()
 * 
 * Converts a number to a string with the provided settings.
 * It also adds the currency symbol to the returned string
 * 
 * @param data - the number to convert to a formatted string
 */
export const formatNumValue = (settings: CurrencySettings) => (data: number): string => {
   // Get the currency position
   const { currencyPosition, currencySymbol } = settings;
 
   // Form the result
   const prefix = currencyPosition === 'prefix' ? currencySymbol + ' ' : '';
   const postfix = currencyPosition === 'postfix' ? ' ' + currencySymbol : '';
   const result = `${prefix}${getValueAsStringWithSeparators(data, settings)}${postfix}`;
 
   return result;
}
