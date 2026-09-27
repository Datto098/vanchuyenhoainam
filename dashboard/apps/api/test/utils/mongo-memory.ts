import { MongoMemoryServer } from 'mongodb-memory-server';
import type { Connection } from 'mongoose';

let mongod: MongoMemoryServer | null = null;

export async function startMongoMemoryServer(): Promise<string> {
  if (!mongod) {
    mongod = await MongoMemoryServer.create();
  }
  return mongod.getUri();
}

export async function stopMongoMemoryServer(): Promise<void> {
  if (mongod) {
    await mongod.stop();
    mongod = null;
  }
}

export async function clearMongoCollections(connection: Connection): Promise<void> {
  const collections = connection.collections;
  const clearPromises = Object.values(collections).map((collection) => collection.deleteMany({}));
  await Promise.all(clearPromises);
}
