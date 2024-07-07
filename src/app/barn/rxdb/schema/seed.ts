import { type RxJsonSchema } from 'rxdb';

export interface DbSeed {
  id: string;
  name: string;
  count: number;
  addedAt: string;
  lastAddedAt: string;
}

export const seedSchemaLiteral: RxJsonSchema<DbSeed> = {
  title: 'seed schema',
  version: 0,
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
      maxLength: 30,
    },
    lastAddedAt: {
      type: 'string',
      maxLength: 30,
    },
  },
  required: ['id', 'name', 'count', 'addedAt', 'lastAddedAt'],
  indexes: ['name'],
};
