import { inject, Injectable, Injector } from '@angular/core';
import { BarnDbService } from './barnDb.service';
import { toSignal } from '@angular/core/rxjs-interop';
import type { Observable } from 'rxjs';
import { nanoid } from 'nanoid';
import type { DbSeed } from './rxdb/schema/seed';
import type { DbSprout } from './rxdb/schema/sprout';

@Injectable({ providedIn: 'root' })
export class BarnV2Service {
  private barnDb = inject(BarnDbService);
  private injector = inject(Injector);

  seeds = this.convertToSignal(this.barnDb.seeds.find().$);
  sprouts = this.convertToSignal(this.barnDb.sprouts.find().$);

  async addSeed(name: string) {
    const sprout = await this.barnDb.sprouts.findOne({ selector: { name } }).exec();

    // if the seed is already sprouted, don't add it to the seeds
    if (sprout) {
      return;
    }

    const seed = await this.barnDb.seeds.findOne({ selector: { name } }).exec();

    // if the count of this seed is greater than or equal to the treshold, convert it to a sprout
    if (seed?.count && seed.count >= seedPlantingTreshold - 1) {
      await this.addSprout(name);
      await this.removeSeed(name);

      return;
    }

    if (seed) {
      await seed.patch({ count: seed.count + 1, lastAddedAt: new Date().toISOString() });
    } else {
      await this.barnDb.seeds.insert({
        id: nanoid(),
        name,
        count: 1,
        addedAt: new Date().toISOString(),
        lastAddedAt: new Date().toISOString(),
      });
    }
  }

  async addMultipleSeeds(names: string[]) {
    for (const name of names) {
      await this.addSeed(name);
    }
  }

  async removeSeed(name: string) {
    await this.barnDb.seeds.findOne({ selector: { name } }).remove();
  }

  async updateSeed(name: string, newData: Partial<DbSeed>) {
    await this.barnDb.seeds.findOne({ selector: { name } }).modify(seed => ({ ...seed, ...newData }));
  }

  async addSprout(name: string) {
    await this.barnDb.sprouts.insert({
      id: nanoid(),
      name,
      addedAt: new Date().toISOString(),
    });
  }

  async removeSprout(name: string) {
    await this.barnDb.sprouts.findOne({ selector: { name } }).remove();
  }

  async updateSprout(name: string, newData: Partial<DbSprout>) {
    await this.barnDb.sprouts.findOne({ selector: { name } }).modify(sprout => ({ ...sprout, ...newData }));
  }

  // https://github.com/pubkey/rxdb/issues/6188
  private convertToSignal<T>(observable$: Observable<T>) {
    return toSignal(observable$, {
      initialValue: undefined,
      injector: this.injector,
      rejectErrors: true,
    });
  }
}

const seedPlantingTreshold = 5;
