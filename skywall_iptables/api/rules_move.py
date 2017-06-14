from aiohttp.web import json_response, HTTPNotFound
from skywall.core.api import register_api, parse_obj_path_param
from skywall.core.database import create_session
from skywall_iptables.models.rulesets import Rule


@register_api('POST', '/iptables/rules/{ruleId}/before/{beforeId}')
async def move_rule_before(request):
    """
    ---
    tags:
      - Iptables module
    summary: Move rule
    description: Moves an existing rule before another rule
    produces:
      - application/json
    parameters:
      - name: ruleId
        in: path
        description: ID of rule to move
        required: true
        type: integer
      - name: beforeId
        in: path
        description: ID of rule to move before
        required: true
        type: integer
    responses:
      200:
        description: Rule moved
        schema:
          type: object
          title: MoveRuleBeforeResponse
          required:
            - ok
          properties:
            ok:
              type: boolean
      404:
        description: Rule not found
    """
    with create_session() as session:
        rule = parse_obj_path_param(request, 'ruleId', session, Rule)
        before = parse_obj_path_param(request, 'beforeId', session, Rule)

        if rule.ruleset != before.ruleset:
            raise HTTPNotFound(reason='Requested beforeId not found')

        order = before.order
        rule.order = -1
        session.query(Rule)\
                .filter((Rule.ruleset == rule.ruleset) & (Rule.order >= order))\
                .update({'order': Rule.order + 1})
        rule.order = order

        return json_response({'ok': True})


@register_api('POST', '/iptables/rules/{ruleId}/after/{afterId}')
async def move_rule_after(request):
    """
    ---
    tags:
      - Iptables module
    summary: Move rule
    description: Moves an existing rule after another rule
    produces:
      - application/json
    parameters:
      - name: ruleId
        in: path
        description: ID of rule to move
        required: true
        type: integer
      - name: afterId
        in: path
        description: ID of rule to move after
        required: true
        type: integer
    responses:
      200:
        description: Rule moved
        schema:
          type: object
          title: MoveRuleAfterResponse
          required:
            - ok
          properties:
            ok:
              type: boolean
      404:
        description: Rule not found
    """
    with create_session() as session:
        rule = parse_obj_path_param(request, 'ruleId', session, Rule)
        after = parse_obj_path_param(request, 'afterId', session, Rule)

        if rule.ruleset != after.ruleset:
            raise HTTPNotFound(reason='Requested afterId not found')

        order = after.order + 1
        rule.order = -1
        session.query(Rule)\
                .filter((Rule.ruleset == rule.ruleset) & (Rule.order >= order))\
                .update({'order': Rule.order + 1})
        rule.order = order

        return json_response({'ok': True})
