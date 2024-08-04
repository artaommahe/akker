import { type MigrationStrategies, type RxCollectionCreator, type RxJsonSchema } from 'rxdb';

export interface DbSeed {
  id: string;
  name: string;
  count: number;
  addedAt: string;
  lastAddedAt: string;
}

const seedsSchemaLiteral: RxJsonSchema<DbSeed> = {
  title: 'seeds schema',
  version: 2,
  type: 'object',
  keyCompression: true,
  primaryKey: 'id',
  properties: {
    id: {
      type: 'string',
      maxLength: 10,
    },
    name: {
      type: 'string',
    },
    count: {
      type: 'number',
    },
    addedAt: {
      type: 'string',
      format: 'date-time',
    },
    lastAddedAt: {
      type: 'string',
      format: 'date-time',
    },
  },
  required: ['id', 'name', 'count', 'addedAt', 'lastAddedAt'],
  indexes: ['name'],
};

const seedsSchemaMigrationStrategies: MigrationStrategies = {
  1: oldDoc => oldDoc,
  2: oldDoc => oldDoc,
};

export const seedsCollection: RxCollectionCreator<DbSeed> = {
  schema: seedsSchemaLiteral,
  migrationStrategies: seedsSchemaMigrationStrategies,
};
