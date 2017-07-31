from aiohttp.web import json_response
from skywall.core.signals import Signal
from skywall.core.api import register_api, parse_json_body, parse_obj_path_param, assert_request_param_is_boolean
from skywall.core.database import create_session
from skywall_iptables.models.rulesets import Ruleset, before_ruleset_update, after_ruleset_update


before_update_ruleset = Signal('before_update_ruleset')
after_update_ruleset = Signal('after_update_ruleset')


@register_api('PUT', '/iptables/rulesets/{rulesetId}', before_update_ruleset, after_update_ruleset)
async def update_ruleset(request):
    """
    ---
    tags:
      - Iptables module
    summary: Update ruleset
    description: Updates an existing ruleset
    produces:
      - application/json
    parameters:
      - name: rulesetId
        in: path
        description: ID of ruleset to update
        required: true
        type: integer
      - name: body
        in: body
        description: Ruleset properties to be updated
        required: true
        schema:
          type: object
          title: PutRulesetBody
          required: []
          properties:
            active:
              type: boolean
    responses:
      200:
        description: Ruleset updated
        schema:
          type: object
          title: PutRulesetResponse
          required:
            - ok
          properties:
            ok:
              type: boolean
      404:
        description: Ruleset not found
    """
    body = await parse_json_body(request)
    with create_session() as session:
        ruleset = parse_obj_path_param(request, 'rulesetId', session, Ruleset)

        if 'active' in body:
            active = assert_request_param_is_boolean('active', body)
            ruleset.active = active

        before_ruleset_update.emit(session=session, ruleset=ruleset)
        session.flush()
        after_ruleset_update.emit(session=session, ruleset=ruleset)
        return json_response({'ok': True})
