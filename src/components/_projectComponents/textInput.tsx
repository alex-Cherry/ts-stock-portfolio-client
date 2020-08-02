import React, { useState, useEffect, useCallback } from 'react';
// import custom components
import { Input } from '../inputs';
// import input checker
import { validate as validateInput, ValidationsRuleType } from '../../utils/inputChecker/validate';
// import types
import { inputType } from '../../types/inputTypes';

export type TextInputProps = {
  id: string,
  label: string,
  type: inputType,
  value: string,
  touched: boolean,
  validate?: boolean,
  validations: ValidationsRuleType,
  onChange: (data: string, valid: boolean) => void,
  onPressEnter?: () => void
}

const TextInput = (props: TextInputProps) => {

  // STATE
  const [ valid, setValid ] = useState(true);
  const [ errorMessage, setErrorMessage ] = useState('');
  const [ touched, setTouched ] = useState(props.touched);
  const [ changed, setChanged ] = useState(false);
  const [ validations ] = useState(props.validations);

  // PROPS
  const {
    id,
    label,
    value,
    validate = false,
    type,
    onChange = (data: string, valid: boolean) => {},
    onPressEnter = () => {}
  } = props;
  
  // HOOKS
  const doValidate = useCallback(() => {
    const { valid, msg } = validateInput(value, validations);
    setValid(valid);
    setErrorMessage(msg);
  }, [value, validations])
  // this hook is used when property "touched" changed in parent component.
  // i.e., when user pressed a button, but did not edit fields in a form yet.
  // in this case validations wasn't applied and we force validation
  useEffect(() => {
    if (props.touched && !touched) {
      setTouched(true);
      doValidate();
    }
  }, [props, touched, doValidate]);

  // EVENT HANDLERS
  const onChangeHandler = (data: string) => {
    const { valid: isValid, msg } = validateInput(data, validations);
    setValid(isValid);
    setErrorMessage(msg);
    setChanged(true);
    onChange(data, isValid);
  }
  const onPressEnterHandler = () => {
    onPressEnter();
  }
  const onBlurHandler = () => {
    if (!validate) {
      return;
    }
    if (changed) {
      setTouched(true);
    }
  }

  // RENDER
  return (
    <Input
      id={id}
      label={label}
      value={value}
      type={type}
      valid={valid}
      validate={validate && touched}
      errorMsg={errorMessage}
      onChange={onChangeHandler}
      onPressEnter={onPressEnterHandler}
      onBlur={onBlurHandler}
    />
  );
}

export default TextInput;
