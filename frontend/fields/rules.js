import {TextField, SelectBox} from 'skywall/frontend/utils/fields'
import {isPort, isIp, isIpRange} from '../utils/validations'


export class IfaceField extends TextField {
  constructor(opts = {}) {
    super({
      placeholder: 'any',
      validate: (value) => {
        if (value && !(/^\w+$/).test(value)) {
          return {valid: false, state: 'error', help: 'Invalid iface'}
        }
        return {valid: true, state: 'success'}
      },
      ...opts,
    })
  }
}

export class AddressField extends TextField {
  constructor(opts = {}) {
    super({
      placeholder: 'any',
      validate: (value) => {
        if (value && !isIp(value) && !isIpRange(value)) {
          return {valid: false, state: 'error', help: 'Invalid range'}
        }
        return {valid: true, state: 'success'}
      },
      ...opts,
    })
  }
}

export class ServiceField extends TextField {
  constructor(opts = {}) {
    super({
      placeholder: 'any',
      validate: (value) => {
        if (value && !isPort(value)) {
          return {valid: false, state: 'error', help: 'Invalid port'}
        }
        return {valid: true, state: 'success'}
      },
      ...opts,
    })
  }
}

export class ActionField extends SelectBox {
  constructor(opts = {}) {
    super({
      options: () => [
        {value: 'ACCEPT', label: 'ACCEPT'},
        {value: 'DROP', label: 'DROP'},
      ],
      ...opts,
    })
  }
}
