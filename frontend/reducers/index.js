import {reducersSignal} from 'skywall/frontend/reducers'
import iptablesRulesets from './rulesets'


reducersSignal.connect((reducers) => ({
  ...reducers,
  iptablesRulesets,
}))
