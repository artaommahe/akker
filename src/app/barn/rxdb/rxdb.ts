import { type RxCollection, type RxReactivityFactory, addRxPlugin, createRxDatabase } from 'rxdb';
import { RxDBJsonDumpPlugin } from 'rxdb/plugins/json-dump';
import { wrappedKeyCompressionStorage } from 'rxdb/plugins/key-compression';
import { RxDBMigrationSchemaPlugin } from 'rxdb/plugins/migration-schema';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';

import { type DbSeed, seedsCollection } from './schema/seeds';
import { type DbSprout, sproutsCollection } from './schema/sprouts';

addRxPlugin(RxDBJsonDumpPlugin);
addRxPlugin(RxDBMigrationSchemaPlugin);

export interface BarnDbCollections<Reactivity> {
  seeds: RxCollection<DbSeed, unknown, unknown, unknown, Reactivity>;
  sprouts: RxCollection<DbSprout, unknown, unknown, unknown, Reactivity>;
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
    sprouts: sproutsCollection,
  });

  return barnDb;
};
