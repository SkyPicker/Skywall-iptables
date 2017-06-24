from sqlalchemy import Column, Integer, Boolean, ForeignKey, Index
from sqlalchemy.orm import relationship, backref
from sqlalchemy.sql.expression import func
from skywall.core.database import Model, create_session, after_database_connect
from skywall.core.signals import Signal
from skywall.models.groups import Group, after_group_create


before_ruleset_create = Signal('before_ruleset_create')
after_ruleset_create = Signal('after_ruleset_create')
before_ruleset_update = Signal('before_ruleset_update')
after_ruleset_update = Signal('after_ruleset_update')


class Ruleset(Model):
    __tablename__ = 'iptables_ruleset'

    id = Column(Integer, primary_key=True)
    active = Column(Boolean, nullable=False, default=False)
    group_id = Column(Integer, ForeignKey('group.id'), nullable=True, unique=True)

    rules = relationship('Rule', back_populates='ruleset', order_by='Rule.order',
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


def get_group_ruleset(session, group):
    """
    We can't use directly `group.iptables_ruleset` for the DEFAULT group because it is represented by `None`.
    Unless we are sure the group is not DEFAULT, we must use `get_group_ruleset(session, group)` instead.
    """
    if group is None:
        # pylint: disable=singleton-comparison
        return session.query(Ruleset).filter(Ruleset.group_id == None).first()
    else:
        return group.iptables_ruleset


@after_database_connect.connect
def after_database_connect_listener():
    """
    Automatically create all missing rulesets when starting server. Useful if there were some groups
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
            before_ruleset_create.emit(session=session, ruleset=ruleset)
            session.add(ruleset)
            session.flush()
            after_ruleset_create.emit(session=session, ruleset=ruleset)


@after_group_create.connect
def after_group_create_listener(session, group):
    """
    Automatically create a ruleset with every new group.
    """
    ruleset = Ruleset(group_id=group.id)
    before_ruleset_create.emit(session=session, ruleset=ruleset)
    session.add(ruleset)
    session.flush()
    after_ruleset_create.emit(session=session, ruleset=ruleset)
