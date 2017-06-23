import enum
from aiohttp.web import json_response, HTTPNotFound
from skywall.core.signals import Signal
from skywall.core.api import register_api, parse_obj_path_param, parse_enum_path_param
from skywall.core.database import create_session
from skywall_iptables.models.rules import Rule, before_rule_move, after_rule_move


before_move_rule = Signal('before_move_rule')
after_move_rule = Signal('before_move_rule')


class MoveDirection(enum.Enum):
    before = 'before'
    after = 'after'


@register_api('POST', '/iptables/rules/{ruleId}/{direction}/{otherId}', before_move_rule, after_move_rule)
async def move_rule(request):
    """
    ---
    tags:
      - Iptables module
    summary: Move rule
    description: Moves an existing rule before or after another rule
    produces:
      - application/json
    parameters:
      - name: ruleId
        in: path
        description: ID of rule to move
        required: true
        type: integer
      - name: direction
        in: path
        description: Whether to move the rule before or after the other rule
        required: true
        type: string
        enum:
         - before
         - after
      - name: otherId
        in: path
        description: ID of rule to move before or after
        required: true
        type: integer
    responses:
      200:
        description: Rule moved
        schema:
          type: object
          title: MoveRuleResponse
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
        other = parse_obj_path_param(request, 'otherId', session, Rule)
        direction = parse_enum_path_param(request, 'direction', MoveDirection)

        if rule.ruleset != other.ruleset:
            raise HTTPNotFound(reason='Requested otherId not found')

        before_rule_move.emit(session=session, rule=rule, direction=direction, other=other)

        if rule.order < other.order:
            old_order = rule.order
            new_order = other.order - 1 if direction == MoveDirection.before else other.order

            rule.order = -new_order
            condition = (Rule.ruleset == rule.ruleset) & (Rule.order > old_order) & (Rule.order <= new_order)
            session.query(Rule).filter(condition).update({'order': (Rule.order - 1) * -1})

        if rule.order > other.order:
            old_order = rule.order
            new_order = other.order if direction == MoveDirection.before else other.order + 1

            rule.order = -new_order
            condition = (Rule.ruleset == rule.ruleset) & (Rule.order >= new_order) & (Rule.order < old_order)
            session.query(Rule).filter(condition).update({'order': (Rule.order + 1) * -1})

        # PSQL checks the unique constaint after each row, so it's not possible to reorder rows in a single update
        condition = (Rule.ruleset == rule.ruleset) & (Rule.order < 0)
        session.query(Rule).filter(condition).update({'order': Rule.order * -1})

        session.flush()
        after_rule_move.emit(session=session, rule=rule, direction=direction, other=other)
        return json_response({'ok': True})
