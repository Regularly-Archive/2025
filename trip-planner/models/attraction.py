from sqlalchemy import Column, String, Integer
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.dialects.postgresql import ARRAY

Base = declarative_base()

class Attraction(Base):
    __tablename__ = 'attractions'
    
    name = Column(String, primary_key=True)
    description = Column(String)
    province = Column(String)
    city = Column(String)
    tags = Column(ARRAY(String))
    payment_level = Column(Integer)
