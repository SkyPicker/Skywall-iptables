import React from 'react'
import {Button} from 'react-bootstrap'
import PropTypes from 'prop-types'
import {compose, bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {NBSP} from 'skywall/frontend/constants/symbols'
import {getClients, renewClients} from 'skywall/frontend/actions/clients'
import signalRender from 'skywall/frontend/hocs/signalRender'
import Loading from 'skywall/frontend/components/visual/Loading'
import {RenderSignal} from 'skywall/frontend/utils/signals'
import {getRulesets, renewRulesets} from '../actions/rulesets'
import RulesetListTable from './RulesetListTable'


class RulesetList extends React.Component {

  static propTypes = {
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
    const {groups, rulesets} = this.props
    if (!groups || !rulesets) return <Loading />
    return (
      <div>
        <div className="pull-right">
          {NBSP}
          <Button onClick={this.refresh}>Refresh</Button>
        </div>
        <RulesetListTable />
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

export const rulesetListRenderSignal = new RenderSignal('rulesetListRenderSignal')

export default compose(
  connect(mapStateToProps, (dispatch) => bindActionCreators(mapDispatchToProps, dispatch)),
  signalRender(rulesetListRenderSignal),
)(RulesetList)
