import { useState, useCallback } from "react";
import { useMapEvents, Marker, Polyline, Polygon } from "react-leaflet";
import L from "leaflet";
import { Check, X, Undo2, MousePointer } from "lucide-react";
import type { GeoJSONPolygonGeometry } from "../../api/contracts";

interface ManualParcelDrawProps {
  isActive: boolean;
  onPolygonComplete: (geometry: GeoJSONPolygonGeometry) => void;
  onCancel: () => void;
}

// Custom Leaflet vertex icon
const vertexIcon = L.divIcon({
  className: "custom-draw-vertex",
  html: `<div style="width: 12px; height: 12px; background: #B76543; border: 2px solid #FFFFFF; border-radius: 50%; box-shadow: 0 0 4px rgba(0,0,0,0.5);"></div>`,
  iconSize: [12, 12],
  iconAnchor: [6, 6],
});

export function ManualParcelDraw({
  isActive,
  onPolygonComplete,
  onCancel,
}: ManualParcelDrawProps) {
  const [points, setPoints] = useState<[number, number][]>([]);

  useMapEvents({
    click(e) {
      if (!isActive) return;
      const { lat, lng } = e.latlng;
      setPoints((prev) => [...prev, [lat, lng]]);
    },
  });

  const handleUndo = useCallback(() => {
    setPoints((prev) => prev.slice(0, -1));
  }, []);

  const handleClear = useCallback(() => {
    setPoints([]);
  }, []);

  const handleComplete = useCallback(() => {
    if (points.length < 3) return;

    // Convert Leaflet [lat, lng] to RFC 7946 GeoJSON [lng, lat]
    const closedCoordinates: [number, number][] = [
      ...points.map(([lat, lng]): [number, number] => [Number(lng.toFixed(6)), Number(lat.toFixed(6))]),
      [Number(points[0][1].toFixed(6)), Number(points[0][0].toFixed(6))], // Close the ring
    ];

    const geojson: GeoJSONPolygonGeometry = {
      type: "Polygon",
      coordinates: [closedCoordinates],
    };

    onPolygonComplete(geojson);
    setPoints([]);
  }, [points, onPolygonComplete]);

  if (!isActive) return null;

  return (
    <>
      {/* Markers for vertices */}
      {points.map((pt, idx) => (
        <Marker key={idx} position={pt} icon={vertexIcon} />
      ))}

      {/* Polyline or completed polygon preview */}
      {points.length >= 3 ? (
        <Polygon
          positions={points}
          pathOptions={{
            color: "#B76543",
            weight: 2.5,
            fillColor: "#B76543",
            fillOpacity: 0.25,
            dashArray: "5, 5",
          }}
        />
      ) : points.length >= 2 ? (
        <Polyline
          positions={points}
          pathOptions={{
            color: "#B76543",
            weight: 2,
            dashArray: "4, 4",
          }}
        />
      ) : null}

      {/* Floating Drawing Toolbar */}
      <div className="manual-draw-floating-toolbar">
        <div className="draw-toolbar-header">
          <MousePointer size={14} className="draw-icon" />
          <span className="draw-title">Draw Manual Boundary</span>
          <span className="draw-badge">Source: Manual</span>
        </div>

        <p className="draw-instructions">
          {points.length === 0 && "Click on map to place your 1st boundary point."}
          {points.length === 1 && "Click to place the 2nd boundary point."}
          {points.length === 2 && "Click to place the 3rd boundary point to form a field."}
          {points.length >= 3 && `${points.length} points placed. Click Complete to finish.`}
        </p>

        <div className="draw-actions-row">
          <button
            type="button"
            className="draw-btn complete"
            disabled={points.length < 3}
            onClick={handleComplete}
          >
            <Check size={14} />
            <span>Complete Polygon ({points.length} pts)</span>
          </button>

          <button
            type="button"
            className="draw-btn undo"
            disabled={points.length === 0}
            onClick={handleUndo}
          >
            <Undo2 size={13} />
            <span>Undo</span>
          </button>

          <button
            type="button"
            className="draw-btn cancel"
            onClick={() => {
              handleClear();
              onCancel();
            }}
          >
            <X size={13} />
            <span>Cancel</span>
          </button>
        </div>
      </div>
    </>
  );
}
