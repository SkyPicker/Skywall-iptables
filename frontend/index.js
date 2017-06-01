import React from 'react'
import {Route} from 'react-router'
import {Table, Nav, NavItem} from 'react-bootstrap'
import {LinkContainer} from 'react-router-bootstrap'
import {routesSignal} from 'skywall/frontend/routes'
import {menuRenderSignal} from 'skywall/frontend/components/Menu'
import {clientListTableRenderSignal} from 'skywall/frontend/components/ClientListTable'
import WithMenu from 'skywall/frontend/components/WithMenu'
import {isElement, traverse, findElements, appendChild} from 'skywall/frontend/utils/traverse'
import * as routes from './constants/routes'
import Sample from './components/Sample'


// eslint-disable-next-line no-console
console.log('skywall-iptables')


routesSignal.connect((rendered) => {
  let res = rendered
  res = traverse(res, (node, path, traverseIn) => {
    if (isElement(node) && node.props.component === WithMenu) {
      return appendChild(node,
        <Route key="sample" path={routes.SAMPLE} component={Sample} />
      )
    }
    return traverseIn(node, path)
  })
  return res
})

menuRenderSignal.connect((component, rendered) => {
  let res = rendered
  res = findElements(res, [Nav], (node) => {
    return appendChild(node,
      <LinkContainer key="sample" to={routes.SAMPLE}>
        <NavItem>Sample</NavItem>
      </LinkContainer>
    )
  })
  return res
})

clientListTableRenderSignal.connect((component, rendered) => {
  let res = rendered
  res = findElements(res, [Table, 'thead', 'tr'], (node) => {
    return appendChild(node,
      <th key="sample">Sample</th>
    )
  })
  res = findElements(res, [Table, 'tbody', 'tr'], (node) => {
    const clientId = node.props['data-clientId']
    return appendChild(node,
      <td key="sample">Sample {clientId}</td>
    )
  })
  return res
})
