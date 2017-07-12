import {isString, toSafeInteger} from 'lodash'


export const isNumber = (value, max) => {
  if (!isString(value)) return false
  if (!(/^(0|[1-9][0-9]*)$/).test(value)) return false // We don't want octal
  if (toSafeInteger(value) > max) return false
  return true
}

export const isPort = (value) => {
  if (!isString(value)) return false
  if (!isNumber(value, 65535)) return false
  return true
}

export const isIp = (value) => {
  if (!isString(value)) return false
  const parts = value.split('.')
  if (parts.length !== 4) return false
  for (const part of parts) {
    if (!isNumber(part, 255)) return false
  }
  return true
}

export const isIpRange = (value) => {
  if (!isString(value)) return false
  const parts = value.split('/')
  if (parts.length !== 2) return false
  if (!isIp(parts[0])) return false
  if (!isNumber(parts[1], 32)) return false
  return true
}
