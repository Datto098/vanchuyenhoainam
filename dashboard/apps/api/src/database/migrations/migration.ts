import type { Connection } from 'mongoose';

export type MigrationDatabase = NonNullable<Connection['db']>;

export interface DatabaseMigration {
  id: string;
  description: string;
  up(db: MigrationDatabase): Promise<void>;
}
