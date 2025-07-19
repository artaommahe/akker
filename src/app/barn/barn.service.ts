import { Injectable, inject } from '@angular/core';
import { nanoid } from 'nanoid';

import { CardsService } from '../cards/cards.service';
import { SeedsService } from '../seeds/seeds.service';
import { BarnDbService } from './barn-db.service';
import type { DbSeed } from './rxdb/schema/seeds';

@Injectable({ providedIn: 'root' })
export class BarnService {
  private barnDbService = inject(BarnDbService);
  private cardsService = inject(CardsService);
  private seedsService = inject(SeedsService);

  async addSeeds(names: string[]) {
    const db = await this.barnDbService.getDb();

    const { seedsToAdd, seedsToUpdate, newCards } = await this.prepareNewSeeds(names);

    // add new or update existing seeds
    if (seedsToAdd.length || seedsToUpdate.length) {
      await db.seeds.bulkUpsert([...seedsToAdd, ...seedsToUpdate]);
    }

    // add new cards
    if (newCards.length) {
      await this.cardsService.addCards(newCards.map(term => ({ term })));
      await this.seedsService.removeSeeds(newCards);
    }
  }

  async updateSeed(name: string, newData: Partial<DbSeed>) {
    const db = await this.barnDbService.getDb();

    await db.seeds.findOne({ selector: { name } }).modify(seed => ({ ...seed, ...newData }));
  }

  // TODO: add tests
  private async prepareNewSeeds(names: string[]) {
    const db = await this.barnDbService.getDb();

    const newSeedsCount = names.reduce(
      (result, name) => ({ ...result, [name]: result[name] ? result[name] + 1 : 1 }),
      {} as Record<string, number>,
    );

    const existingSeeds = await db.seeds.find({ selector: { name: { $in: Object.keys(newSeedsCount) } } }).exec();

    const { seedsToAdd, seedsToUpdate, newCards } = Object.entries(newSeedsCount).reduce(
      (result, [name, newSeedCount], index) => {
        const existingSeed = existingSeeds.find(seed => seed.name === name);
        const count = newSeedCount + (existingSeed ? existingSeed.count : 0);

        // add a unique timestamp to each seed to avoid sorting conflicts later
        const addedAt = new Date(Date.now() + index).toISOString();

        // covers both cases: update existing seed or add new seed multiple times
        if (count >= seedToCardThreshold) {
          return { ...result, newCards: [...result.newCards, name] };
        } else if (existingSeed) {
          return {
            ...result,
            seedsToUpdate: [...result.seedsToUpdate, { ...existingSeed.toJSON(), count, lastAddedAt: addedAt }],
          };
        }

        return {
          ...result,
          seedsToAdd: [
            ...result.seedsToAdd,
            {
              id: nanoid(),
              name,
              count,
              addedAt,
              lastAddedAt: addedAt,
            },
          ],
        };
      },
      { seedsToAdd: [] as DbSeed[], seedsToUpdate: [] as DbSeed[], newCards: [] as string[] },
    );
    return { seedsToAdd, seedsToUpdate, newCards };
  }
}

const seedToCardThreshold = 5;
