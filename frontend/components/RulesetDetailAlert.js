import React from 'react'
import {Clearfix, Alert, Button} from 'react-bootstrap'
import {compose, bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {Link, formatPattern} from 'react-router'
import {Choose, When, Otherwise} from 'jsx-control-statements'
import PropTypes from 'prop-types'
import {find} from 'lodash'
import * as routes from 'skywall/frontend/constants/routes'
import {NBSP} from 'skywall/frontend/constants/symbols'
import {applyOverlays} from 'skywall/frontend/utils/overlays'
import {groupLabel} from 'skywall/frontend/utils/humanize'
import {rulesetUpdate} from '../actions/rulesets'


export class RulesetDetailAlertComponent extends React.Component {

  static propTypes = {
    // Props from parent element
    ruleset: PropTypes.shape({
      id: PropTypes.number.isRequired,
      active: PropTypes.bool,
      groupId: PropTypes.number,
    }).isRequired,

    // Props from store
    groups: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string,
    })).isRequired,

    // Actions
    rulesetUpdate: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)
    this.activate = this.activate.bind(this)
    this.deactivate = this.deactivate.bind(this)
  }

  activate() {
    const {ruleset, rulesetUpdate} = this.props
    rulesetUpdate(ruleset.id, {active: true})
  }

  deactivate() {
    const {ruleset, rulesetUpdate} = this.props
    rulesetUpdate(ruleset.id, {active: false})
  }

  render() {
    const {ruleset, groups} = this.props
    const group = find(groups, {id: ruleset.groupId})
    return (
      <div>
        <h2>
          Ruleset for group:
          {NBSP}
          <Choose>
            <When condition={group}>
              <Link to={formatPattern(routes.GROUP_DETAIL, {groupId: group.id})}>{groupLabel(group)}</Link>
            </When>
            <Otherwise>
              <Link to={formatPattern(routes.GROUP_DEFAULT)}>{groupLabel(group)}</Link>
            </Otherwise>
          </Choose>
        </h2>
        <Choose>
          <When condition={ruleset.active}>
            <Alert bsStyle="info">
              <Clearfix>
                <h4>Ruleset is active</h4>
                <div className="pull-right">
                  <Button bsStyle="danger" onClick={this.deactivate}>Deactivate</Button>
                </div>
                <p>All modifications will be immediatelly distributed to clients.</p>
              </Clearfix>
            </Alert>
          </When>
          <Otherwise>
            <Alert bsStyle="warning">
              <Clearfix>
                <h4>Ruleset is inactive</h4>
                <div className="pull-right">
                  <Button bsStyle="danger" onClick={this.activate}>Activate</Button>
                </div>
                <p>No modifications will be distributed to clients before the ruleset is activated.</p>
              </Clearfix>
            </Alert>
          </Otherwise>
        </Choose>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  groups: state.clients.data.groups,
})

const mapDispatchToProps = {
  rulesetUpdate,
}

export default compose(
  connect(mapStateToProps, (dispatch) => bindActionCreators(mapDispatchToProps, dispatch)),
  applyOverlays,
)(RulesetDetailAlertComponent)
