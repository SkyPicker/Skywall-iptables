import React from 'react'
import {Row, Col, FormGroup, Button, Clearfix} from 'react-bootstrap'
import {IndexLinkContainer} from 'react-router-bootstrap'
import {formatPattern} from 'react-router'
import PropTypes from 'prop-types'
import {compose, bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import signalRender from 'skywall/frontend/hocs/signalRender'
import {RenderSignal} from 'skywall/frontend/utils/signals'
import {Form} from 'skywall/frontend/utils/forms'
import {saveButton} from 'skywall/frontend/utils/buttons'
import * as routes from '../constants/routes'
import {rulesetAdd} from '../actions/rulesets'
import {RulesetActive, RulesetName} from '../fields/rulesets'


/** @extends React.Component */
class RulesetAddForm extends Form {

  static propTypes = {
    // Props from store
    isFetching: React.PropTypes.bool,

    // Actions
    rulesetAdd: PropTypes.func.isRequired,
  }

  static contextTypes = {
    router: PropTypes.object.isRequired,
  }

  initFields() {
    return {
      active: new RulesetActive(),
      name: new RulesetName(),
    }
  }

  save(values) {
    const {rulesetAdd} = this.props
    const {active, name} = values
    return rulesetAdd({active, name})
  }

  saved(data) {
    const {rulesetId} = data
    const url = formatPattern(routes.RULESET_DETAIL, {rulesetId})
    this.context.router.push(url)
  }

  isFetching() {
    return this.props.isFetching
  }

  render() {
    const {active, name} = this.fields
    return (
      <div>
        <h2>Add Ruleset</h2>
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
                  <IndexLinkContainer to={routes.RULESET_LIST}>
                    <Button>Cancel</Button>
                  </IndexLinkContainer>
                  {' '}
                  {saveButton({form: this})}
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
  isFetching: state.fetching.iptablesRulesetAdd,
})

const mapDispatchToProps = {
  rulesetAdd,
}

export const rulesetAddFormRenderSignal = new RenderSignal('rulesetAddFormRenderSignal')

export default compose(
  connect(mapStateToProps, (dispatch) => bindActionCreators(mapDispatchToProps, dispatch)),
  signalRender(rulesetAddFormRenderSignal),
)(RulesetAddForm)
