from dicttoxml import dicttoxml
from typing import Any

def to_xml(data: Any) -> str:
    """Convert dict or list to XML string."""
    return dicttoxml(data, custom_root='response', attr_type=False).decode('utf-8')
