import {afterGroupAdd, afterGroupDelete} from 'skywall/frontend/actions/groups'
import {getRulesets} from './actions/rulesets'


afterGroupAdd.connect(({dispatch}) => dispatch(getRulesets()))
afterGroupDelete.connect(({dispatch}) => dispatch(getRulesets()))
