import React, { useState, useEffect, useCallback } from 'react';
// custom components
import { Input } from '../inputs';
// input checker
import { validate as validateInput, ValidationsRuleType } from '../../utils/inputChecker/validate';
// types
import { inputType } from '../inputs/input';


// DESCRIPTION:
// 
// This component allows to edit text data. Data type is defined the property "type": email, password, simple text.
// 
// The component uses a different custom component "Input".
//  Adds to it additional properties and behavior, considering validations.
// 


////////////////////////////////////////////////////////////////////////////////
// 
// EXTRA
// 
////////////////////////////////////////////////////////////////////////////////

export type TextInputProps = {
  id: string,
  // The label
  label: string,
  // Define a type of the component
  type: inputType,
  // The value
  value: string,
  // Extra classes, that you can apply to the root element,
  //  when you use this component inside other ones.
  // It's assumed that will be used classes that define
  //  positioning of the component
  className?: string,
  // The flag shows that all fields must be validated
  //  regardless whether they is changed or not
  forceValidation?: boolean,
  // Specifies whether display an error message in the case of non-valid value.
  // If "validate" = false, "errorMsg" won't be displayed in any case,
  //  if "validate" = true, "errorMsg" will be displayed if "valid" = false
  validate?: boolean,
  // Validation rules which will be used for check of a value
  validations: ValidationsRuleType,

  // => Events
  onChange: (data: string, valid: boolean) => void,
  onPressEnter?: () => void
}


////////////////////////////////////////////////////////////////////////////////
// 
// COMPONENT
// 
////////////////////////////////////////////////////////////////////////////////

const TextInput = (props: TextInputProps) => {

  // ===< STATE >===
  // 
  // The flag that the value (in the <Input>) is valid
  const [ valid, setValid ] = useState(true);
  // The error message
  const [ errorMessage, setErrorMessage ] = useState('');
  // The flag = "true" when
  //  - the value in the input is changed;
  //  - focus on the input is blurred
  const [ touched, setTouched ] = useState(false);
  // The flag = "true" when
  //  - the value in the input is changed;
  const [ changed, setChanged ] = useState(false);
  // Stores rules which will be used to validate the value (in the <Input>)
  const [ validations ] = useState(props.validations);


  // ===< PROPS >===
  // 
  const {
    id,
    label,
    value,
    validate = false,
    forceValidation = false,
    type,
    className = '',
    onChange = (data: string, valid: boolean) => {},
    onPressEnter = () => {}
  } = props;


  // ===< HOOKS >===
  // 
  const doValidate = useCallback(() => {
    const { valid, msg } = validateInput(value, validations);
    setValid(valid);
    setErrorMessage(msg);
  }, [value, validations])
  // This hook is used when the property "forceValidation" changed in the parent component.
  //  i.e., when an user pressed a button, but did not edit fields in a form yet.
  // In this case validations wasn't applied and we force validation
  useEffect(() => {
    if (forceValidation && !touched) {
      setTouched(true);
      doValidate();
    }
  }, [forceValidation, touched, doValidate]);


  // ===< EVENT HANDLERS >===
  // 
  // => "onChange"
  const onChangeHandler = (data: string) => {



    const { valid: isValid, msg } = validateInput(data, validations);
    setValid(isValid);
    setErrorMessage(msg);
    setChanged(true);
    onChange(data, isValid);
  }
  // => "onPressEnter"
  const onPressEnterHandler = () => {
    onPressEnter();
  }
  // => "onBlur"
  const onBlurHandler = () => {
    if (!validate) {
      return;
    }
    if (changed) {
      setTouched(true);
    }
  }


  // ===< RENDER >===
  // 
  return (
    <Input
      id={id}
      label={ label }
      value={ value }
      type={ type }
      valid={ valid }
      validate={ validate && touched }
      errorMsg={ errorMessage }
      className={ className }

      onChange={ onChangeHandler }
      onPressEnter={ onPressEnterHandler }
      onBlur={ onBlurHandler }
    />
  );
}

export default TextInput;
