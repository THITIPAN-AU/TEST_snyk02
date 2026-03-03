// MOCKUP FOR SNYK SECURITY TESTING ONLY
const md5 = require('md5');
const jwt = require('jsonwebtoken');

// [VULN] Hardcoded weak JWT secret
const JWT_SECRET = 'mysecretkey123';
const ADMIN_EMAIL = 'admin@company.com';
const ADMIN_PASSWORD = 'admin1234';

// [VULN] MD5 is broken - no salt
function hashPassword(password) {
  return md5(password);
}

// [VULN] No bcrypt, no salt
function verifyPassword(input, stored) {
  return md5(input) === stored;
}

// [VULN] JWT never expires + weak secret
function generateToken(userId, email) {
  return jwt.sign({ userId, email, isAdmin: false }, JWT_SECRET);
}

// [VULN] Algorithm not pinned = alg:none attack possible
function verifyToken(token) {
  try { return jwt.verify(token, JWT_SECRET); }
  catch (e) { return null; }
}

// [VULN] Weak password policy (length > 3 only)
function isPasswordStrong(p) { return p.length > 3; }

module.exports = { hashPassword, verifyPassword, generateToken, verifyToken, isPasswordStrong, ADMIN_EMAIL, ADMIN_PASSWORD };
