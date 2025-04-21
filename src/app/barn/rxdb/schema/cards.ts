import { type MigrationStrategies, type RxCollectionCreator, type RxJsonSchema } from 'rxdb';
import { type Card } from 'ts-fsrs';

export interface DbCard {
  id: string;
  term: string;
  fullTerm?: string;
  definition: string;
  addedAt: string;
  tags: string[];
  fsrs?: {
    card: Omit<Card, 'due' | 'last_review'> & {
      due: string;
      last_review?: string;
    };
  };
}

const cardsSchemaLiteral: RxJsonSchema<DbCard> = {
  title: 'sprouts schema',
  version: 3,
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
    tags: {
      type: 'array',
      items: {
        type: 'string',
      },
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

const cardsSchemaMigrationStrategies: MigrationStrategies = {
  1: oldDoc => oldDoc,
  2: (oldDoc: DbCardV1) => ({
    id: oldDoc.id,
    term: oldDoc.name,
    fullTerm: '',
    definition: '',
    addedAt: oldDoc.addedAt,
    fsrs: oldDoc.fsrs,
  }),
  3: (oldDoc: DbCardV2) => ({
    ...oldDoc,
    tags: [],
  }),
};

export const cardsCollection: RxCollectionCreator<DbCard> = {
  schema: cardsSchemaLiteral,
  migrationStrategies: cardsSchemaMigrationStrategies,
};

interface DbCardV1 {
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

interface DbCardV2 {
  id: string;
  term: string;
  fullTerm?: string;
  definition: string;
  addedAt: string;
  tags: string[];
  fsrs?: {
    card: Omit<Card, 'due' | 'last_review'> & {
      due: string;
      last_review?: string;
    };
  };
}
