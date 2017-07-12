import subprocess
from skywall.core.config import config
from skywall.core.signals import Signal
from skywall.core.actions import AbstractClientAction, register_client_action
from skywall.core.server import get_server, after_server_connection_open
from skywall.core.database import create_session
from skywall.models.clients import Client, after_client_create, after_client_update
from skywall.models.groups import get_group_clients, after_group_update, after_group_delete
from skywall_iptables.models.rulesets import get_group_ruleset, after_ruleset_create, after_ruleset_update
from skywall_iptables.models.rules import (
        RuleType, after_rule_create, after_rule_update, after_rule_move, after_rule_delete,
        )


@register_client_action
class ApplyRulesClientAction(AbstractClientAction):
    name = 'iptables-apply-rules'
    before_send = Signal('ApplyRulesClientAction.before_send')
    after_send = Signal('ApplyRulesClientAction.after_send')
    before_receive = Signal('ApplyRulesClientAction.before_receive')
    after_receive = Signal('ApplyRulesClientAction.after_receive')
    after_confirm = Signal('ApplyRulesClientAction.after_confirm')

    def _sudo(self, args):
        if config.get('iptables.dryrun'):
            print('IPTABLES DRY RUN:', ['sudo', '-n'] + args)
        else:
            print('IPTABLES:', ['sudo', '-n'] + args)
            subprocess.run(['sudo', '-n'] + args)

    def _inbound(self):
        self._sudo(['iptables', '-F', 'INPUT'])
        for rule in self.payload['rules']:
            if rule['type'] == RuleType.inbound.name:
                args = ['iptables', '-A', 'INPUT', '-p', 'tcp']
                if rule['iface']:
                    args += ['-i', rule['iface']]
                if rule['source']:
                    args += ['-s', rule['source']]
                if rule['service']:
                    args += ['--dport', rule['service']]
                if rule['action']:
                    args += ['-j', rule['action']]
                self._sudo(args)

    def _outbound(self):
        self._sudo(['iptables', '-F', 'OUTPUT'])
        for rule in self.payload['rules']:
            if rule['type'] == RuleType.outbound.name:
                args = ['iptables', '-A', 'OUTPUT', '-p', 'tcp']
                if rule['iface']:
                    args += ['-o', rule['iface']]
                if rule['destination']:
                    args += ['-d', rule['destination']]
                if rule['service']:
                    args += ['--dport', rule['service']]
                if rule['action']:
                    args += ['-j', rule['action']]
                self._sudo(args)

    def execute(self, client):
        self._inbound()
        self._outbound()


def _rule_payload(rule):
    return {
            'type': rule.type.name,
            'iface': rule.iface,
            'source': rule.source,
            'destination': rule.destination,
            'service': rule.service,
            'action': rule.action,
            }

def _send_rules(session, clients):
    for client in clients:
        connection = get_server().get_connection(client.id)
        if connection:
            ruleset = get_group_ruleset(session, client.group)
            if ruleset.active:
                rules = [_rule_payload(rule) for rule in ruleset.rules if rule.active]
                connection.send_action(ApplyRulesClientAction(rules=rules))


@after_server_connection_open.connect
def after_server_connection_open_listener(connection):
    """
    Automatically apply client rules when he connects.
    """
    with create_session() as session:
        client = session.query(Client).filter(Client.id == connection.client_id).first()
        _send_rules(session, [client])


@after_client_create.connect
@after_client_update.connect
@after_group_update.connect
@after_group_delete.connect
def after_groups_change_listener(session, **kwargs):
    """
    Reapply rules to all clients in all groups after every change to clients/groups assignment.
    Rearanging clients in groups may influence rules for other groups as well, because they may
    depend on the list of clients in the particular group.

    We don't listen to `after_group_create` because on `after_group_create` we automatically create
    a new ruleset and we listen to `after_ruleset_create` below. The new group may not influence
    rules for other groups because it can't be mentioned in them, yet.

    There is no `after_client_delete` signal, yet. We must start to listen to it after implementing
    it.
    """
    clients = session.query(Client).all()
    _send_rules(session, clients)


@after_ruleset_create.connect
@after_ruleset_update.connect
def after_rulesets_change_listener(session, ruleset, **kwargs):
    """
    Reapply rules to all clients in the affected group.

    There is no `after_ruleset_delete` signal, because rulesets are deleted automatically with
    their groups. We listen to `after_group_delete` above.
    """
    clients = get_group_clients(session, ruleset.group)
    _send_rules(session, clients)


@after_rule_create.connect
@after_rule_update.connect
@after_rule_move.connect
@after_rule_delete.connect
def after_rules_change_listener(session, rule, **kwargs):
    """
    Reapply rules to all clients in the affected group.
    """
    clients = get_group_clients(session, rule.ruleset.group)
    _send_rules(session, clients)
