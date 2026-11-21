import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import * as admin from 'firebase-admin';
import { DatabaseSchema } from './types';
import { INITIAL_PRODUCTS, INITIAL_SERVICES, INITIAL_USERS } from './seedData';

const DATA_DIR = path.join(__dirname, '..', 'data');
const DB_FILE = path.join(DATA_DIR, 'sinyora-db.json');

let firestoreDb: admin.firestore.Firestore | null = null;
let mongoModel: mongoose.Model<{ key: string; state: DatabaseSchema }> | null =
  null;
let activeMode: 'firestore' | 'mongodb' | 'file' = 'file';

function getDefaultState(): DatabaseSchema {
  return {
    services: INITIAL_SERVICES,
    products: INITIAL_PRODUCTS,
    bookings: [],
    orders: [],
    users: INITIAL_USERS,
    colorTheme: 'signature-magenta',
    pushSubscriptions: [],
  };
}

function readLocalFileState(): DatabaseSchema {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
      const initial = getDefaultState();
      fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf-8');
      return initial;
    }
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(raw) as Partial<DatabaseSchema>;
    return {
      services:
        Array.isArray(parsed.services) && parsed.services.length > 0
          ? parsed.services
          : INITIAL_SERVICES,
      products: Array.isArray(parsed.products)
        ? parsed.products
        : INITIAL_PRODUCTS,
      bookings: Array.isArray(parsed.bookings) ? parsed.bookings : [],
      orders: Array.isArray(parsed.orders) ? parsed.orders : [],
      users:
        Array.isArray(parsed.users) && parsed.users.length > 0
          ? parsed.users
          : INITIAL_USERS,
      colorTheme: parsed.colorTheme || 'signature-magenta',
      pushSubscriptions: Array.isArray(parsed.pushSubscriptions)
        ? parsed.pushSubscriptions
        : [],
    };
  } catch {
    return getDefaultState();
  }
}

function writeLocalFileState(state: DatabaseSchema): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(DB_FILE, JSON.stringify(state, null, 2), 'utf-8');
}

export async function initDatabase(): Promise<string> {
  // 1. Check Firebase Firestore configuration
  const firebaseProjectId = process.env.FIREBASE_PROJECT_ID;
  if (firebaseProjectId) {
    try {
      if (!admin.apps.length) {
        admin.initializeApp({
          projectId: firebaseProjectId,
        });
      }
      firestoreDb = admin.firestore();
      activeMode = 'firestore';
      console.log(
        `✅ Connected to Firebase Cloud Firestore (Project: ${firebaseProjectId})`
      );
      return `Firebase Cloud Firestore (${firebaseProjectId})`;
    } catch (err) {
      console.warn(
        '⚠️ Firebase Firestore initialization warning, falling back:',
        err
      );
    }
  }

  // 2. Check MongoDB Atlas configuration
  const mongoUri = process.env.MONGODB_URI;
  if (mongoUri && !mongoUri.includes('<db_username>')) {
    try {
      await mongoose.connect(mongoUri);
      const schema = new mongoose.Schema(
        {
          key: { type: String, required: true, unique: true },
          state: { type: mongoose.Schema.Types.Mixed, required: true },
        },
        { timestamps: true }
      );
      mongoModel =
        mongoose.models.SinyoraState ||
        mongoose.model<{ key: string; state: DatabaseSchema }>(
          'SinyoraState',
          schema
        );
      activeMode = 'mongodb';
      console.log('✅ Connected to MongoDB Atlas');
      return 'MongoDB Atlas';
    } catch (err) {
      console.warn('⚠️ MongoDB connection failed, falling back to file DB:', err);
    }
  }

  // 3. Persistent File Database (always available)
  readLocalFileState();
  activeMode = 'file';
  console.log(`✅ Connected to Persistent Database (${DB_FILE})`);
  return 'Persistent Local JSON Store';
}

export function getActiveDbMode(): string {
  return activeMode;
}

export async function loadState(): Promise<DatabaseSchema> {
  const fallback = readLocalFileState();

  if (activeMode === 'firestore' && firestoreDb) {
    try {
      const doc = await firestoreDb
        .collection('sinyora_gee')
        .doc('studio_state')
        .get();
      if (!doc.exists) {
        await firestoreDb
          .collection('sinyora_gee')
          .doc('studio_state')
          .set(fallback);
        return fallback;
      }
      const data = doc.data() as DatabaseSchema;
      writeLocalFileState(data);
      return data;
    } catch {
      return fallback;
    }
  }

  if (activeMode === 'mongodb' && mongoModel) {
    try {
      const doc = await mongoModel.findOne({ key: 'studio_state' }).lean();
      if (!doc) {
        await mongoModel.create({ key: 'studio_state', state: fallback });
        return fallback;
      }
      writeLocalFileState(doc.state);
      return doc.state;
    } catch {
      return fallback;
    }
  }

  return fallback;
}

export async function saveState(state: DatabaseSchema): Promise<void> {
  writeLocalFileState(state);

  if (activeMode === 'firestore' && firestoreDb) {
    try {
      await firestoreDb
        .collection('sinyora_gee')
        .doc('studio_state')
        .set(state);
    } catch (err) {
      console.error('Firestore write error:', err);
    }
  }

  if (activeMode === 'mongodb' && mongoModel) {
    try {
      await mongoModel.findOneAndUpdate(
        { key: 'studio_state' },
        { state },
        { upsert: true }
      );
    } catch (err) {
      console.error('MongoDB write error:', err);
    }
  }
}

