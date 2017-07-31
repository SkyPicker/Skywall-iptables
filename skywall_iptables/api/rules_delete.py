from aiohttp.web import json_response
from skywall.core.signals import Signal
from skywall.core.api import register_api, parse_obj_path_param
from skywall.core.database import create_session
from skywall_iptables.models.rules import Rule, before_rule_delete, after_rule_delete


before_delete_rule = Signal('before_delete_rule')
after_delete_rule = Signal('after_delete_rule')


@register_api('DELETE', '/iptables/rules/{ruleId}', before_delete_rule, after_delete_rule)
async def delete_rule(request):
    """
    ---
    tags:
      - Iptables module
    summary: Delete rule
    description: Deletes an existing rule
    produces:
      - application/json
    parameters:
      - name: ruleId
        in: path
        description: ID of rule to delete
        required: true
        type: integer
    responses:
      200:
        description: Rule deleted
        schema:
          type: object
          title: DeleteRuleResponse
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
        before_rule_delete.emit(session=session, rule=rule)
        session.delete(rule)
        session.flush()
        after_rule_delete.emit(session=session, rule=rule)
        return json_response({'ok': True})
