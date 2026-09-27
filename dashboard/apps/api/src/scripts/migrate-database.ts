import 'dotenv/config';
import mongoose from 'mongoose';
import { Collections } from '../common/database/collections';
import { migrations } from '../database/migrations';

interface AppliedMigration {
  id: string;
  description: string;
  appliedAt: Date;
}

async function main(): Promise<void> {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI is required');

  await mongoose.connect(uri, { autoIndex: false });
  const db = mongoose.connection.db;
  if (!db) throw new Error('MongoDB connection is not ready');

  const migrationCollection = db.collection<AppliedMigration>(Collections.SCHEMA_MIGRATIONS);
  await migrationCollection.createIndex({ id: 1 }, { unique: true });
  const applied = new Set(
    (await migrationCollection.find({}, { projection: { id: 1 } }).toArray()).map(
      (item) => item.id,
    ),
  );

  for (const migration of migrations) {
    if (applied.has(migration.id)) continue;
    process.stdout.write(`Applying ${migration.id}: ${migration.description}\n`);
    await migration.up(db);
    await migrationCollection.insertOne({
      id: migration.id,
      description: migration.description,
      appliedAt: new Date(),
    });
  }

  process.stdout.write('Database migrations are up to date.\n');
}

void main()
  .catch((error: unknown) => {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(`Database migration failed: ${message}\n`);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
