from dicttoxml import dicttoxml
from typing import Any


def to_xml(data: Any) -> str:
    """Convert dict or list to XML string."""
    return dicttoxml(data, custom_root='response', attr_type=False).decode('utf-8')


def model_to_dict(obj):
    """Convert SQLAlchemy object to Python dict"""
    if obj is None:
        return None
    return {c.name: getattr(obj, c.name) for c in obj.__table__.columns}