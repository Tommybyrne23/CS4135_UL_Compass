import express from "express";
import { randomBytes, scryptSync, timingSafeEqual } from "crypto";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function loadDotEnv() {
  const envPath = join(__dirname, "..", ".env");
  if (!existsSync(envPath)) return;

  const contents = readFileSync(envPath, "utf-8");
  contents.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;

    const idx = trimmed.indexOf("=");
    if (idx === -1) return;

    const key = trimmed.slice(0, idx).trim();
    let value = trimmed.slice(idx + 1).trim();
    if (
      (value.startsWith("\"") && value.endsWith("\"")) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  });
}

loadDotEnv();

const DB_PATH = join(__dirname, "db.json");
const DB_SEED_PATH = join(__dirname, "db.seed.json");
const CAMPUS_DATA_PATH = join(__dirname, "campusData.json");
const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;

// ── Database helpers ──────────────────────────────────────────────
function readDB() {
  if (!existsSync(DB_PATH)) {
    // Initialize from seed file
    const seed = JSON.parse(readFileSync(DB_SEED_PATH, "utf-8"));
    writeFileSync(DB_PATH, JSON.stringify(seed, null, 2));
    console.log("📦 Database initialized from seed");
    return seed;
  }
  return JSON.parse(readFileSync(DB_PATH, "utf-8"));
}

function writeDB(data) {
  writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

async function verifyCaptcha(captchaToken) {
  if (!captchaToken) return false;
  if (!RECAPTCHA_SECRET_KEY) {
    console.warn(
      "RECAPTCHA_SECRET_KEY is not set. Skipping CAPTCHA verification in development."
    );
    return process.env.NODE_ENV !== "production";
  }

  const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      secret: RECAPTCHA_SECRET_KEY,
      response: captchaToken,
    }),
  });

  const data = await response.json();
  return data.success === true;
}

// ── Campus data (loaded once at startup) ──────────────────────────
let campusData = { buildings: [], rooms: [], services: [] };

function loadCampusData() {
  if (!existsSync(CAMPUS_DATA_PATH)) {
    console.warn(
      `\n⚠️  ${CAMPUS_DATA_PATH} not found!\n` +
      `   Run the extraction script first:\n` +
      `   npx --yes tsx server/extractData.ts\n`
    );
    return;
  }
  campusData = JSON.parse(readFileSync(CAMPUS_DATA_PATH, "utf-8"));
  console.log(
    `📍 Campus data loaded: ${campusData.buildings.length} buildings, ` +
    `${campusData.rooms.length} rooms, ${campusData.services.length} services`
  );
}

// ── Password helpers ─────────────────────────────────────────────
function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password, stored) {
  const [salt, hash] = stored.split(":");
  const testHash = scryptSync(password, salt, 64);
  return timingSafeEqual(Buffer.from(hash, "hex"), testHash);
}

function generateToken() {
  return randomBytes(32).toString("hex");
}

// ── Express app ──────────────────────────────────────────────────
const app = express();
app.use(express.json());

// Auth middleware
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }
  const token = authHeader.split(" ")[1];
  const db = readDB();
  const session = db.sessions.find((s) => s.token === token);
  if (!session) return res.status(401).json({ error: "Invalid or expired token" });
  const user = db.users.find((u) => u.id === session.userId);
  if (!user) return res.status(401).json({ error: "User not found" });
  req.user = user;
  req.token = token;
  next();
}

// ══════════════════════════════════════════════════════════════════
// AUTH ROUTES
// ══════════════════════════════════════════════════════════════════

app.get("/api/auth/me", authenticate, (req, res) => {
  res.json({ user: { id: req.user.id, email: req.user.email, name: req.user.name } });
});

app.post("/api/auth/register", async (req, res) => {
  const { email, password, name, captchaToken } = req.body;

  if (!email || !password || !name || !captchaToken) {
    return res.status(400).json({
      error: "Email, password, name, and captchaToken are required",
    });
  }

  const captchaValid = await verifyCaptcha(captchaToken);
  if (!captchaValid) {
    return res.status(400).json({ error: "CAPTCHA verification failed" });
  }

  const db = readDB();
  if (db.users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
    return res.status(409).json({ error: "An account with this email already exists" });
  }

  const user = {
    id: randomBytes(8).toString("hex"),
    email: email.toLowerCase(),
    name,
    passwordHash: hashPassword(password),
    favorites: [],
    createdAt: new Date().toISOString(),
  };

  const token = generateToken();
  db.users.push(user);
  db.sessions.push({ token, userId: user.id, createdAt: new Date().toISOString() });
  writeDB(db);

  console.log(`[AUTH] User registered with verified CAPTCHA: ${user.email}`);
  res.status(201).json({ token, user: { id: user.id, email: user.email, name: user.name } });
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password, captchaToken } = req.body;

  if (!email || !password || !captchaToken) {
    return res.status(400).json({
      error: "Email, password, and captchaToken are required",
    });
  }

  const captchaValid = await verifyCaptcha(captchaToken);
  if (!captchaValid) {
    return res.status(400).json({ error: "CAPTCHA verification failed" });
  }

  const db = readDB();
  const user = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());

  if (!user || !verifyPassword(password, user.passwordHash)) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const token = generateToken();
  db.sessions.push({ token, userId: user.id, createdAt: new Date().toISOString() });
  writeDB(db);

  console.log(`[AUTH] User logged in with verified CAPTCHA: ${user.email}`);
  res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
});

