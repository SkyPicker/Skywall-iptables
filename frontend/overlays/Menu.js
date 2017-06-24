import React from 'react'
import {Nav, NavItem} from 'react-bootstrap'
import {LinkContainer} from 'react-router-bootstrap'
import {MenuComponent} from 'skywall/frontend/components/Menu'
import {registerOverlay} from 'skywall/frontend/utils/overlays'
import {findElements, appendChildren} from 'skywall/frontend/utils/traverse'
import * as routes from '../constants/routes'


registerOverlay(MenuComponent, (rendered) => {
  let res = rendered
  res = findElements(res, [Nav], (node) => {
    return appendChildren(node, [
      <LinkContainer key="Iptables" to={routes.RULESET_LIST}>
        <NavItem>Iptables</NavItem>
      </LinkContainer>,
      <LinkContainer key="sample" to={routes.SAMPLE}>
        <NavItem>Sample</NavItem>
      </LinkContainer>,
    ])
  })
  return res
})
