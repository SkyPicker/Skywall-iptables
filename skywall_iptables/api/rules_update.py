from aiohttp.web import json_response, HTTPBadRequest
from skywall.core.signals import Signal
from skywall.core.api import (
        register_api, parse_json_body, parse_obj_path_param, assert_request_param_is_string,
        assert_request_param_is_boolean,
        )
from skywall.core.database import create_session
from skywall_iptables.models.rules import Rule, RuleType, before_rule_update, after_rule_update
from skywall_iptables.utils.validations import (
        validate_iface, validate_source, validate_destination, validate_service, validate_action,
        )


before_update_rule = Signal('before_update_rule')
after_update_rule = Signal('before_update_rule')


@register_api('PUT', '/iptables/rules/{ruleId}', before_update_rule, after_update_rule)
async def update_rule(request):
    """
    ---
    tags:
      - Iptables module
    summary: Update rule
    description: Updates an existing rule
    produces:
      - application/json
    parameters:
      - name: ruleId
        in: path
        description: ID of rule to update
        required: true
        type: integer
      - name: body
        in: body
        description: Rule properties to be updated
        required: true
        schema:
          type: object
          title: PutRuleBody
          required: []
          properties:
            active:
              type: boolean
            iface:
              type: string
            source:
              type: string
            destination:
              type: string
            service:
              type: string
            action:
              type: string
            comment:
              type: string
    responses:
      200:
        description: Rule updated
        schema:
          type: object
          title: PutRuleResponse
          required:
            - ok
          properties:
            ok:
              type: boolean
      404:
        description: Rule not found
    """
    body = await parse_json_body(request)
    with create_session() as session:
        rule = parse_obj_path_param(request, 'ruleId', session, Rule)

        if rule.type == RuleType.inbound and 'destination' in body:
            raise HTTPBadRequest(reason='Redundand destination for inbound rule')
        if rule.type == RuleType.outbound and 'source' in body:
            raise HTTPBadRequest(reason='Redundand source for outbound rule')

        if 'active' in body:
            active = assert_request_param_is_boolean('active', body)
            rule.active = active
        if 'iface' in body:
            iface = validate_iface(assert_request_param_is_string('iface', body))
            rule.iface = iface
        if 'source' in body:
            source = validate_source(assert_request_param_is_string('source', body))
            rule.source = source
        if 'destination' in body:
            destination = validate_destination(assert_request_param_is_string('destination', body))
            rule.destination = destination
        if 'service' in body:
            service = validate_service(assert_request_param_is_string('service', body))
            rule.service = service
        if 'action' in body:
            action = validate_action(assert_request_param_is_string('action', body))
            rule.action = action
        if 'comment' in body:
            comment = assert_request_param_is_string('comment', body)
            rule.comment = comment

        before_rule_update.emit(session=session, rule=rule)
        session.flush()
        after_rule_update.emit(session=session, rule=rule)
        return json_response({'ok': True})
