import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: 'ADMIN' | 'USER';
  createdAt: string;
  updatedAt: string;
}

export interface Session {
  id: string;
  sessionToken: string;
  userId: string;
  expiresAt: string;
  createdAt: string;
}

export interface PasswordResetToken {
  id: string;
  tokenHash: string;
  email: string;
  expiresAt: string;
  used: boolean;
  createdAt: string;
}

interface AuthDatabase {
  users: User[];
  sessions: Session[];
  resetTokens: PasswordResetToken[];
  failedAttempts: Record<string, { count: number; firstAttempt: number; lockedUntil?: number }>;
}

const DB_DIR = path.resolve(__dirname, '../../data');
const DB_FILE = path.join(DB_DIR, 'auth.json');

// Ensure database directory and file exist
function getDb(): AuthDatabase {
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
      const initialDb: AuthDatabase = {
        users: [],
        sessions: [],
        resetTokens: [],
        failedAttempts: {},
      };
      fs.writeFileSync(DB_FILE, JSON.stringify(initialDb, null, 2), 'utf-8');
      return initialDb;
    }
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading auth database:', err);
    return { users: [], sessions: [], resetTokens: [], failedAttempts: {} };
  }
}

function saveDb(data: AuthDatabase): void {
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving auth database:', err);
  }
}

// Cryptographic Password Hashing with Scrypt & Salt
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.scryptSync(password, salt, 64);
  return `${salt}:${derivedKey.toString('hex')}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  try {
    const [salt, key] = storedHash.split(':');
    if (!salt || !key) return false;
    const derivedKey = crypto.scryptSync(password, salt, 64);
    const keyBuffer = Buffer.from(key, 'hex');
    return crypto.timingSafeEqual(derivedKey, keyBuffer);
  } catch (err) {
    return false;
  }
}

// Generate Secure Random Tokens
export function generateToken(bytes = 32): string {
  return crypto.randomBytes(bytes).toString('hex');
}

export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

// Rate Limiting Against Brute-Force Attacks
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

export function checkLoginRateLimit(identifier: string): { allowed: boolean; waitMinutes?: number } {
  const db = getDb();
  const record = db.failedAttempts[identifier];
  if (!record) return { allowed: true };

  const now = Date.now();
  if (record.lockedUntil && record.lockedUntil > now) {
    const waitMinutes = Math.ceil((record.lockedUntil - now) / 60000);
    return { allowed: false, waitMinutes };
  }

  // Reset if window has passed
  if (now - record.firstAttempt > LOCKOUT_DURATION_MS) {
    delete db.failedAttempts[identifier];
    saveDb(db);
    return { allowed: true };
  }

  return { allowed: true };
}

export function recordFailedLogin(identifier: string): { locked: boolean; waitMinutes?: number } {
  const db = getDb();
  const now = Date.now();
  const record = db.failedAttempts[identifier] || { count: 0, firstAttempt: now };

  record.count += 1;
  if (record.count >= MAX_FAILED_ATTEMPTS) {
    record.lockedUntil = now + LOCKOUT_DURATION_MS;
    db.failedAttempts[identifier] = record;
    saveDb(db);
    return { locked: true, waitMinutes: 15 };
  }

  db.failedAttempts[identifier] = record;
  saveDb(db);
  return { locked: false };
}

export function resetFailedAttempts(identifier: string): void {
  const db = getDb();
  if (db.failedAttempts[identifier]) {
    delete db.failedAttempts[identifier];
    saveDb(db);
  }
}

// User Operations
export function findUserByEmail(email: string): User | null {
  const db = getDb();
  const normalized = email.trim().toLowerCase();
  return db.users.find((u) => u.email.toLowerCase() === normalized) || null;
}

export function findUserById(id: string): User | null {
  const db = getDb();
  return db.users.find((u) => u.id === id) || null;
}

export function updateUser(id: string, updates: Partial<User>): User | null {
  const db = getDb();
  const idx = db.users.findIndex((u) => u.id === id);
  if (idx === -1) return null;

  db.users[idx] = {
    ...db.users[idx],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  saveDb(db);
  return db.users[idx];
}

// Session Operations
export function createSession(userId: string, rememberMe = false): Session {
  const db = getDb();
  const sessionToken = generateToken(32);
  const now = new Date();
  // 30 days if remember me, 24 hours otherwise
  const durationMs = rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
  const expiresAt = new Date(now.getTime() + durationMs).toISOString();

  const session: Session = {
    id: `sess_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
    sessionToken,
    userId,
    expiresAt,
    createdAt: now.toISOString(),
  };

  db.sessions.push(session);
  saveDb(db);
  return session;
}

