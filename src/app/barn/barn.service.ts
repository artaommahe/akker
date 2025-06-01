import { Injectable, Injector, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { nanoid } from 'nanoid';
import type { Observable } from 'rxjs';

import { BarnDbService } from './barnDb.service';
import type { DbCard } from './rxdb/schema/cards';
import type { DbSeed } from './rxdb/schema/seeds';

@Injectable({ providedIn: 'root' })
export class BarnService {
  private barnDb = inject(BarnDbService);
  private injector = inject(Injector);

  seeds = this.convertToSignal(this.barnDb.seeds.find().$);
  cards = this.convertToSignal(this.barnDb.sprouts.find().$);

  async addSeeds(names: string[]) {
    const { seedsToAdd, seedsToUpdate, newCards } = await this.prepareNewSeeds(names);

    // add new or update existing seeds
    if (seedsToAdd.length || seedsToUpdate.length) {
      await this.barnDb.seeds.bulkUpsert([...seedsToAdd, ...seedsToUpdate]);
    }

    // add new cards
    if (newCards.length) {
      await this.addCards(newCards.map(term => ({ term })));
      await this.removeSeeds(newCards);
    }
  }

  async removeSeeds(names: string[]) {
    await this.barnDb.seeds.find({ selector: { name: { $in: names } } }).remove();
  }

  async updateSeed(name: string, newData: Partial<DbSeed>) {
    await this.barnDb.seeds.findOne({ selector: { name } }).modify(seed => ({ ...seed, ...newData }));
  }

  async addCards(cardsToAdd: CardToAdd[]) {
    const newCards = cardsToAdd
      // filter out duplicates
      .filter((card, index, self) => self.findIndex(anotherCard => anotherCard.term === card.term) === index)
      .map(card => ({
        id: nanoid(),
        term: card.term,
        definition: card.definition ?? '',
        fullTerm: card.fullTerm ?? undefined,
        addedAt: new Date().toISOString(),
        tags: card.tags ?? [],
      }));

    if (newCards.length) {
      await this.barnDb.sprouts.bulkInsert(newCards);
    }
  }

  async removeCard(id: string) {
    await this.barnDb.sprouts.findOne({ selector: { id } }).remove();
  }

  async updateCard(id: string, newData: Partial<DbCard>) {
    await this.barnDb.sprouts.findOne({ selector: { id } }).modify(card => ({ ...card, ...newData }));
  }

  // https://github.com/pubkey/rxdb/issues/6188
  private convertToSignal<T>(observable$: Observable<T>) {
    return toSignal(observable$, { initialValue: undefined, injector: this.injector });
  }

  // TODO: add tests
  private async prepareNewSeeds(names: string[]) {
    const newSeedsCount = names.reduce(
      (result, name) => ({ ...result, [name]: result[name] ? result[name] + 1 : 1 }),
      {} as Record<string, number>,
    );

    const existingSeeds = await this.barnDb.seeds
      .find({ selector: { name: { $in: Object.keys(newSeedsCount) } } })
      .exec();

    const { seedsToAdd, seedsToUpdate, newCards } = Object.entries(newSeedsCount).reduce(
      (result, [name, newSeedCount]) => {
        const existingSeed = existingSeeds.find(seed => seed.name === name);
        const count = newSeedCount + (existingSeed ? existingSeed.count : 0);

        // covers both cases: update existing seed or add new seed multiple times
        if (count >= seedToCardThreshold) {
          return { ...result, newCards: [...result.newCards, name] };
        } else if (existingSeed) {
          return {
            ...result,
            seedsToUpdate: [
              ...result.seedsToUpdate,
              { ...existingSeed.toJSON(), count, lastAddedAt: new Date().toISOString() },
            ],
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
              addedAt: new Date().toISOString(),
              lastAddedAt: new Date().toISOString(),
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

interface CardToAdd {
  term: string;
  fullTerm?: string;
  definition?: string;
  tags?: string[];
}
