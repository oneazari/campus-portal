const bcrypt = require('bcryptjs');

// Mock user store with hashed passwords and test MFA secrets
const usersDB = [
  {
    id: 'usr_admin_1',
    username: 'admin',
    email: 'admin@example.com',
    passwordHash: bcrypt.hashSync('password123', 10),
    mfaSecret: '123456', // Test MFA code
    role: 'admin',
    isRegistered: true,
    devices: [], // Recognized device IDs stored here
    lastIp: null,
    lastLocation: null
  },
  {
    id: 'usr_faculty_1',
    username: 'faculty',
    email: 'faculty@example.com',
    passwordHash: bcrypt.hashSync('password123', 10),
    mfaSecret: '123456',
    role: 'faculty',
    isRegistered: true,
    devices: [],
    lastIp: null,
    lastLocation: null
  },
  {
    id: 'usr_student_1',
    username: 'student',
    email: 'student@example.com',
    passwordHash: bcrypt.hashSync('password123', 10),
    mfaSecret: '123456',
    role: 'student',
    isRegistered: true,
    devices: [],
    lastIp: null,
    lastLocation: null
  }
];

module.exports = {
  findUserByIdentifier: (identifier) =>
    usersDB.find((u) => u.username === identifier || u.email === identifier),
  findUserById: (id) => usersDB.find((u) => u.id === id),
  findUserByDeviceId: (deviceId) => usersDB.find((u) => u.devices.includes(deviceId)),
  usersDB
};