// ══════════════════════════════════════════════════════════════════
// FAVORITES ROUTES
// ══════════════════════════════════════════════════════════════════

app.get("/api/favorites", authenticate, (req, res) => {
  res.json({ favorites: req.user.favorites || [] });
});

app.post("/api/favorites", authenticate, (req, res) => {
  const { itemId, type } = req.body;
  if (!itemId || !type) {
    return res.status(400).json({ error: "itemId and type are required" });
  }
  const validTypes = ["room", "building", "service"];
  if (!validTypes.includes(type)) {
    return res.status(400).json({ error: "Invalid type. Must be room, building, or service" });
  }
  
  const db = readDB();
  const user = db.users.find((u) => u.id === req.user.id);
  if (!user.favorites) user.favorites = [];
  
  const favoriteId = `${type}:${itemId}`;
  if (user.favorites.includes(favoriteId)) {
    return res.status(409).json({ error: `${type} is already in favorites` });
  }
  user.favorites.push(favoriteId);
  writeDB(db);
  console.log(`[FAVORITES] ${user.email} added ${type} ${itemId}`);
  res.status(201).json({ favorites: user.favorites });
});

app.delete("/api/favorites/:favoriteId", authenticate, (req, res) => {
  const { favoriteId } = req.params;
  const db = readDB();
  const user = db.users.find((u) => u.id === req.user.id);
  if (!user.favorites) user.favorites = [];
  user.favorites = user.favorites.filter((id) => id !== favoriteId);
  writeDB(db);
  console.log(`[FAVORITES] ${user.email} removed ${favoriteId}`);
  res.json({ favorites: user.favorites });
});

// ══════════════════════════════════════════════════════════════════
// CAMPUS DATA ROUTES
// ══════════════════════════════════════════════════════════════════

// GET /api/campus/buildings
app.get("/api/campus/buildings", (req, res) => {
  console.log(`[CAMPUS] GET buildings (${campusData.buildings.length} results)`);
  res.json({ buildings: campusData.buildings });
});

// GET /api/campus/rooms (optional ?building= filter)
app.get("/api/campus/rooms", (req, res) => {
  let rooms = campusData.rooms;
  const { building } = req.query;
  if (building) {
    rooms = rooms.filter((r) => r.building.toLowerCase() === building.toLowerCase());
  }
  console.log(`[CAMPUS] GET rooms (${rooms.length} results)`);
  res.json({ rooms });
});

// GET /api/campus/rooms/:roomId
app.get("/api/campus/rooms/:roomId", (req, res) => {
  const room = campusData.rooms.find((r) => r.id === req.params.roomId);
  if (!room) return res.status(404).json({ error: "Room not found" });
  console.log(`[CAMPUS] GET room ${req.params.roomId}`);
  res.json({ room });
});

// GET /api/campus/services
app.get("/api/campus/services", (req, res) => {
  console.log(`[CAMPUS] GET services (${campusData.services.length} results)`);
  res.json({ services: campusData.services });
});

// GET /api/campus/search?q=
app.get("/api/campus/search", (req, res) => {
  const query = (req.query.q || "").toLowerCase().trim();
  if (!query) return res.json({ rooms: [], buildings: [], services: [] });

  const rooms = campusData.rooms.filter(
    (r) =>
      r.name.toLowerCase().includes(query) ||
      r.id.toLowerCase().includes(query) ||
      r.building.toLowerCase().includes(query) ||
      r.buildingFullName.toLowerCase().includes(query) ||
      r.type.toLowerCase().includes(query)
  );

  const buildings = campusData.buildings.filter(
    (b) =>
      b.name.toLowerCase().includes(query) ||
      b.fullName.toLowerCase().includes(query) ||
      b.id.toLowerCase().includes(query) ||
      b.type.toLowerCase().includes(query) ||
      b.description.toLowerCase().includes(query)
  );

  const services = campusData.services.filter(
    (s) =>
      s.name.toLowerCase().includes(query) ||
      s.type.toLowerCase().includes(query)
  );

  console.log(
    `[CAMPUS] Search "${query}" → ${rooms.length} rooms, ` +
    `${buildings.length} buildings, ${services.length} services`
  );
  res.json({ rooms, buildings, services });
});

// ── Start server ─────────────────────────────────────────────────
const PORT = 3001;
loadCampusData();

app.listen(PORT, () => {
  console.log(`\n🟢  UL Compass API server running on http://localhost:${PORT}\n`);
});
