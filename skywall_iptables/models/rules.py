import enum
from sqlalchemy import Column, Integer, Boolean, String, Enum, ForeignKey, CheckConstraint, UniqueConstraint
from sqlalchemy.orm import relationship
from skywall.core.database import Model
from skywall.core.signals import Signal


before_rule_create = Signal('before_rule_create')
after_rule_create = Signal('after_rule_create')
before_rule_update = Signal('before_rule_update')
after_rule_update = Signal('after_rule_update')
before_rule_move = Signal('before_rule_move')
after_rule_move = Signal('after_rule_move')
before_rule_delete = Signal('before_rule_delete')
after_rule_delete = Signal('after_rule_delete')


class RuleType(enum.Enum):
    inbound = 'inbound'
    outbound = 'outbound'


class Rule(Model):
    __tablename__ = 'iptables_rule'

    id = Column(Integer, primary_key=True)
    order = Column(Integer, nullable=False)
    active = Column(Boolean, nullable=False)
    type = Column(Enum(RuleType, name='iptables_ruletype'), nullable=False)
    iface = Column(String, nullable=False)
    source = Column(String, nullable=True)
    destination = Column(String, nullable=True)
    service = Column(String, nullable=False)
    action = Column(String, nullable=False)
    comment = Column(String, nullable=False)
    ruleset_id = Column(Integer, ForeignKey('iptables_ruleset.id'), nullable=False)

    ruleset = relationship('Ruleset', back_populates='rules')

    __table_args__ = (
            # Order is unique per ruleset
            UniqueConstraint('ruleset_id', 'order'),
            # Source is defined only for inbound rules and destination ony for outbound rules
            CheckConstraint("""
                CASE type
                    WHEN 'inbound' THEN source IS NOT NULL AND destination IS NULL
                    WHEN 'outbound' THEN source IS NULL AND destination IS NOT NULL
                    ELSE FALSE
                END
                """),
            )

    def __repr__(self):
        return '<Rule id={0.id} ruleset_id={0.ruleset_id}>'.format(self)
