// This type is an array of objects.
// Each object has two fields:
// - rule - the function that gets a string parameter and returns boolean;
// - msg - the message that will be returned in case of an error
export type ValidationsRuleType = {
  [ruleName: string]: {
    rule: (value: string) => boolean,
    msg: string
  }
}

/**
 * validate
 * 
 * The function checks a value (field) according to the specified rule (validations).
 * Returns an object containing two fields:
 * - valid - whether the value is valid or not;
 * - msg - a message that will be returned if the value isn't valid;
 * 
 * @param field - the field to validate
 * @param validations 
 */
export const validate = (field: string, validations: ValidationsRuleType) => {
  
  let valid = true;
  let msg = '';

  // The field is valid if all functions return "true",
  //  so bypass all functions in the parameter "validations"
  Object.keys(validations)
    .forEach(ruleName => {
      // Execute the validation function
      valid = valid && validations[ruleName].rule(field);
      // In the variable "msg" we save the first error message
      if (!valid && !msg) {
        msg = validations[ruleName].msg;
      }
    });
  
  return {
    valid,
    msg
  }
}
