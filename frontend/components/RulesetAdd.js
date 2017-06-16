import React from 'react'
import PropTypes from 'prop-types'
import {compose, bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import confirmDirty from 'skywall/frontend/hocs/confirmDirty'
import signalRender from 'skywall/frontend/hocs/signalRender'
import Loading from 'skywall/frontend/components/visual/Loading'
import {RenderSignal} from 'skywall/frontend/utils/signals'
import {renewRulesets} from '../actions/rulesets'
import RulesetAddForm from './RulesetAddForm'


class RulesetAdd extends React.Component {

  static propTypes = {
    // Props from store
    rulesets: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
    })),

    // Actions
    renewRulesets: PropTypes.func.isRequired,

    // Props from confirmDirty
    registerDirty: PropTypes.func.isRequired,
  }

  componentDidMount() {
    this.props.renewRulesets()
  }

  render() {
    const {rulesets, registerDirty} = this.props
    if (!rulesets) return <Loading />
    return (
      <div>
        <RulesetAddForm registerDirty={registerDirty} />
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  rulesets: state.iptablesRulesets.data.rulesets,
})

const mapDispatchToProps = {
  renewRulesets,
}

export const rulesetAddRenderSignal = new RenderSignal('rulesetAddRenderSignal')

export default compose(
  confirmDirty,
  connect(mapStateToProps, (dispatch) => bindActionCreators(mapDispatchToProps, dispatch)),
  signalRender(rulesetAddRenderSignal),
)(RulesetAdd)
