import React from 'react'
import {find, toInteger} from 'lodash'
import {Button} from 'react-bootstrap'
import {IndexLinkContainer} from 'react-router-bootstrap'
import {compose, bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import {NBSP} from 'skywall/frontend/constants/symbols'
import {getClients, renewClients} from 'skywall/frontend/actions/clients'
import confirmDirty from 'skywall/frontend/hocs/confirmDirty'
import Loading from 'skywall/frontend/components/visual/Loading'
import NotFound from 'skywall/frontend/components/NotFound'
import {applyOverlays} from 'skywall/frontend/utils/overlays'
import * as routes from '../constants/routes'
import * as ruleTypes from '../constants/ruleTypes'
import {getRulesets, renewRulesets} from '../actions/rulesets'
import RulesetDetailAlert from './RulesetDetailAlert'
import RulesetDetailRuleTable from './RulesetDetailRuleTable'


export class RulesetDetailComponent extends React.Component {

  static propTypes = {
    // Props from router
    params: PropTypes.shape({
      rulesetId: PropTypes.string.isRequired,
    }).isRequired,

    // Props from store
    groups: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
    })),
    rulesets: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
    })),

    // Actions
    getClients: PropTypes.func.isRequired,
    renewClients: PropTypes.func.isRequired,
    getRulesets: PropTypes.func.isRequired,
    renewRulesets: PropTypes.func.isRequired,

    // Props from confirmDirty
    registerDirty: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)
    this.refresh = this.refresh.bind(this)
  }

  componentDidMount() {
    this.props.renewClients()
    this.props.renewRulesets()
  }

  refresh() {
    this.props.getClients()
    this.props.getRulesets()
  }

  render() {
    const {groups, rulesets, params, registerDirty} = this.props
    if (!groups || !rulesets) return <Loading />
    const rulesetId = toInteger(params.rulesetId)
    const ruleset = find(rulesets, {id: rulesetId})
    if (!ruleset) return <NotFound />
    return (
      <div>
        <div className="pull-right">
          <IndexLinkContainer to={routes.RULESET_LIST}>
            <Button>Show All Rulesets</Button>
          </IndexLinkContainer>
          {NBSP}
          <Button onClick={this.refresh}>Refresh</Button>
        </div>
        <RulesetDetailAlert ruleset={ruleset} />
        <RulesetDetailRuleTable type={ruleTypes.INBOUND} ruleset={ruleset} registerDirty={registerDirty} />
        <RulesetDetailRuleTable type={ruleTypes.OUTBOUND} ruleset={ruleset} registerDirty={registerDirty} />
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  groups: state.clients.data.groups,
  rulesets: state.iptablesRulesets.data.rulesets,
})

const mapDispatchToProps = {
  getClients,
  renewClients,
  getRulesets,
  renewRulesets,
}

export default compose(
  confirmDirty,
  connect(mapStateToProps, (dispatch) => bindActionCreators(mapDispatchToProps, dispatch)),
  applyOverlays,
)(RulesetDetailComponent)
