import React from 'react'
import {isEmpty, keyBy, countBy} from 'lodash'
import {formatPattern} from 'react-router'
import {Table} from 'react-bootstrap'
import {Choose, When, Otherwise, For, With} from 'jsx-control-statements'
import PropTypes from 'prop-types'
import {compose, bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {EMDASH, CHECK_MARK, CROSS_MARK} from 'skywall/frontend/constants/symbols'
import signalRender from 'skywall/frontend/hocs/signalRender'
import {RenderSignal} from 'skywall/frontend/utils/signals'
import {groupLabel} from 'skywall/frontend/utils/humanize'
import TdLink from 'skywall/frontend/components/visual/TdLink'
import * as routes from '../constants/routes'


class RulesetListTable extends React.Component {

  static propTypes = {
    // Props from store
    groups: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string,
    })).isRequired,
    rulesets: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      active: PropTypes.bool,
      groupId: PropTypes.number,
    })),
    rules: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      rulesetId: PropTypes.number,
    })).isRequired,
  }

  render() {
    const {groups, rulesets, rules} = this.props
    const groupsById = keyBy(groups, 'id')
    const ruleCountsByRulesetId = countBy(rules, 'rulesetId')
    return (
      <div>
        <h2>Rulesets</h2>
        <Choose>
          <When condition={isEmpty(rulesets)}>
            <div>
              Nore rulesets available.
            </div>
          </When>
          <Otherwise>
            <Table striped bordered condensed hover responsive>
              <thead>
                <tr>
                  <th>Group</th>
                  <th>Rules</th>
                  <th>Active</th>
                </tr>
              </thead>
              <tbody>
                <For each="ruleset" of={rulesets}>
                  <With link={formatPattern(routes.RULESET_DETAIL, {rulesetId: ruleset.id})}>
                    <tr key={ruleset.id}>
                      <TdLink to={link}>
                        {groupLabel(groupsById[ruleset.groupId]) || EMDASH}
                      </TdLink>
                      <TdLink to={link}>
                        {ruleCountsByRulesetId[ruleset.id] || 0}
                      </TdLink>
                      <TdLink to={link}>
                        {ruleset.active ? CHECK_MARK : CROSS_MARK}
                      </TdLink>
                    </tr>
                  </With>
                </For>
              </tbody>
            </Table>
          </Otherwise>
        </Choose>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  groups: state.clients.data.groups,
  rulesets: state.iptablesRulesets.data.rulesets,
  rules: state.iptablesRulesets.data.rules,
})

const mapDispatchToProps = {
  // Empty
}

export const rulesetListTableRenderSignal = new RenderSignal('rulesetListTableRenderSignal')

export default compose(
  connect(mapStateToProps, (dispatch) => bindActionCreators(mapDispatchToProps, dispatch)),
  signalRender(rulesetListTableRenderSignal),
)(RulesetListTable)
