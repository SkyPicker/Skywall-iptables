import React from 'react'
import {Table, Button, Clearfix} from 'react-bootstrap'
import PropTypes from 'prop-types'
import {compose, bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {If, For} from 'jsx-control-statements'
import {isEmpty} from 'lodash'
import {applyOverlays} from 'skywall/frontend/utils/overlays'
import * as ruleTypes from '../constants/ruleTypes'
import RulesetDetailRuleForm from './RulesetDetailRuleForm'
import RulesetDetailRuleAddForm from './RulesetDetailRuleAddForm'


export class RulesetDetailRuleTableComponent extends React.Component {

  static propTypes = {
    // Props from parent element
    type: PropTypes.oneOf(ruleTypes.ALL_RULE_TYPES).isRequired,
    ruleset: PropTypes.shape({
      id: PropTypes.number.isRequired,
    }).isRequired,
    registerDirty: PropTypes.func.isRequired,

    // Props from store
    rules: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      type: PropTypes.oneOf(ruleTypes.ALL_RULE_TYPES).isRequired,
      rulesetId: PropTypes.number.isRequired,
    })),
  }

  constructor(props) {
    super(props)
    this.state = {
      adding: false,
    }
    this.startAdding = this.startAdding.bind(this)
    this.stopAdding = this.stopAdding.bind(this)
  }

  startAdding() {
    this.setState({
      adding: true,
    })
  }

  stopAdding() {
    this.setState({
      adding: false,
    })
  }

  render() {
    const {type, ruleset, registerDirty} = this.props
    const {adding} = this.state
    const rules = this.props.rules.filter((rule) => rule.rulesetId === ruleset.id && rule.type === type)
    return (
      <div>
        <If condition={type === ruleTypes.INBOUND}>
          <h3>Inbound Rules</h3>
        </If>
        <If condition={type === ruleTypes.OUTBOUND}>
          <h3>Outbound Rules</h3>
        </If>
        <If condition={isEmpty(rules)}>
          No rules
        </If>
        <If condition={adding || !isEmpty(rules)}>
          <Table condensed>
            <thead>
              <tr>
                <th />
                <th>Active</th>
                <th>Interface</th>
                <If condition={type === ruleTypes.INBOUND}>
                  <th>Source</th>
                </If>
                <If condition={type === ruleTypes.OUTBOUND}>
                  <th>Destination</th>
                </If>
                <th>Service</th>
                <th>Action</th>
                <th>Comment</th>
                <th />
                <th />
              </tr>
            </thead>
            <tbody>
              <For each="rule" index="idx" of={rules}>
                <RulesetDetailRuleForm
                    key={rule.id}
                    inactive
                    rule={rule}
                    prevRule={rules[idx - 1]}
                    nextRule={rules[idx + 1]}
                    registerDirty={registerDirty}
                />
              </For>
              <If condition={adding}>
                <RulesetDetailRuleAddForm
                    ruleset={ruleset}
                    type={type}
                    close={this.stopAdding}
                    registerDirty={registerDirty}
                />
              </If>
            </tbody>
          </Table>
        </If>
        <If condition={!adding}>
          <Clearfix>
            <div className="pull-right">
              <Button onClick={this.startAdding}>Add Rule</Button>
            </div>
          </Clearfix>
        </If>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  rules: state.iptablesRulesets.data.rules,
})

const mapDispatchToProps = {
  // Empty
}

export default compose(
  connect(mapStateToProps, (dispatch) => bindActionCreators(mapDispatchToProps, dispatch)),
  applyOverlays,
)(RulesetDetailRuleTableComponent)
