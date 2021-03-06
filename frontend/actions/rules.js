import {api} from 'skywall/frontend/utils'
import {alertsError, alertsRemove} from 'skywall/frontend/actions/alerts'
import {fetchingStart, fetchingStop} from 'skywall/frontend/actions/fetching'
import {Signal} from 'skywall/frontend/utils/signals'
import * as routes from '../constants/routes'
import {getRulesets} from './rulesets'


export const beforeRuleAdd = new Signal('beforeRuleAdd')
export const afterRuleAdd = new Signal('afterRuleAdd')
export const beforeRuleUpdate = new Signal('beforeRuleUpdate')
export const afterRuleUpdate = new Signal('afterRuleUpdate')
export const beforeRuleDelete = new Signal('beforeRuleDelete')
export const afterRuleDelete = new Signal('afterRuleDelete')
export const beforeRuleBefore = new Signal('beforeRuleBefore')
export const afterRuleBefore = new Signal('afterRuleBefore')
export const beforeRuleAfter = new Signal('beforeRuleAfter')
export const afterRuleAfter = new Signal('afterRuleAfter')


export const ruleAdd = (data) => (dispatch) => {
  beforeRuleAdd.emit({data, dispatch})
  dispatch(fetchingStart('iptablesRuleAdd'))
  return api('POST', routes.API_RULE_ADD, {data})
    .then(async (data) => {
      await dispatch(getRulesets())
      dispatch(fetchingStop('iptablesRuleAdd'))
      dispatch(alertsRemove('iptablesRuleAdd'))
      afterRuleAdd.emit({ok: true, data, dispatch})
      return {ok: true}
    })
    .catch((err) => {
      dispatch(fetchingStop('iptablesRuleAdd'))
      dispatch(alertsError('iptablesRuleAdd', 'Rule add failed', err))
      dispatch(getRulesets())
      afterRuleAdd.emit({ok: false, dispatch})
      return {ok: false}
    })
}

export const ruleUpdate = (ruleId, data) => (dispatch) => {
  beforeRuleUpdate.emit({ruleId, data, dispatch})
  dispatch(fetchingStart('iptablesRuleUpdate'))
  return api('PUT', routes.API_RULE_UPDATE, {params: {ruleId}, data})
    .then(async (data) => {
      await dispatch(getRulesets())
      dispatch(fetchingStop('iptablesRuleUpdate'))
      dispatch(alertsRemove('iptablesRuleUpdate'))
      afterRuleUpdate.emit({ok: true, dispatch})
      return {ok: true}
    })
    .catch((err) => {
      dispatch(fetchingStop('iptablesRuleUpdate'))
      dispatch(alertsError('iptablesRuleUpdate', 'Rule update failed', err))
      dispatch(getRulesets())
      afterRuleUpdate.emit({ok: false, dispatch})
      return {ok: false}
    })
}

export const ruleDelete = (ruleId) => (dispatch) => {
  beforeRuleDelete.emit({ruleId, dispatch})
  dispatch(fetchingStart('iptablesRuleDelete'))
  return api('DELETE', routes.API_RULE_DELETE, {params: {ruleId}})
    .then(async (data) => {
      await dispatch(getRulesets())
      dispatch(fetchingStop('iptablesRuleDelete'))
      dispatch(alertsRemove('iptablesRuleDelete'))
      afterRuleDelete.emit({ok: true, dispatch})
      return {ok: true}
    })
    .catch((err) => {
      dispatch(fetchingStop('iptablesRuleDelete'))
      dispatch(alertsError('iptablesRuleDelete', 'Rule update failed', err))
      dispatch(getRulesets())
      afterRuleDelete.emit({ok: false, dispatch})
      return {ok: false}
    })
}

export const ruleBefore = (ruleId, beforeId) => (dispatch) => {
  beforeRuleBefore.emit({ruleId, beforeId, dispatch})
  dispatch(fetchingStart('iptablesRuleBefore'))
  return api('POST', routes.API_RULE_MOVE_BEFORE, {params: {ruleId, beforeId}})
    .then(async (data) => {
      await dispatch(getRulesets())
      dispatch(fetchingStop('iptablesRuleBefore'))
      dispatch(alertsRemove('iptablesRuleBefore'))
      afterRuleBefore.emit({ok: true, dispatch})
      return {ok: true}
    })
    .catch((err) => {
      dispatch(fetchingStop('iptablesRuleBefore'))
      dispatch(alertsError('iptablesRuleBefore', 'Rule move failed', err))
      dispatch(getRulesets())
      afterRuleBefore.emit({ok: false, dispatch})
      return {ok: false}
    })
}

export const ruleAfter = (ruleId, afterId) => (dispatch) => {
  beforeRuleAfter.emit({ruleId, afterId, dispatch})
  dispatch(fetchingStart('iptablesRuleAfter'))
  return api('POST', routes.API_RULE_MOVE_AFTER, {params: {ruleId, afterId}})
    .then(async (data) => {
      await dispatch(getRulesets())
      dispatch(fetchingStop('iptablesRuleAfter'))
      dispatch(alertsRemove('iptablesRuleAfter'))
      afterRuleAfter.emit({ok: true, dispatch})
      return {ok: true}
    })
    .catch((err) => {
      dispatch(fetchingStop('iptablesRuleAfter'))
      dispatch(alertsError('iptablesRuleAfter', 'Rule move failed', err))
      dispatch(getRulesets())
      afterRuleAfter.emit({ok: false, dispatch})
      return {ok: false}
    })
}
