/**
 * Resolves IP address to location and checks if it belongs to Kerala.
 */
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

module.exports = { getLocationFromIp };