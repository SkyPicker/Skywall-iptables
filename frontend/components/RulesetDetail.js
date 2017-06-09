import React from 'react'
import {find, toInteger} from 'lodash'
import {Button} from 'react-bootstrap'
import {IndexLinkContainer} from 'react-router-bootstrap'
import {compose, bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import confirmDirty from 'skywall/frontend/hocs/confirmDirty'
import signalRender from 'skywall/frontend/hocs/signalRender'
import {RenderSignal} from 'skywall/frontend/utils/signals'
import * as routes from '../constants/routes'
import {getRulesets, renewRulesets} from '../actions/rulesets'
import RulesetDetailForm from './RulesetDetailForm'


class RulesetDetail extends React.Component {

  static propTypes = {
    // Props from router
    params: PropTypes.shape({
      rulesetId: PropTypes.string.isRequired,
    }),

    // Props from store
    rulesets: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
    })),

    // Actions
    getRulesets: PropTypes.func.isRequired,
    renewRulesets: PropTypes.func.isRequired,

    // Props from confirmDirty
    registerDirty: PropTypes.func.isRequired,
  }

  componentDidMount() {
    this.props.renewRulesets()
  }

  render() {
    if (!this.props.rulesets) return null
    const {rulesets, params, registerDirty, getRulesets} = this.props
    const rulesetId = toInteger(params.rulesetId)
    const ruleset = find(rulesets, {id: rulesetId})
    return (
      <div>
        <div className="pull-right">
          <IndexLinkContainer to={routes.RULESET_LIST}>
            <Button>Show All Rulesets</Button>
          </IndexLinkContainer>
          {' '}
          <Button onClick={getRulesets}>Refresh</Button>
        </div>
        <RulesetDetailForm inactive ruleset={ruleset} registerDirty={registerDirty} />
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  rulesets: state.iptablesRulesets.data.rulesets,
})

const mapDispatchToProps = {
  getRulesets,
  renewRulesets,
}

export const rulesetDetailRenderSignal = new RenderSignal('rulesetDetailRenderSignal')

export default compose(
  confirmDirty,
  connect(mapStateToProps, (dispatch) => bindActionCreators(mapDispatchToProps, dispatch)),
  signalRender(rulesetDetailRenderSignal),
)(RulesetDetail)
