from aiohttp.web import json_response
from skywall.core.database import create_session
from skywall.core.signals import Signal
from skywall.core.api import register_api
from skywall_iptables.models.rulesets import Ruleset
from skywall_iptables.models.rules import Rule


before_get_rulesets = Signal('before_get_rulesets')
after_get_rulesets = Signal('after_get_rulesets')


def _ruleset_response(ruleset):
    return {
            'id': ruleset.id,
            'active': ruleset.active,
            'groupId': ruleset.group_id,
            }

def _rulesets_response(rulesets):
    return [_ruleset_response(ruleset) for ruleset in rulesets]

def _rule_response(rule):
    return {
            'id': rule.id,
            'order': rule.order,
            'active': rule.active,
            'type': rule.type.name,
            'iface': rule.iface,
            'source': rule.source,
            'destination': rule.destination,
            'service': rule.service,
            'action': rule.action,
            'comment': rule.comment,
            'rulesetId': rule.ruleset_id,
            }

def _rules_response(rules):
    return [_rule_response(rule) for rule in rules]

@register_api('GET', '/iptables/rulesets', before_get_rulesets, after_get_rulesets)
async def get_rulesets(request):
    """
    ---
    tags:
      - Iptables module
    summary: List of rulesets
    description: Returns list of all iptables rulesets with rules
    produces:
      - application/json
    responses:
      200:
        description: List of rulesets with rules
        schema:
          type: object
          title: GetRulesetsResponse
          required:
            - rulesets
            - rules
          properties:
            rulesets:
              type: array
              items:
                type: object
                title: Ruleset
                required:
                  - id
                  - active
                properties:
                  id:
                    type: integer
                  active:
                    type: boolean
                  groupId:
                    type: integer
            rules:
              type: array
              items:
                type: object
                title: Rule
                required:
                  - id
                  - order
                  - active
                  - type
                  - iface
                  - service
                  - action
                  - comment
                  - rulesetId
                properties:
                  id:
                    type: integer
                  order:
                    type: integer
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
    """
    with create_session() as session:
        rulesets = session.query(Ruleset).order_by(Ruleset.group_id).all()
        rules = session.query(Rule).order_by(Rule.order).all()
        return json_response({
                'rulesets': _rulesets_response(rulesets),
                'rules': _rules_response(rules),
                })
