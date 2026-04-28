function getDistance(lat1, lng1, lat2, lng2) {
  return Math.sqrt((lat1 - lat2) ** 2 + (lng1 - lng2) ** 2);
}

export function findNearestDriver(drivers, userLat, userLng) {
  return drivers
    .filter(d => d.available)
    .sort((a, b) =>
      getDistance(a.lat, a.lng, userLat, userLng) -
      getDistance(b.lat, b.lng, userLat, userLng)
    )[0];
}