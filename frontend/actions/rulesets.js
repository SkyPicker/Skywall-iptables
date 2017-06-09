import moment from 'moment'
import {RENEW_INTERVAL} from 'skywall/frontend/constants'
import {makeAction, api} from 'skywall/frontend/utils'
import {alertsError, alertsRemove} from 'skywall/frontend/actions/alerts'
import {fetchingStart, fetchingStop} from 'skywall/frontend/actions/fetching'
import * as actions from '../constants/actions'
import * as routes from '../constants/routes'


export const rulesetsSet = makeAction(actions.RULESETS_SET, 'data')

export const getRulesets = () => (dispatch) => {
  dispatch(fetchingStart('iptablesRulesets'))
  return api('GET', routes.API_RULESET_LIST)
    .then((data) => {
      dispatch(fetchingStop('iptablesRulesets'))
      dispatch(alertsRemove('iptablesRulesets'))
      dispatch(rulesetsSet(data))
      return {ok: true}
    })
    .catch((err) => {
      dispatch(fetchingStop('iptablesRulesets'))
      dispatch(alertsError('iptablesRulesets', 'Fetching rulesests failed', err))
      return {ok: false}
    })
}

export const renewRulesets = () => (dispatch, getState) => {
  // Don't try to renew in parallel
  if (getState().fetching.iptablesRulesets) return

  const {lastFetch} = getState().iptablesRulesets
  if (!lastFetch || moment(lastFetch).add(RENEW_INTERVAL).isBefore()) {
    dispatch(getRulesets())
  }
}

export const rulesetAdd = (data) => (dispatch) => {
  dispatch(fetchingStart('iptablesRulesetAdd'))
  return api('POST', routes.API_RULESET_ADD, {data})
    .then(async (data) => {
      await dispatch(getRulesets())
      dispatch(fetchingStop('iptablesRulesetAdd'))
      dispatch(alertsRemove('iptablesRulesetAdd'))
      return {ok: true, data}
    })
    .catch((err) => {
      dispatch(fetchingStop('iptablesRulesetAdd'))
      dispatch(alertsError('iptablesRulesetAdd', 'Ruleset add failed', err))
      dispatch(getRulesets())
      return {ok: false}
    })
}

export const rulesetUpdate = (rulesetId, data) => (dispatch) => {
  dispatch(fetchingStart('iptablesRulesetUpdate'))
  return api('PUT', routes.API_RULESET_UPDATE, {params: {rulesetId}, data})
    .then(async (data) => {
      await dispatch(getRulesets())
      dispatch(fetchingStop('iptablesRulesetUpdate'))
      dispatch(alertsRemove('iptablesRulesetUpdate'))
      return {ok: true}
    })
    .catch((err) => {
      dispatch(fetchingStop('iptablesRulesetUpdate'))
      dispatch(alertsError('iptablesRulesetUpdate', 'Ruleset update failed', err))
      dispatch(getRulesets())
      return {ok: false}
    })
}
