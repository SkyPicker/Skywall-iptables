import React from 'react'
import {Button, Glyphicon} from 'react-bootstrap'
import PropTypes from 'prop-types'
import {compose, bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {If, With} from 'jsx-control-statements'
import signalRender from 'skywall/frontend/hocs/signalRender'
import {RenderSignal} from 'skywall/frontend/utils/signals'
import {Form} from 'skywall/frontend/utils/forms'
import {TextField, CheckBoxField} from 'skywall/frontend/utils/fields'
import * as ruleTypes from '../constants/ruleTypes'
import {ruleUpdate, ruleDelete, ruleBefore, ruleAfter} from '../actions/rules'


/** @extends React.Component */
class RulesetDetailRuleForm extends Form {

  static propTypes = {
    // Props from parent element
    rule: PropTypes.shape({
      id: PropTypes.number.isRequired,
      active: PropTypes.bool,
      type: PropTypes.oneOf(ruleTypes.ALL_RULE_TYPES).isRequired,
      iface: PropTypes.string,
      source: PropTypes.string,
      destination: PropTypes.string,
      service: PropTypes.string,
      action: PropTypes.string,
      comment: PropTypes.string,
    }).isRequired,
    prevRule: PropTypes.shape({
      id: PropTypes.number.isRequired,
    }),
    nextRule: PropTypes.shape({
      id: PropTypes.number.isRequired,
    }),

    // Props from store
    isFetching: React.PropTypes.bool,

    // Actions
    ruleUpdate: PropTypes.func.isRequired,
    ruleDelete: PropTypes.func.isRequired,
    ruleBefore: PropTypes.func.isRequired,
    ruleAfter: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)
    this.handleDelete = this.handleDelete.bind(this)
    this.handleUp = this.handleUp.bind(this)
    this.handleDown = this.handleDown.bind(this)
  }

  initFields() {
    return {
      active: new CheckBoxField({initial: () => this.props.rule.active}),
      iface: new TextField({initial: () => this.props.rule.iface}),
      source: new TextField({initial: () => this.props.rule.source}),
      destination: new TextField({initial: () => this.props.rule.destination}),
      service: new TextField({initial: () => this.props.rule.service}),
      action: new TextField({initial: () => this.props.rule.action}),
      comment: new TextField({initial: () => this.props.rule.comment}),
    }
  }

  save(values) {
    const {rule, ruleUpdate} = this.props
    const {active, iface, service, action, comment} = values
    const source = (rule.type === ruleTypes.INBOUND ? values.source : undefined)
    const destination = (rule.type === ruleTypes.OUTBOUND ? values.destination : undefined)
    return ruleUpdate(rule.id, {active, iface, source, destination, service, action, comment})
      .then(({ok}) => ({ok, stopEditing: ok}))
  }

  isFetching() {
    return this.props.isFetching
  }

  handleDelete() {
    const {rule, ruleDelete} = this.props
    ruleDelete(rule.id)
  }

  handleUp() {
    const {rule, prevRule, ruleBefore} = this.props
    ruleBefore(rule.id, prevRule.id)
  }

  handleDown() {
    const {rule, nextRule, ruleAfter} = this.props
    ruleAfter(rule.id, nextRule.id)
  }

  render() {
    const {active, iface, source, destination, service, action, comment} = this.fields
    const {rule, prevRule, nextRule} = this.props
    return (
      <tr>
        <td>
          <Button
              bsStyle="link"
              bsSize="xsmall"
              onClick={this.handleUp}
              disabled={!prevRule || this.isFetching()}
          >
            <Glyphicon glyph="arrow-up" />
          </Button>
          <Button
              bsStyle="link"
              bsSize="xsmall"
              onClick={this.handleDown}
              disabled={!nextRule || this.isFetching()}
          >
            <Glyphicon glyph="arrow-down" />
          </Button>
        </td>
        <td>{active.render()}</td>
        <td>{iface.render()}</td>
        <If condition={rule.type === ruleTypes.INBOUND}>
          <td>{source.render()}</td>
        </If>
        <If condition={rule.type === ruleTypes.OUTBOUND}>
          <td>{destination.render()}</td>
        </If>
        <td>{service.render()}</td>
        <td>{action.render()}</td>
        <td>{comment.render()}</td>
        <If condition={this.state.isEditing}>
          <td>
            <Button onClick={this.handleCancel} disabled={this.isFetching()}>
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
        </If>
        <If condition={!this.state.isEditing}>
          <td>
            <Button bsStyle="danger" onClick={this.handleDelete} disabled={this.isFetching()}>
              <Glyphicon glyph="trash" />
            </Button>
          </td>
          <td>
            <Button bsStyle="primary" onClick={this.handleEdit} disabled={this.isFetching()}>
              <Glyphicon glyph="pencil" />
            </Button>
          </td>
        </If>
      </tr>
    )
  }
}

const mapStateToProps = (state) => ({
  isFetching: state.fetching.iptablesRuleUpdate || state.fetching.iptablesRuleDelete ||
          state.fetching.iptablesRuleBefore || state.fetching.iptablesRuleAfter,
})

const mapDispatchToProps = {
  ruleUpdate,
  ruleDelete,
  ruleBefore,
  ruleAfter,
}

export const rulesetDetailRuleFormRenderSignal = new RenderSignal('rulesetDetailRuleFormRenderSignal')

export default compose(
  connect(mapStateToProps, (dispatch) => bindActionCreators(mapDispatchToProps, dispatch)),
  signalRender(rulesetDetailRuleFormRenderSignal),
)(RulesetDetailRuleForm)
