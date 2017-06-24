import React from 'react'
import {Button, Glyphicon} from 'react-bootstrap'
import PropTypes from 'prop-types'
import {compose, bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {If, With} from 'jsx-control-statements'
import {applyOverlays} from 'skywall/frontend/utils/overlays'
import {Form} from 'skywall/frontend/utils/forms'
import {TextField, CheckBoxField} from 'skywall/frontend/utils/fields'
import * as ruleTypes from '../constants/ruleTypes'
import {ruleAdd} from '../actions/rules'


/** @extends React.Component */
export class RulesetDetailRuleAddFormComponent extends Form {

  static propTypes = {
    // Props from parent element
    ruleset: PropTypes.shape({
      id: PropTypes.number.isRequired,
    }).isRequired,
    type: PropTypes.oneOf(ruleTypes.ALL_RULE_TYPES).isRequired,
    close: PropTypes.func.isRequired,

    // Props from store
    isFetching: React.PropTypes.bool,

    // Actions
    ruleAdd: PropTypes.func.isRequired,
  }

  initFields() {
    return {
      active: new CheckBoxField(),
      iface: new TextField(),
      source: new TextField(),
      destination: new TextField(),
      service: new TextField(),
      action: new TextField(),
      comment: new TextField(),
    }
  }

  save(values) {
    const {ruleset, type, ruleAdd} = this.props
    const {active, iface, service, action, comment} = values
    const source = (type === ruleTypes.INBOUND ? values.source : undefined)
    const destination = (type === ruleTypes.OUTBOUND ? values.destination : undefined)
    return ruleAdd({active, type, iface, source, destination, service, action, comment, rulesetId: ruleset.id})
  }

  saved() {
    this.props.close()
  }

  isFetching() {
    return this.props.isFetching
  }

  render() {
    const {active, iface, source, destination, service, action, comment} = this.fields
    const {type, close} = this.props
    return (
      <tr>
        <td />
        <td>{active.render()}</td>
        <td>{iface.render()}</td>
        <If condition={type === ruleTypes.INBOUND}>
          <td>{source.render()}</td>
        </If>
        <If condition={type === ruleTypes.OUTBOUND}>
          <td>{destination.render()}</td>
        </If>
        <td>{service.render()}</td>
        <td>{action.render()}</td>
        <td>{comment.render()}</td>
        <td>
          <Button bsStyle="default" onClick={close} disabled={this.isFetching()}>
            <Glyphicon glyph="remove" />
          </Button>
        </td>
        <td>
          <With disabled={this.isFetching() || !this.isChanged() || !this.isValid()}>
            <Button bsStyle="primary" onClick={this.handleSubmit} disabled={disabled}>
              <Glyphicon glyph="ok" />
            </Button>
          </With>
        </td>
      </tr>
    )
  }
}

const mapStateToProps = (state) => ({
  isFetching: state.fetching.iptablesRuleAdd,
})

const mapDispatchToProps = {
  ruleAdd,
}

export default compose(
  connect(mapStateToProps, (dispatch) => bindActionCreators(mapDispatchToProps, dispatch)),
  applyOverlays,
)(RulesetDetailRuleAddFormComponent)
