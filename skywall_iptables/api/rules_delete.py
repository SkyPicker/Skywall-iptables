from aiohttp.web import json_response
from skywall.core.api import register_api, parse_obj_path_param
from skywall.core.database import create_session
from skywall_iptables.models.rulesets import Rule


@register_api('DELETE', '/iptables/rules/{ruleId}')
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
        session.delete(rule)
        return json_response({'ok': True})
