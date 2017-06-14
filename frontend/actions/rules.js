import {api} from 'skywall/frontend/utils'
import {alertsError, alertsRemove} from 'skywall/frontend/actions/alerts'
import {fetchingStart, fetchingStop} from 'skywall/frontend/actions/fetching'
import * as routes from '../constants/routes'
import {getRulesets} from './rulesets'


export const ruleAdd = (data) => (dispatch) => {
  dispatch(fetchingStart('iptablesRuleAdd'))
  return api('POST', routes.API_RULE_ADD, {data})
    .then(async (data) => {
      await dispatch(getRulesets())
      dispatch(fetchingStop('iptablesRuleAdd'))
      dispatch(alertsRemove('iptablesRuleAdd'))
      return {ok: true}
    })
    .catch((err) => {
      dispatch(fetchingStop('iptablesRuleAdd'))
      dispatch(alertsError('iptablesRuleAdd', 'Rule add failed', err))
      dispatch(getRulesets())
      return {ok: false}
    })
}

export const ruleUpdate = (ruleId, data) => (dispatch) => {
  dispatch(fetchingStart('iptablesRuleUpdate'))
  return api('PUT', routes.API_RULE_UPDATE, {params: {ruleId}, data})
    .then(async (data) => {
      await dispatch(getRulesets())
      dispatch(fetchingStop('iptablesRuleUpdate'))
      dispatch(alertsRemove('iptablesRuleUpdate'))
      return {ok: true}
    })
    .catch((err) => {
      dispatch(fetchingStop('iptablesRuleUpdate'))
      dispatch(alertsError('iptablesRuleUpdate', 'Rule update failed', err))
      dispatch(getRulesets())
      return {ok: false}
    })
}

export const ruleDelete = (ruleId) => (dispatch) => {
  dispatch(fetchingStart('iptablesRuleDelete'))
  return api('DELETE', routes.API_RULE_DELETE, {params: {ruleId}})
    .then(async (data) => {
      await dispatch(getRulesets())
      dispatch(fetchingStop('iptablesRuleDelete'))
      dispatch(alertsRemove('iptablesRuleDelete'))
      return {ok: true}
    })
    .catch((err) => {
      dispatch(fetchingStop('iptablesRuleDelete'))
      dispatch(alertsError('iptablesRuleDelete', 'Rule update failed', err))
      dispatch(getRulesets())
      return {ok: false}
    })
}

export const ruleBefore = (ruleId, beforeId) => (dispatch) => {
  dispatch(fetchingStart('iptablesRuleBefore'))
  return api('POST', routes.API_RULE_MOVE_BEFORE, {params: {ruleId, beforeId}})
    .then(async (data) => {
      await dispatch(getRulesets())
      dispatch(fetchingStop('iptablesRuleBefore'))
      dispatch(alertsRemove('iptablesRuleBefore'))
      return {ok: true}
    })
    .catch((err) => {
      dispatch(fetchingStop('iptablesRuleBefore'))
      dispatch(alertsError('iptablesRuleBefore', 'Rule move failed', err))
      dispatch(getRulesets())
      return {ok: false}
    })
}

export const ruleAfter = (ruleId, afterId) => (dispatch) => {
  dispatch(fetchingStart('iptablesRuleAfter'))
  return api('POST', routes.API_RULE_MOVE_AFTER, {params: {ruleId, afterId}})
    .then(async (data) => {
      await dispatch(getRulesets())
      dispatch(fetchingStop('iptablesRuleAfter'))
      dispatch(alertsRemove('iptablesRuleAfter'))
      return {ok: true}
    })
    .catch((err) => {
      dispatch(fetchingStop('iptablesRuleAfter'))
      dispatch(alertsError('iptablesRuleAfter', 'Rule move failed', err))
      dispatch(getRulesets())
      return {ok: false}
    })
}
