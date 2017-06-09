import {TextField, CheckBoxField} from 'skywall/frontend/utils/fields'


export class RulesetActive extends CheckBoxField {
  constructor(opts = {}) {
    super({
      label: 'Active',
      ...opts,
    })
  }
}

export class RulesetName extends TextField {
  constructor(opts = {}) {
    super({
      label: 'Name *',
      validate: (value) => {
        if (!value) {
          return {valid: false, state: 'error', help: 'Name is required'}
        }
        return {valid: true, state: 'success'}
      },
      ...opts,
    })
  }
}
