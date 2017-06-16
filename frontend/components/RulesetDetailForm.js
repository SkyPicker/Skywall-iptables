import React from 'react'
import {Row, Col, FormGroup, Clearfix} from 'react-bootstrap'
import PropTypes from 'prop-types'
import {compose, bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import signalRender from 'skywall/frontend/hocs/signalRender'
import {RenderSignal} from 'skywall/frontend/utils/signals'
import {Form} from 'skywall/frontend/utils/forms'
import {cancelButton, saveButton, editButton} from 'skywall/frontend/utils/buttons'
import {rulesetUpdate} from '../actions/rulesets'
import {RulesetActive, RulesetName} from '../fields/rulesets'
import {rulesetLabel} from '../utils/humanize'


/** @extends React.Component */
class RulesetDetailForm extends Form {

  static propTypes = {
    // Props from parent element
    ruleset: PropTypes.shape({
      id: PropTypes.number.isRequired,
      active: PropTypes.bool,
      name: PropTypes.string,
    }).isRequired,

    // Props from store
    isFetching: React.PropTypes.bool,

    // Actions
    rulesetUpdate: PropTypes.func.isRequired,
  }

  initFields() {
    return {
      active: new RulesetActive({initial: () => this.props.ruleset.active}),
      name: new RulesetName({initial: () => this.props.ruleset.name}),
    }
  }

  save(values) {
    const rulesetId = this.props.ruleset.id
    const {active, name} = values
    return this.props.rulesetUpdate(rulesetId, {active, name})
      .then(({ok}) => ({ok, stopEditing: ok}))
  }

  isFetching() {
    return this.props.isFetching
  }

  render() {
    const {active, name} = this.fields
    const {ruleset} = this.props
    return (
      <div>
        <h2>Ruleset: {rulesetLabel(ruleset)}</h2>
        <form onSubmit={this.handleSubmit}>
          <Row>
            <Col md={6}>{active.render()}</Col>
          </Row>
          <Row>
            <Col md={12}>{name.render()}</Col>
          </Row>
          <Row>
            <Col md={12}>
              <Clearfix>
                <FormGroup className="pull-right">
                  {cancelButton({form: this})}
                  {saveButton({form: this})}
                  {editButton({form: this})}
                </FormGroup>
              </Clearfix>
            </Col>
          </Row>
        </form>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  isFetching: state.fetching.iptablesRulesetUpdate,
})

const mapDispatchToProps = {
  rulesetUpdate,
}

export const rulesetDetailFormRenderSignal = new RenderSignal('rulesetDetailFormRenderSignal')

export default compose(
  connect(mapStateToProps, (dispatch) => bindActionCreators(mapDispatchToProps, dispatch)),
  signalRender(rulesetDetailFormRenderSignal),
)(RulesetDetailForm)
