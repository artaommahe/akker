import { type RxCollection, type RxReactivityFactory, addRxPlugin, createRxDatabase } from 'rxdb';
import { RxDBJsonDumpPlugin } from 'rxdb/plugins/json-dump';
import { wrappedKeyCompressionStorage } from 'rxdb/plugins/key-compression';
import { RxDBMigrationSchemaPlugin } from 'rxdb/plugins/migration-schema';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';

import { type DbCard, cardsCollection } from './schema/cards';
import { type DbSeed, seedsCollection } from './schema/seeds';

addRxPlugin(RxDBJsonDumpPlugin);
addRxPlugin(RxDBMigrationSchemaPlugin);

export interface BarnDbCollections<Reactivity> {
  seeds: RxCollection<DbSeed, unknown, unknown, unknown, Reactivity>;
  // TODO: legacy, rename to `cards` with a proper migration
  sprouts: RxCollection<DbCard, unknown, unknown, unknown, Reactivity>;
}

interface CreateBarnBdOptions<Reactivity> {
  reactivity: RxReactivityFactory<Reactivity>;
}

export const createBarnDb = async <Reactivity>({ reactivity }: CreateBarnBdOptions<Reactivity>) => {
  const storageWithKeyCompression = wrappedKeyCompressionStorage({
    storage: getRxStorageDexie(),
  });

  const barnDb = await createRxDatabase<BarnDbCollections<Reactivity>, unknown, unknown, Reactivity>({
    name: 'barn',
    storage: storageWithKeyCompression,
    multiInstance: true,
    eventReduce: true,
    reactivity,
  });

  await barnDb.addCollections({
    seeds: seedsCollection,
    // TODO: legacy, rename to `cards` with a proper migration
    sprouts: cardsCollection,
  });

  return barnDb;
};
