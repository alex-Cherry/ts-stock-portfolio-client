export type ValidationsRuleType = {
  [ruleName: string]: {
    rule: (value: string) => boolean,
    msg: string
  }
}


export const validate = (field: string, validations: ValidationsRuleType) => {
  
  let valid = true;
  let msg = '';

  Object.keys(validations)
    .forEach(item => {
      valid = valid && validations[item].rule(field);
      if (!valid && !msg) {
        msg = validations[item].msg;
      }
    });
  
  return {
    valid,
    msg
  }
}
