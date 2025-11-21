export function calculateBounds(polygons) {
  const all = polygons.flatMap(p => p.rings[0] || []);
  const lat = all.map(c => c.latitude);
  const lng = all.map(c => c.longitude);

  if (!lat.length || !lng.length) return null;

  return {
    minLat: Math.min(...lat),
    maxLat: Math.max(...lat),
    minLng: Math.min(...lng),
    maxLng: Math.max(...lng),
  };
}

export function checkAndFixRegion(rgn, bounds, mapRef) {
  if (!bounds) return;

  const out =
    rgn.latitude < bounds.minLat ||
    rgn.latitude > bounds.maxLat ||
    rgn.longitude < bounds.minLng ||
    rgn.longitude > bounds.maxLng;

  if (!out) return;

  const lat = (bounds.minLat + bounds.maxLat) / 2;
  const lng = (bounds.minLng + bounds.maxLng) / 2;

  mapRef.current?.animateToRegion({
    latitude: lat,
    longitude: lng,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  });

  return true;
}