export function getSession(sessionToken: string): { session: Session; user: User } | null {
  if (!sessionToken) return null;
  const db = getDb();
  const session = db.sessions.find((s) => s.sessionToken === sessionToken);
  if (!session) return null;

  // Verify expiration
  if (new Date(session.expiresAt).getTime() < Date.now()) {
    deleteSession(sessionToken);
    return null;
  }

  const user = db.users.find((u) => u.id === session.userId);
  if (!user) {
    deleteSession(sessionToken);
    return null;
  }

  return { session, user };
}

export function deleteSession(sessionToken: string): void {
  const db = getDb();
  db.sessions = db.sessions.filter((s) => s.sessionToken !== sessionToken);
  saveDb(db);
}

export function deleteAllUserSessions(userId: string): void {
  const db = getDb();
  db.sessions = db.sessions.filter((s) => s.userId !== userId);
  saveDb(db);
}

// Password Reset Flow
export function createPasswordResetToken(email: string): string {
  const db = getDb();
  const rawToken = generateToken(32);
  const tokenHash = hashToken(rawToken);
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15 mins

  // Invalidate any existing unused reset tokens for this email
  db.resetTokens = db.resetTokens.map((t) =>
    t.email.toLowerCase() === email.toLowerCase() ? { ...t, used: true } : t
  );

  db.resetTokens.push({
    id: `reset_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
    tokenHash,
    email: email.toLowerCase(),
    expiresAt,
    used: false,
    createdAt: new Date().toISOString(),
  });

  saveDb(db);
  return rawToken;
}

export function verifyAndConsumeResetToken(rawToken: string, newPassword: string): { success: boolean; message: string } {
  const db = getDb();
  const tokenHash = hashToken(rawToken);
  const record = db.resetTokens.find((t) => t.tokenHash === tokenHash);

  if (!record) {
    return { success: false, message: 'Invalid or expired password reset link.' };
  }

  if (record.used) {
    return { success: false, message: 'This password reset link has already been used.' };
  }

  if (new Date(record.expiresAt).getTime() < Date.now()) {
    return { success: false, message: 'This password reset link has expired. Please request a new one.' };
  }

  const user = findUserByEmail(record.email);
  if (!user) {
    return { success: false, message: 'User account not found.' };
  }

  // Update password
  user.passwordHash = hashPassword(newPassword);
  user.updatedAt = new Date().toISOString();

  // Invalidate this token
  record.used = true;

  // Invalidate all active sessions for this user for security
  db.sessions = db.sessions.filter((s) => s.userId !== user.id);

  saveDb(db);
  return { success: true, message: 'Your password has been reset successfully.' };
}

// Seed default Admin on initial setup
export function seedInitialAdmin(): void {
  const db = getDb();
  const adminEmail = process.env.ADMIN_EMAIL || 'amitkumar678793@gmail.com';
  const existing = db.users.find((u) => u.email.toLowerCase() === adminEmail.toLowerCase() || u.role === 'ADMIN');

  if (!existing) {
    const defaultPassword = process.env.ADMIN_INITIAL_PASSWORD || 'Admin@Amit2026!';
    const adminUser: User = {
      id: `usr_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
      name: 'Amit Kumar',
      email: adminEmail,
      passwordHash: hashPassword(defaultPassword),
      role: 'ADMIN',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    db.users.push(adminUser);
    saveDb(db);
    console.log(`[AUTH] Initial admin seeded successfully: ${adminEmail} (Role: ADMIN)`);
  }
}
