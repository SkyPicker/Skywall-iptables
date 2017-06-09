import React from 'react'
import PropTypes from 'prop-types'
import {compose, bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import confirmDirty from 'skywall/frontend/hocs/confirmDirty'
import signalRender from 'skywall/frontend/hocs/signalRender'
import {RenderSignal} from 'skywall/frontend/utils/signals'
import {renewRulesets} from '../actions/rulesets'
import RulesetAddForm from './RulesetAddForm'


class RulesetAdd extends React.Component {

  static propTypes = {
    // Actions
    renewRulesets: PropTypes.func.isRequired,

    // Props from confirmDirty
    registerDirty: PropTypes.func.isRequired,
  }

  componentDidMount() {
    this.props.renewRulesets()
  }

  render() {
    const {registerDirty} = this.props
    return (
      <div>
        <RulesetAddForm registerDirty={registerDirty} />
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  // Empty
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
