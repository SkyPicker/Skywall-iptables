import React from 'react'
import {Button} from 'react-bootstrap'
import PropTypes from 'prop-types'
import {compose, bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {NBSP} from 'skywall/frontend/constants/symbols'
import signalRender from 'skywall/frontend/hocs/signalRender'
import Loading from 'skywall/frontend/components/visual/Loading'
import {RenderSignal} from 'skywall/frontend/utils/signals'
import {getRulesets, renewRulesets} from '../actions/rulesets'
import RulesetListTable from './RulesetListTable'


class RulesetList extends React.Component {

  static propTypes = {
    // Props from store
    rulesets: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
    })),

    // Actions
    getRulesets: PropTypes.func.isRequired,
    renewRulesets: PropTypes.func.isRequired,
  }

  componentDidMount() {
    this.props.renewRulesets()
  }

  render() {
    const {rulesets, getRulesets} = this.props
    if (!rulesets) return <Loading />
    return (
      <div>
        <div className="pull-right">
          {NBSP}
          <Button onClick={getRulesets}>Refresh</Button>
        </div>
        <RulesetListTable />
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

export const rulesetListRenderSignal = new RenderSignal('rulesetListRenderSignal')

export default compose(
  connect(mapStateToProps, (dispatch) => bindActionCreators(mapDispatchToProps, dispatch)),
  signalRender(rulesetListRenderSignal),
)(RulesetList)
