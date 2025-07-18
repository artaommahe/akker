import { type RxCollection, addRxPlugin, createRxDatabase } from 'rxdb';
import { RxDBJsonDumpPlugin } from 'rxdb/plugins/json-dump';
import { wrappedKeyCompressionStorage } from 'rxdb/plugins/key-compression';
import { RxDBMigrationSchemaPlugin } from 'rxdb/plugins/migration-schema';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';

import { type DbCard, cardsCollection } from './schema/cards';
import { type DbSeed, seedsCollection } from './schema/seeds';

addRxPlugin(RxDBJsonDumpPlugin);
addRxPlugin(RxDBMigrationSchemaPlugin);

export interface BarnDbCollections {
  seeds: RxCollection<DbSeed>;
  // TODO: legacy, rename to `cards` with a proper migration
  sprouts: RxCollection<DbCard>;
}

export const createBarnDb = async () => {
  const storageWithKeyCompression = wrappedKeyCompressionStorage({
    storage: getRxStorageDexie(),
  });

  const barnDb = await createRxDatabase<BarnDbCollections>({
    name: 'barn',
    storage: storageWithKeyCompression,
    multiInstance: true,
    eventReduce: true,
  });

  await barnDb.addCollections({
    seeds: seedsCollection,
    // TODO: legacy, rename to `cards` with a proper migration
    sprouts: cardsCollection,
  });

  return barnDb;
};
