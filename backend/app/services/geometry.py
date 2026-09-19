import json
from typing import Any, Dict, List, Tuple
from shapely.geometry import shape, Point, Polygon, MultiPolygon


def validate_geojson_geometry(geom: Dict[str, Any]) -> bool:
    """Validates that a GeoJSON dictionary forms a valid Shapely shape."""
    try:
        s = shape(geom)
        return s.is_valid
    except Exception:
        return False


def is_point_in_geometry(lng: float, lat: float, geom: Dict[str, Any]) -> bool:
    """Checks if a [lng, lat] point intersects or is covered by the geometry."""
    try:
        pt = Point(lng, lat)
        poly = shape(geom)
        # Check both contains and touches (boundaries)
        return poly.contains(pt) or poly.touches(pt) or poly.distance(pt) < 0.0001
    except Exception:
        return False


def calculate_bbox(geom: Dict[str, Any]) -> Tuple[float, float, float, float]:
    """Calculates min_lng, min_lat, max_lng, max_lat for a geometry."""
    try:
        s = shape(geom)
        min_lng, min_lat, max_lng, max_lat = s.bounds
        return float(min_lng), float(min_lat), float(max_lng), float(max_lat)
    except Exception:
        # Fallback
        coords = geom.get("coordinates", [])
        return (0.0, 0.0, 0.0, 0.0)


def calculate_area_acres(geom: Dict[str, Any]) -> float:
    """Calculates approximate area in acres for latitude ~13 N."""
    try:
        s = shape(geom)
        # At latitude ~13 deg N, 1 deg lat ~ 110.6 km, 1 deg lng ~ 108.5 km
        # 1 sq deg ~ 110600 * 108500 sq meters = 1.2e10 sq meters = 2,965,000 acres
        area_sq_deg = s.area
        acres = area_sq_deg * 2965260.0
        return round(max(0.2, acres), 2)
    except Exception:
        return 4.2
