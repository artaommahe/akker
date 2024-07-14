import { addRxPlugin, createRxDatabase, type RxCollection, type RxReactivityFactory } from 'rxdb';
import { type DbSeed, seedSchemaLiteral } from './schema/seed';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import { wrappedKeyCompressionStorage } from 'rxdb/plugins/key-compression';
import { type DbSprout, sproutSchemaLiteral } from './schema/sprout';
import { RxDBJsonDumpPlugin } from 'rxdb/plugins/json-dump';

addRxPlugin(RxDBJsonDumpPlugin);

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
    seeds: {
      schema: seedSchemaLiteral,
    },
    sprouts: {
      schema: sproutSchemaLiteral,
    },
  });

  return barnDb;
};
