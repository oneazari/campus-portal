const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { findUserByIdentifier, findUserById } = require('../utils/db');
const { getLocationFromIp } = require('../services/locationService');
const { JWT_SECRET, IS_PROD } = require('../config/env');

/**
 * Checks if the request comes from a recognized device cookie.
 */
exports.checkDevice = (req, res) => {
  const deviceId = req.cookies.device_id;
  
  if (!deviceId) {
    return res.json({ 
      recognized: false, 
      showLoginForm: false,
      message: 'Unrecognized device. Registration/MFA authorization required.' 
    });
  }

  return res.json({ 
    recognized: true, 
    showLoginForm: true,
    deviceId 
  });
};

/**
 * Registers a new device ID cookie for unrecognized machines.
 */
exports.registerDevice = (req, res) => {
  let deviceId = req.cookies.device_id || uuidv4();

  res.cookie('device_id', deviceId, {
    httpOnly: true,
    secure: IS_PROD,
    sameSite: 'lax',
    maxAge: 365 * 24 * 60 * 60 * 1000 // 1 year
  });

  return res.json({ message: 'Device introduced successfully', deviceId });
};

/**
 * Login with Credentials + MFA Code + Kerala IP Location Enforcement + Cookie JWT
 */
exports.login = async (req, res) => {
  const { username, password, mfaCode } = req.body;

  if (!username || !password || !mfaCode) {
    return res.status(400).json({ message: 'Username, password, and MFA code are required.' });
  }

  // 1. IP Address & Geolocation Check (Kerala Only)
  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const locationData = getLocationFromIp(clientIp);

  if (!locationData.isAllowedLocation) {
    return res.status(403).json({
      message: 'Access denied: Portal access is restricted to region Kerala only.',
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

  // 4. Device Identification & Storage
  let deviceId = req.cookies.device_id;
  if (!deviceId) {
    deviceId = uuidv4();
    res.cookie('device_id', deviceId, {
      httpOnly: true,
      secure: IS_PROD,
      sameSite: 'lax',
      maxAge: 365 * 24 * 60 * 60 * 1000
    });
  }

  if (!user.devices.includes(deviceId)) {
    user.devices.push(deviceId);
  }

  user.lastIp = clientIp;
  user.lastLocation = locationData;

  // 5. Issue JWT Cookie
  const token = jwt.sign(
    { id: user.id, role: user.role },
    JWT_SECRET,
    { expiresIn: '8h' }
  );

  res.cookie('auth_token', token, {
    httpOnly: true,
    secure: IS_PROD,
    sameSite: 'lax',
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
    sameSite: 'lax'
  });
  return res.json({ message: 'Logged out successfully' });
};