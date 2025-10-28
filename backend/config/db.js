import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from project root (two levels up from config)
dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

/**
 * Build a MongoDB connection URI from environment variables.
 * Priority:
 * 1. MONGODB_URI (full connection string)
 * 2. MONGO_URI (legacy)
 * 3. Build from MONGODB_USER, MONGODB_PASSWORD, MONGODB_HOST
 * 4. Fallback to localhost
 */
function buildMongoUri() {
  const {
    MONGODB_URI,
    MONGO_URI,
    MONGODB_USER,
    MONGODB_PASSWORD,
    MONGODB_HOST,
    MONGODB_DB,
    MONGODB_OPTIONS
  } = process.env;

  if (MONGODB_URI) return MONGODB_URI;
  if (MONGO_URI) return MONGO_URI;

  if (MONGODB_HOST) {
    // Prefer mongodb+srv for Atlas hosts when host looks like a mongodb.net hostname
    const isSrv = MONGODB_HOST.includes('mongodb.net') || MONGODB_HOST.includes('+srv');
    const user = MONGODB_USER ? encodeURIComponent(MONGODB_USER) : '';
    const pass = MONGODB_PASSWORD ? encodeURIComponent(MONGODB_PASSWORD) : '';
    const auth = user && pass ? `${user}:${pass}@` : '';
    const dbName = MONGODB_DB || 'mvmpDB';
    const opts = MONGODB_OPTIONS ? `?${MONGODB_OPTIONS}` : '?retryWrites=true&w=majority';

    if (isSrv) {
      return `mongodb+srv://${auth}${MONGODB_HOST}/${dbName}${opts}`;
    }

    return `mongodb://${auth}${MONGODB_HOST}/${dbName}${opts}`;
  }

  // Fallback to local
  return 'mongodb://127.0.0.1:27017/mvmpDB';
}

const connectDB = () => {
  const uri = buildMongoUri();

  mongoose.connect(uri)
    .then(() => {
      const using = uri.includes('mongodb+srv') || uri.includes('mongodb.net') ? 'MongoDB Atlas' : 'MongoDB (local)';
      console.log(`✅ ${using} connected`);
    })
    .catch((err) => console.error('❌ MongoDB connection error:', err));
};

export default connectDB;
