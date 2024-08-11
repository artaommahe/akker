import { inject, Injectable, Injector } from '@angular/core';
import { BarnDbService } from './barnDb.service';
import { toSignal } from '@angular/core/rxjs-interop';
import type { Observable } from 'rxjs';
import { nanoid } from 'nanoid';
import type { DbSeed } from './rxdb/schema/seeds';
import type { DbSprout } from './rxdb/schema/sprouts';

@Injectable({ providedIn: 'root' })
export class BarnService {
  private barnDb = inject(BarnDbService);
  private injector = inject(Injector);

  seeds = this.convertToSignal(this.barnDb.seeds.find().$);
  sprouts = this.convertToSignal(this.barnDb.sprouts.find().$);

  async addSeeds(names: string[]) {
    const { seedsToAdd, seedsToUpdate, newSprouts } = await this.prepareNewSeeds(names);

    // add new or update existing seeds
    if (seedsToAdd.length || seedsToUpdate.length) {
      await this.barnDb.seeds.bulkUpsert([...seedsToAdd, ...seedsToUpdate]);
    }

    // add new sprouts
    if (newSprouts.length) {
      for (const name of newSprouts) {
        await this.addSprout(name);
        await this.removeSeed(name);
      }
    }
  }

  async removeSeed(name: string) {
    await this.barnDb.seeds.findOne({ selector: { name } }).remove();
  }

  async updateSeed(name: string, newData: Partial<DbSeed>) {
    await this.barnDb.seeds.findOne({ selector: { name } }).modify(seed => ({ ...seed, ...newData }));
  }

  async addSprout(term: string) {
    await this.barnDb.sprouts.insert({
      id: nanoid(),
      term,
      definition: '',
      addedAt: new Date().toISOString(),
    });
  }

  async removeSprout(id: string) {
    await this.barnDb.sprouts.findOne({ selector: { id } }).remove();
  }

  async updateSprout(id: string, newData: Partial<DbSprout>) {
    await this.barnDb.sprouts.findOne({ selector: { id } }).modify(sprout => ({ ...sprout, ...newData }));
  }

  // https://github.com/pubkey/rxdb/issues/6188
  private convertToSignal<T>(observable$: Observable<T>) {
    return toSignal(observable$, {
      initialValue: undefined,
      injector: this.injector,
      rejectErrors: true,
    });
  }

  // TODO: add tests
  private async prepareNewSeeds(names: string[]) {
    const existingSprouts = await this.barnDb.sprouts.find({ selector: { term: { $in: names } } }).exec();

    const newSeeds = names.reduce(
      (result, name) =>
        // if the seed is already sprouted, skip it
        existingSprouts.find(sprout => sprout.term === name)
          ? result
          : { ...result, [name]: result[name] ? result[name] + 1 : 1 },
      {} as Record<string, number>,
    );

    const existingSeeds = await this.barnDb.seeds.find({ selector: { name: { $in: Object.keys(newSeeds) } } }).exec();

    const { seedsToUpdate, newSprouts } = existingSeeds.reduce(
      (result, seed) => {
        if (!newSeeds[seed.name]) {
          return result;
        }

        const count = seed.count + newSeeds[seed.name];

        if (count >= seedPlantingTreshold) {
          return { ...result, newSprouts: [...result.newSprouts, seed.name] };
        }

        return {
          ...result,
          seedsToUpdate: [...result.seedsToUpdate, { ...seed.toJSON(), count, lastAddedAt: new Date().toISOString() }],
        };
      },
      { seedsToUpdate: [] as DbSeed[], newSprouts: [] as string[] },
    );

    // TODO: when count is more than seedPlantingTreshold
    // shoult be added to newSprouts
    const seedsToAdd = Object.keys(newSeeds)
      .filter(name => !existingSeeds.some(seed => seed.name === name))
      .map(name => ({
        id: nanoid(),
        name,
        count: newSeeds[name],
        addedAt: new Date().toISOString(),
        lastAddedAt: new Date().toISOString(),
      }));

    return { seedsToAdd, seedsToUpdate, newSprouts };
  }
}

const seedPlantingTreshold = 5;
