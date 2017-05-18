from sqlalchemy import Column, Integer, String, TIMESTAMP
from sqlalchemy.sql.functions import current_timestamp
from skywall.core.database import Model


class Sample(Model):
    __tablename__ = 'sample'

    id = Column(Integer, primary_key=True)
    created = Column(TIMESTAMP(timezone=True), nullable=False, server_default=current_timestamp())
    value = Column(String, nullable=False)

    def __repr__(self):
        return '<Sample id={0.id}>'.format(self)