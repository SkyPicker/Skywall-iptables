import React from 'react'
import {Route, IndexRoute} from 'react-router'
import {routesSignal} from 'skywall/frontend/routes'
import WithMenu from 'skywall/frontend/components/WithMenu'
import {isElement, traverse, appendChildren} from 'skywall/frontend/utils/traverse'
import * as routes from './constants/routes'
import Sample from './components/Sample'
import RulesetList from './components/RulesetList'
import RulesetAdd from './components/RulesetAdd'
import RulesetDetail from './components/RulesetDetail'


routesSignal.connect((rendered) => {
  let res = rendered
  res = traverse(res, (node, path, traverseIn) => {
    if (isElement(node) && node.props.component === WithMenu) {
      return appendChildren(node, [
        <Route key="sample" path={routes.SAMPLE} component={Sample} />,
        <Route key="iptables" path={routes.RULESET_LIST}>
          <IndexRoute component={RulesetList} />
          <Route path={routes.RULESET_ADD} component={RulesetAdd} />
          <Route path={routes.RULESET_DETAIL} component={RulesetDetail} />
        </Route>,
      ])
    }
    return traverseIn(node, path)
  })
  return res
})