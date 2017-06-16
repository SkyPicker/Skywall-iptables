import React from 'react'
import {isEmpty} from 'lodash'
import {formatPattern} from 'react-router'
import {Table, Button} from 'react-bootstrap'
import {IndexLinkContainer} from 'react-router-bootstrap'
import {Choose, When, Otherwise, For, With} from 'jsx-control-statements'
import PropTypes from 'prop-types'
import {compose, bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {EMDASH, CHECK_MARK, CROSS_MARK} from 'skywall/frontend/constants/symbols'
import signalRender from 'skywall/frontend/hocs/signalRender'
import {RenderSignal} from 'skywall/frontend/utils/signals'
import TdLink from 'skywall/frontend/components/visual/TdLink'
import * as routes from '../constants/routes'


class RulesetListTable extends React.Component {

  static propTypes = {
    // Props from store
    rulesets: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string,
      active: PropTypes.bool,
    })),
  }

  render() {
    const {rulesets} = this.props
    return (
      <div>
        <div className="pull-right">
          <IndexLinkContainer to={routes.RULESET_ADD}>
            <Button>Add Ruleset</Button>
          </IndexLinkContainer>
        </div>
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
                  <th>ID</th>
                  <th>Name</th>
                  <th>Active</th>
                </tr>
              </thead>
              <tbody>
                <For each="ruleset" of={rulesets}>
                  <With link={formatPattern(routes.RULESET_DETAIL, {rulesetId: ruleset.id})}>
                    <tr key={ruleset.id}>
                      <TdLink to={link}>
                        {ruleset.id}
                      </TdLink>
                      <TdLink to={link}>
                        {ruleset.name || EMDASH}
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
  rulesets: state.iptablesRulesets.data.rulesets,
})

const mapDispatchToProps = {
  // Empty
}

export const rulesetListTableRenderSignal = new RenderSignal('rulesetListTableRenderSignal')

export default compose(
  connect(mapStateToProps, (dispatch) => bindActionCreators(mapDispatchToProps, dispatch)),
  signalRender(rulesetListTableRenderSignal),
)(RulesetListTable)
