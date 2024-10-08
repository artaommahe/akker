import { type MigrationStrategies, type RxCollectionCreator, type RxJsonSchema } from 'rxdb';
import { type Card } from 'ts-fsrs';

export interface DbSprout {
  id: string;
  term: string;
  fullTerm?: string;
  definition: string;
  addedAt: string;
  fsrs?: {
    card: Omit<Card, 'due' | 'last_review'> & {
      due: string;
      last_review?: string;
    };
  };
}

const sproutsSchemaLiteral: RxJsonSchema<DbSprout> = {
  title: 'sprouts schema',
  version: 2,
  type: 'object',
  keyCompression: true,
  primaryKey: 'id',
  properties: {
    id: {
      type: 'string',
      maxLength: 10,
    },
    term: {
      type: 'string',
    },
    fullTerm: {
      type: 'string',
    },
    definition: {
      type: 'string',
    },
    addedAt: {
      type: 'string',
      format: 'date-time',
    },
    fsrs: {
      type: 'object',
      properties: {
        card: {
          type: 'object',
          properties: {
            due: { type: 'string', format: 'date-time' },
            stability: { type: 'number' },
            difficulty: { type: 'number' },
            elapsed_days: { type: 'number' },
            scheduled_days: { type: 'number' },
            reps: { type: 'number' },
            lapses: { type: 'number' },
            state: { type: 'number', enum: [0, 1, 2, 3] },
            last_review: { type: 'string', format: 'date-time' },
          },
          required: ['due', 'stability', 'difficulty', 'elapsed_days', 'scheduled_days', 'reps', 'lapses', 'state'],
        },
      },
    },
  },
  required: ['id', 'term', 'addedAt'],
  indexes: ['term'],
};

const sproutsSchemaMigrationStrategies: MigrationStrategies = {
  1: oldDoc => oldDoc,
  2: (oldDoc: DbSproutV1) => ({
    id: oldDoc.id,
    term: oldDoc.name,
    fullTerm: '',
    definition: '',
    addedAt: oldDoc.addedAt,
    fsrs: oldDoc.fsrs,
  }),
};

export const sproutsCollection: RxCollectionCreator<DbSprout> = {
  schema: sproutsSchemaLiteral,
  migrationStrategies: sproutsSchemaMigrationStrategies,
};

interface DbSproutV1 {
  id: string;
  name: string;
  addedAt: string;
  fsrs?: {
    card: Omit<Card, 'due' | 'last_review'> & {
      due: string;
      last_review?: string;
    };
  };
}
