import { Injectable, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { nanoid } from 'nanoid';
import { firstValueFrom } from 'rxjs';

import type { DbSeed } from '../barn/rxdb/schema/seeds';
import { SeedsApiService } from '../barn/seeds-api.service';
import { CardsService } from '../cards/cards.service';

@Injectable({ providedIn: 'root' })
export class SeedsService {
  private seedsApiService = inject(SeedsApiService);
  private cardsService = inject(CardsService);

  getSeeds({ limit }: { limit?: number } = {}) {
    return rxResource({ stream: () => this.seedsApiService.getSeeds({ limit }) });
  }

  getSeedsCount() {
    return rxResource({ stream: () => this.seedsApiService.getSeedsCount() });
  }

  async addSeeds(names: string[]) {
    const { seedsToAdd, seedsToUpdate, newCards } = await this.prepareNewSeeds(names);

    // add new or update existing seeds
    if (seedsToAdd.length || seedsToUpdate.length) {
      await this.seedsApiService.addSeeds([...seedsToAdd, ...seedsToUpdate]);
    }

    // add new cards
    if (newCards.length) {
      await this.cardsService.addCards(newCards.map(term => ({ term })));
      await this.removeSeeds(newCards);
    }
  }

  async updateSeed(name: string, newData: Partial<DbSeed>) {
    await this.seedsApiService.updateSeed(name, newData);
  }

  async removeSeeds(names: string[]) {
    await this.seedsApiService.removeSeeds(names);
  }

  // TODO: add tests
  private async prepareNewSeeds(names: string[]) {
    const newSeedsCount = names.reduce(
      (result, name) => ({ ...result, [name]: result[name] ? result[name] + 1 : 1 }),
      {} as Record<string, number>,
    );

    const existingSeeds = await firstValueFrom(this.seedsApiService.getSeeds({ names: Object.keys(newSeedsCount) }));

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
            seedsToUpdate: [...result.seedsToUpdate, { ...existingSeed, count, lastAddedAt: addedAt }],
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
