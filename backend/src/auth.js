const crypto = require('node:crypto');

const TOKEN_SECRET = process.env.JWT_SECRET || 'local-dev-secret-change-me';
const TOKEN_EXPIRES_SECONDS = 60 * 60 * 24 * 7;
const TOKEN_ISSUER = process.env.JWT_ISSUER || 'kites-local-backend';
const TOKEN_AUDIENCE = process.env.JWT_AUDIENCE || 'kites-mobile-app';

function base64UrlEncode(input) {
  const raw = typeof input === 'string' ? Buffer.from(input, 'utf8') : input;
  return raw
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function base64UrlDecodeToString(input) {
  const normalized = input.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4);
  return Buffer.from(padded, 'base64').toString('utf8');
}

function signToken(payload) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const fullPayload = {
    ...payload,
    iss: TOKEN_ISSUER,
    aud: TOKEN_AUDIENCE,
    jti: crypto.randomUUID(),
    iat: now,
    exp: now + TOKEN_EXPIRES_SECONDS,
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(fullPayload));
  const signatureBase = `${encodedHeader}.${encodedPayload}`;
  const signature = crypto
    .createHmac('sha256', TOKEN_SECRET)
    .update(signatureBase)
    .digest();

  return `${signatureBase}.${base64UrlEncode(signature)}`;
}

function verifyToken(token) {
  const pieces = token.split('.');
  if (pieces.length !== 3) {
    throw new Error('Invalid token format');
  }

  const [encodedHeader, encodedPayload, receivedSignature] = pieces;
  const signatureBase = `${encodedHeader}.${encodedPayload}`;
  const expectedSignature = base64UrlEncode(
    crypto.createHmac('sha256', TOKEN_SECRET).update(signatureBase).digest(),
  );

  if (expectedSignature !== receivedSignature) {
    throw new Error('Invalid token signature');
  }

  const payload = JSON.parse(base64UrlDecodeToString(encodedPayload));
  const now = Math.floor(Date.now() / 1000);
  if (payload.iss !== TOKEN_ISSUER) {
    throw new Error('Invalid token issuer');
  }
  if (payload.aud !== TOKEN_AUDIENCE) {
    throw new Error('Invalid token audience');
  }
  if (!payload.exp || payload.exp < now) {
    throw new Error('Token expired');
  }

  return payload;
}

function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const iterations = 120000;
  const keyLength = 64;
  const digest = 'sha512';
  const hash = crypto
    .pbkdf2Sync(password, salt, iterations, keyLength, digest)
    .toString('hex');
  return `${iterations}:${salt}:${hash}`;
}

function verifyPassword(password, passwordHash) {
  const [iterationsRaw, salt, storedHash] = String(passwordHash || '').split(':');
  if (!iterationsRaw || !salt || !storedHash) {
    return false;
  }
  const iterations = Number(iterationsRaw);
  if (!Number.isFinite(iterations) || iterations <= 0) {
    return false;
  }

  const recomputedHash = crypto
    .pbkdf2Sync(password, salt, iterations, 64, 'sha512')
    .toString('hex');

  return crypto.timingSafeEqual(Buffer.from(storedHash, 'hex'), Buffer.from(recomputedHash, 'hex'));
}

function createOtp() {
  return String(crypto.randomInt(100000, 999999));
}

function hashOtp(otp) {
  return crypto.createHash('sha256').update(String(otp)).digest('hex');
}

module.exports = {
  signToken,
  verifyToken,
  hashPassword,
  verifyPassword,
  createOtp,
  hashOtp,
};
