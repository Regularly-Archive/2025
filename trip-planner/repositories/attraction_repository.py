from typing import List, Optional
from sqlalchemy import select, and_, cast
from sqlalchemy.orm import Session
from sqlalchemy.dialects.postgresql import ARRAY, TEXT
from models.attraction import Attraction
from repositories.database import get_db

class AttractionRepository:
    def __init__(self):
        self.db: Session = next(get_db())

    def search_attractions(self,
            province: Optional[List[str]] = None,
            city: Optional[List[str]] = None,
            tags: Optional[List[str]] = None) -> List[dict]:
        
        query = select(Attraction).order_by(Attraction.payment_level.desc())
        
        filters = []
        if province:
            filters.append(Attraction.province.in_(province))
        if city:
            filters.append(Attraction.city.in_(city))
        if tags:
            # SELECT * FROM attractions WHERE tags && ARRAY['文化', '历史']
            filters.append(Attraction.tags.overlap(cast(tags, ARRAY(TEXT))))
            
        if filters:
            query = query.where(and_(*filters))
            
        results = self.db.execute(query).scalars().all()
        
        return [{
            "name": attraction.name,
            "description": attraction.description,
            "province": attraction.province,
            "city": attraction.city,
            "tags": attraction.tags,
            "payment_level": attraction.payment_level
        } for attraction in results]

    def close(self):
        self.db.close()
