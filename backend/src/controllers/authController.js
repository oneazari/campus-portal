const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { findUserByIdentifier, findUserById, findUserByDeviceId } = require('../utils/db');
const { getLocationFromCoordinates } = require('../services/locationService');
const { JWT_SECRET, IS_PROD } = require('../config/env');

/**
 * Login with Credentials + MFA Code + GPS Location Enforcement + Cookie JWT
 */
exports.login = async (req, res) => {
  const { username, password, mfaCode, latitude, longitude } = req.body;

  if (!username || !password || !mfaCode || latitude === undefined || longitude === undefined) {
    return res.status(400).json({ message: 'Username, password, MFA code, and device location are required.' });
  }

  // 1. Device GPS location check (Kerala only)
  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const locationData = getLocationFromCoordinates(Number(latitude), Number(longitude));

  if (!locationData.isAllowedLocation) {
    return res.status(403).json({
      message: 'Access denied: Device location is outside Kerala.',
      location: locationData
    });
  }

  const user = findUserByIdentifier(username);
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // 2. Password Verification
  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // 3. MFA Verification
  if (user.mfaSecret !== mfaCode) {
    return res.status(401).json({ message: 'Invalid MFA verification code' });
  }

  if (['admin', 'faculty'].includes(user.role) && !user.isRegistered) {
    return res.status(403).json({
      message: 'This admin or faculty account is not registered.'
    });
  }

  // 4. Device Identification & Storage
  let deviceId = req.cookies.device_id;
  if (!deviceId) {
    deviceId = uuidv4();
    res.cookie('device_id', deviceId, {
      httpOnly: true,
      secure: IS_PROD,
      sameSite: IS_PROD ? 'none' : 'lax',
      maxAge: 365 * 24 * 60 * 60 * 1000
    });
  }

  const registeredDeviceOwner = findUserByDeviceId(deviceId);
  if (registeredDeviceOwner && registeredDeviceOwner.id !== user.id) {
    return res.status(403).json({ message: 'This device is registered to another user.' });
  }

  if (!user.devices.includes(deviceId)) {
    user.devices.push(deviceId);
  }

  user.lastIp = clientIp;
  user.lastLocation = { ...locationData, ip: clientIp };

  // 5. Issue JWT Cookie
  const token = jwt.sign(
    { id: user.id, role: user.role },
    JWT_SECRET,
    { expiresIn: '8h' }
  );

  res.cookie('auth_token', token, {
    httpOnly: true,
    secure: IS_PROD,
    sameSite: IS_PROD ? 'none' : 'lax',
    maxAge: 8 * 60 * 60 * 1000
  });

  return res.json({
    message: 'Login successful',
    user: {
      id: user.id,
      username: user.username,
      role: user.role
    },
    location: locationData
  });
};

/**
 * Returns session user details for GET /me
 */
exports.getMe = (req, res) => {
  const user = findUserById(req.user.id);
  if (!user) {
    return res.status(401).json({ message: 'User record not found' });
  }

  return res.json({
    id: user.id,
    username: user.username,
    role: user.role,
    lastLocation: user.lastLocation
  });
};

/**
 * Clears session cookie for POST /logout
 */
exports.logout = (req, res) => {
  res.clearCookie('auth_token', {
    httpOnly: true,
    secure: IS_PROD,
    sameSite: IS_PROD ? 'none' : 'lax'
  });
  return res.json({ message: 'Logged out successfully' });
};