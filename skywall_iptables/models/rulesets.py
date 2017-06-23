import enum
from sqlalchemy import Column, Integer, Boolean, String, Enum, ForeignKey, CheckConstraint, UniqueConstraint, Index
from sqlalchemy.orm import relationship, backref
from sqlalchemy.sql.expression import func
from skywall.core.database import Model, create_session, after_database_connect
from skywall.models.groups import Group, after_group_create


class Ruleset(Model):
    __tablename__ = 'iptables_ruleset'

    id = Column(Integer, primary_key=True)
    active = Column(Boolean, nullable=False, default=False)
    group_id = Column(Integer, ForeignKey('group.id'), nullable=True, unique=True)

    rules = relationship('Rule', back_populates='ruleset',
                cascade='save-update, merge, delete, delete-orphan')

    # Relations to Skywall core models
    group = relationship('Group',
            backref=backref('iptables_ruleset', uselist=False,
                cascade='save-update, merge, delete, delete-orphan'))

    __table_args__ = (
            # Constraint to make sure there is only a single ruleset with NULL group_id
            Index('iptables_ruleset_group_id_null', func.coalesce(group_id, 0), unique=True,
                postgresql_where=(group_id == None)), # pylint: disable=singleton-comparison
            )

    def __repr__(self):
        return '<Ruleset id={0.id} group_id={0.group_id}>'.format(self)


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


@after_database_connect.connect
def after_database_connect_listener():
    """
    Automatically create any missing rulesets when starting server. Useful if there were some groups
    created before the module was enabled. Also creates a ruleset for the DEFAULT group if there is
    none, yet.
    """
    with create_session() as session:
        groups = session.query(Group).all()
        rulesets = session.query(Ruleset).all()

        all_group_ids = set([None] + [group.id for group in groups])
        used_group_ids = set([ruleset.group_id for ruleset in rulesets])

        for group_id in all_group_ids - used_group_ids:
            ruleset = Ruleset(group_id=group_id)
            session.add(ruleset)


@after_group_create.connect
def after_group_create_listener(session, group):
    """
    Automatically create a ruleset with every new group.
    """
    ruleset = Ruleset(group_id=group.id)
    session.add(ruleset)
    session.flush()
