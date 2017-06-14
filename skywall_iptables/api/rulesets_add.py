from aiohttp.web import json_response
from sqlalchemy.sql.expression import func
from skywall.core.api import (
        register_api, parse_json_body, assert_request_param_is_string, assert_request_param_is_boolean,
        )
from skywall.core.database import create_session
from skywall_iptables.models.rulesets import Ruleset


@register_api('POST', '/iptables/rulesets')
async def add_ruleset(request):
    """
    ---
    tags:
      - Iptables module
    summary: Add ruleset
    description: Creates a new ruleset
    produces:
      - application/json
    parameters:
      - name: body
        in: body
        description: Ruleset properties to be saved
        required: true
        schema:
          type: object
          title: PostRulesetBody
          required:
            - active
            - name
          properties:
            active:
              type: boolean
            name:
              type: string
    responses:
      200:
        description: Ruleset added
        schema:
          type: object
          title: PostRulesetResponse
          required:
            - ok
            - rulesetId
          properties:
            ok:
              type: boolean
            rulesetId:
              type: integer
    """
    body = await parse_json_body(request)
    with create_session() as session:
        active = assert_request_param_is_boolean('active', body)
        name = assert_request_param_is_string('name', body)
        order = session.query(func.coalesce(func.max(Ruleset.order), 0) + 1)
        ruleset = Ruleset(
                order=order,
                active=active,
                name=name,
                )
        session.add(ruleset)
        session.flush()
        return json_response({'ok': True, 'rulesetId': ruleset.id})
