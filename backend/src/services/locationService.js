/** Approximate Kerala boundary used for client-provided GPS coordinates. */
const KERALA_BOUNDARY = [
  [8.18, 76.42], [8.35, 76.72], [8.52, 76.94], [8.75, 77.05], [9.35, 77.25],
  [10.15, 77.05], [11.00, 76.65], [11.80, 76.15], [12.50, 75.65],
  [12.80, 75.10], [12.45, 74.90], [11.60, 74.95], [10.50, 75.05],
  [9.45, 75.10], [8.55, 75.20], [8.18, 76.00]
];

function isInsideBoundary(latitude, longitude, boundary) {
  let inside = false;

  for (let index = 0, previous = boundary.length - 1; index < boundary.length; previous = index++) {
    const [currentLatitude, currentLongitude] = boundary[index];
    const [previousLatitude, previousLongitude] = boundary[previous];
    const latitudeDifference = currentLatitude - previousLatitude;
    const longitudeDifference = currentLongitude - previousLongitude;
    const crossProduct = latitudeDifference * (longitude - previousLongitude) -
      longitudeDifference * (latitude - previousLatitude);

    // Treat points on the boundary as inside and avoid division by zero on vertical edges.
    if (Math.abs(crossProduct) < 1e-10 &&
      latitude >= Math.min(previousLatitude, currentLatitude) &&
      latitude <= Math.max(previousLatitude, currentLatitude) &&
      longitude >= Math.min(previousLongitude, currentLongitude) &&
      longitude <= Math.max(previousLongitude, currentLongitude)) {
      return true;
    }

    const crossesLongitude = (currentLongitude > longitude) !== (previousLongitude > longitude);
    if (crossesLongitude) {
      const crossingLatitude = latitudeDifference * (longitude - currentLongitude) /
        (previousLongitude - currentLongitude) + currentLatitude;

      if (latitude < crossingLatitude) inside = !inside;
    }
  }

  return inside;
}

function getLocationFromCoordinates(latitude, longitude) {
  const validCoordinates = Number.isFinite(latitude) && Number.isFinite(longitude) &&
    latitude >= -90 && latitude <= 90 && longitude >= -180 && longitude <= 180;
  const isAllowedLocation = validCoordinates && isInsideBoundary(latitude, longitude, KERALA_BOUNDARY);

  return {
    latitude,
    longitude,
    region: isAllowedLocation ? 'Kerala' : 'Outside Kerala',
    isAllowedLocation,
    capturedAt: new Date().toISOString()
  };
}

/** Resolves IP address for audit metadata only. */
function getLocationFromIp(ip) {
  // Clean up IPv6 mapped IPv4 addresses (e.g. ::ffff:127.0.0.1 -> 127.0.0.1)
  const cleanIp = ip ? ip.replace(/^.*:/, '') : '';
  const isLocal = cleanIp === '127.0.0.1' || ip === '::1' || ip === 'localhost';

  // For production, integrate an IP geolocation service (e.g., ipapi.co, MaxMind)
  // For local development, default region is set to 'Kerala'
  const region = isLocal ? 'Kerala' : 'Unknown';
  const country = isLocal ? 'India' : 'Unknown';

  const isAllowedLocation = region.toLowerCase() === 'kerala';

  return {
    ip: isLocal ? '127.0.0.1 (Local Dev)' : ip,
    country,
    region,
    city: isLocal ? 'Kochi' : 'Unknown',
    isAllowedLocation,
    capturedAt: new Date().toISOString()
  };
}

module.exports = { getLocationFromCoordinates, getLocationFromIp };