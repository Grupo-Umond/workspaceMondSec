export function parseGeoJSON(geojson) {
  const feats = geojson.type === 'FeatureCollection' ? geojson.features : [geojson];
  const out = [];

  feats.forEach((f, i) => {
    const name = f.properties?.name || `Area ${i}`;
    const g = f.geometry;
    if (!g) return;

    if (g.type === 'Polygon') {
      const rings = g.coordinates.map(ring =>
        ring.map(([lng, lat]) => ({ latitude: lat, longitude: lng }))
      );
      out.push({ id: String(i), name, rings });
    }

    if (g.type === 'MultiPolygon') {
      g.coordinates.forEach((poly, j) => {
        const rings = poly.map(ring =>
          ring.map(([lng, lat]) => ({ latitude: lat, longitude: lng }))
        );
        out.push({ id: `${i}-${j}`, name, rings });
      });
    }
  });

  return out;
}
