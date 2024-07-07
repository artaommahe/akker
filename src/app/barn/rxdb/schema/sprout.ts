import { type RxJsonSchema } from 'rxdb';

export interface DbSprout {
  id: string;
  name: string;
  addedAt: string;
}

export const sproutSchemaLiteral: RxJsonSchema<DbSprout> = {
  title: 'sprout schema',
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
    addedAt: {
      type: 'string',
      maxLength: 30,
    },
  },
  required: ['id', 'name', 'addedAt'],
  indexes: ['name'],
};
