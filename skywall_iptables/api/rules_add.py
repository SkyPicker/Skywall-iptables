from aiohttp.web import json_response, HTTPBadRequest
from sqlalchemy.sql.expression import func
from skywall.core.signals import Signal
from skywall.core.api import (
        register_api, parse_json_body, assert_request_param_is_string, assert_request_param_is_boolean,
        assert_request_param_is_enum, assert_request_param_is_entity,
        )
from skywall.core.database import create_session
from skywall_iptables.models.rulesets import Ruleset
from skywall_iptables.models.rules import Rule, RuleType, before_rule_create, after_rule_create
from skywall_iptables.utils.validations import (
        validate_iface, validate_source, validate_destination, validate_service, validate_action,
        )


before_add_rule = Signal('before_add_rule')
after_add_rule = Signal('after_add_rule')


@register_api('POST', '/iptables/rules', before_add_rule, after_add_rule)
async def add_rule(request):
    """
    ---
    tags:
      - Iptables module
    summary: Add rule
    description: Creates a new rule in given ruleset
    produces:
      - application/json
    parameters:
      - name: body
        in: body
        description: Rule properties to be saved
        required: true
        schema:
          type: object
          title: PostRuleBody
          required:
            - active
            - type
            - iface
            - service
            - action
            - comment
            - rulesetId
          properties:
            active:
              type: boolean
            type:
              type: string
              enum:
               - inbound
               - outbound
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
            rulesetId:
              type: integer
    responses:
      200:
        description: Rule added
        schema:
          type: object
          title: PostRuleResponse
          required:
            - ok
            - ruleId
          properties:
            ok:
              type: boolean
            ruleId:
              type: integer
    """
    body = await parse_json_body(request)
    with create_session() as session:
        active = assert_request_param_is_boolean('active', body)
        type = assert_request_param_is_enum('type', body, RuleType)
        iface = validate_iface(assert_request_param_is_string('iface', body))
        source = None
        destination = None
        service = validate_service(assert_request_param_is_string('service', body))
        action = validate_action(assert_request_param_is_string('action', body))
        comment = assert_request_param_is_string('comment', body)
        ruleset = assert_request_param_is_entity('rulesetId', body, session, Ruleset)

        if type == RuleType.inbound:
            if 'destination' in body:
                raise HTTPBadRequest(reason='Redundand destination for inbound rule')
            source = validate_source(assert_request_param_is_string('source', body))

        if type == RuleType.outbound:
            if 'source' in body:
                raise HTTPBadRequest(reason='Redundand source for outbound rule')
            destination = validate_destination(assert_request_param_is_string('destination', body))

        order = session.query(func.coalesce(func.max(Rule.order), 0) + 1)
        rule = Rule(
                order=order,
                active=active,
                type=type,
                iface=iface,
                source=source,
                destination=destination,
                service=service,
                action=action,
                comment=comment,
                ruleset_id=ruleset.id,
                )
        before_rule_create.emit(session=session, rule=rule)
        session.add(rule)
        session.flush()
        after_rule_create.emit(session=session, rule=rule)
        return json_response({'ok': True, 'ruleId': rule.id})
