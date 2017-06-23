import moment from 'moment'
import {RENEW_INTERVAL} from 'skywall/frontend/constants'
import {makeAction, api} from 'skywall/frontend/utils'
import {alertsError, alertsRemove} from 'skywall/frontend/actions/alerts'
import {fetchingStart, fetchingStop} from 'skywall/frontend/actions/fetching'
import {Signal} from 'skywall/frontend/utils/signals'
import * as actions from '../constants/actions'
import * as routes from '../constants/routes'


export const beforeGetRulesets = new Signal('beforeGetRulesets')
export const afterGetRulesets = new Signal('afterGetRulesets')
export const beforeRulesetUpdate = new Signal('beforeRulesetUpdate')
export const afterRulesetUpdate = new Signal('afterRulesetUpdate')


export const rulesetsSet = makeAction(actions.RULESETS_SET, 'data')

export const getRulesets = () => (dispatch) => {
  beforeGetRulesets.emit({dispatch})
  dispatch(fetchingStart('iptablesRulesets'))
  return api('GET', routes.API_RULESET_LIST)
    .then((data) => {
      dispatch(fetchingStop('iptablesRulesets'))
      dispatch(alertsRemove('iptablesRulesets'))
      dispatch(rulesetsSet(data))
      afterGetRulesets.emit({ok: true, dispatch})
      return {ok: true}
    })
    .catch((err) => {
      dispatch(fetchingStop('iptablesRulesets'))
      dispatch(alertsError('iptablesRulesets', 'Fetching rulesests failed', err))
      afterGetRulesets.emit({ok: false, dispatch})
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

export const rulesetUpdate = (rulesetId, data) => (dispatch) => {
  beforeRulesetUpdate.emit({rulesetId, data, dispatch})
  dispatch(fetchingStart('iptablesRulesetUpdate'))
  return api('PUT', routes.API_RULESET_UPDATE, {params: {rulesetId}, data})
    .then(async (data) => {
      await dispatch(getRulesets())
      dispatch(fetchingStop('iptablesRulesetUpdate'))
      dispatch(alertsRemove('iptablesRulesetUpdate'))
      afterRulesetUpdate.emit({ok: true, dispatch})
      return {ok: true}
    })
    .catch((err) => {
      dispatch(fetchingStop('iptablesRulesetUpdate'))
      dispatch(alertsError('iptablesRulesetUpdate', 'Ruleset update failed', err))
      dispatch(getRulesets())
      afterRulesetUpdate.emit({ok: false, dispatch})
      return {ok: false}
    })
}
