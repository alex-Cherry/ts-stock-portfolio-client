type ValidationsRuleType = {
  [ruleName: string]: {
    rule: (value: string) => boolean,
    msg: string
  }
}

export type ValidationsType = {
  [fieldName: string]: ValidationsRuleType
}

type InputCheckerStateType = {
  [fieldName: string]: string
}

export type InputCheckerResultType = {
  [fieldName: string]: {
    [key: string]: string | boolean
  }
}

class InputChecker {

  public valid: boolean;
  private validations: ValidationsType;
  private state: InputCheckerStateType;
  private results: InputCheckerResultType;

  constructor(validations: ValidationsType) {

    this.validations = validations;

    //
    this.state = {};
    this.initializeState();
    // 
    this.results = {};
    this.initializeResults();
    
    // general "valid", considering all rules
    this.valid = true;

  }

  /**
   * Initializes result
   */
  initializeResults() {

    Object.keys(this.validations)
      .forEach((fieldName) => {
        
        this.results = {
          ...this.results,
          [fieldName]: {
            ...this.getRulesForField(this.validations[fieldName]),
            touched: false,
            valid: false,
            msg: ''
          }
        };

      });

  }

  /**
   * Applies defaults values (empty strings) for fields from state.
   * It's required to determine whether field has been changed or not
   * (Field "touched" in results)
   */
  initializeState() {

    Object.keys(this.validations)
      .forEach((fieldName) => {

        this.state = {
          ...this.state,
          [fieldName]: ''
        };

      });
  }

  /**
   * 
   * @param {object} fieldFromValidation - field from validations with its subobject
   * @returns {object}
   * 
   */
  getRulesForField(fieldFromValidation: ValidationsRuleType): {[key: string]: boolean} {

    return Object.keys(fieldFromValidation)
      .reduce((acc: {[key: string]: boolean}, current) => {
        acc[current] = false;
        return acc;
      }, {});
    
  }

  setEmptyMessages() {
    Object.keys(this.results)
      .forEach(fieldName => this.results[fieldName].msg = '');
  }

  setAllTouched() {
    Object.keys(this.results)
      .forEach(fieldName => this.results[fieldName].touched = true);
  }

  /**
   * Validate state of React-component, using validation rules, got in constructor.
   * Result is saved in field "results"
   * 
   * 
   * @param {object} state - state of a React-component
   */
  validate(state: {[key: string]: any}) {

    this.valid = true;
    // zero error msg-s
    this.setEmptyMessages();

    Object.keys(this.results)
      .forEach((item) => {

        if (!this.results[item]['touched']) {
          this.results[item]['touched'] = this.state[item] !== state[item];
        }

        this.results[item]['valid'] = true;
        Object.keys(this.results[item])
          .forEach((rule) => {
            if (rule !== 'touched' && rule !== 'valid' && rule !== 'msg') {
              // console.log(this.validations[item][rule])
              this.results[item][rule] = this.validations[item][rule].rule(state[item]);
              
              this.results[item]['valid'] = this.results[item]['valid'] && this.results[item][rule];
              if (!this.results[item]['valid'] && !this.results[item].msg) {
                this.results[item].msg = this.validations[item][rule].msg || '';
              }
            }
          });

        this.valid = this.valid && !!this.results[item].valid;
      });
    console.log('validate')
  }

  getResults = (): InputCheckerResultType => {
    return {
      ...this.results
    };
  }

}

export default InputChecker;
