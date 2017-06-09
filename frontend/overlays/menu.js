import React from 'react'
import {Nav, NavItem} from 'react-bootstrap'
import {LinkContainer} from 'react-router-bootstrap'
import {menuRenderSignal} from 'skywall/frontend/components/Menu'
import {findElements, appendChildren} from 'skywall/frontend/utils/traverse'
import * as routes from '../constants/routes'


menuRenderSignal.connect((component, rendered) => {
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
