import { Injectable, Injector, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { nanoid } from 'nanoid';
import type { Observable } from 'rxjs';

import { BarnDbService } from './barnDb.service';
import type { DbSeed } from './rxdb/schema/seeds';
import type { DbSprout } from './rxdb/schema/sprouts';

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
    const existingCards = this.cards() ?? [];
    const newCards = cardsToAdd
      // filter out cards that already exist or are duplicates
      .filter(
        (card, index, self) =>
          !existingCards.some(existingCard => existingCard.term === card.term) &&
          self.findIndex(c => c.term === card.term) === index,
      )
      .map(card => ({
        id: nanoid(),
        term: card.term,
        definition: card.definition ?? '',
        fullTerm: card.fullTerm ?? undefined,
        addedAt: new Date().toISOString(),
      }));

    if (newCards.length) {
      await this.barnDb.sprouts.bulkInsert(newCards);
    }
  }

  async removeCard(id: string) {
    await this.barnDb.sprouts.findOne({ selector: { id } }).remove();
  }

  async updateCard(id: string, newData: Partial<DbSprout>) {
    await this.barnDb.sprouts.findOne({ selector: { id } }).modify(card => ({ ...card, ...newData }));
  }

  // https://github.com/pubkey/rxdb/issues/6188
  private convertToSignal<T>(observable$: Observable<T>) {
    return toSignal(observable$, { initialValue: undefined, injector: this.injector, rejectErrors: true });
  }

  // TODO: add tests
  private async prepareNewSeeds(names: string[]) {
    const existingCards = await this.barnDb.sprouts.find({ selector: { term: { $in: names } } }).exec();

    const newSeeds = names.reduce(
      (result, name) =>
        // skip the term if we already have a card for it
        existingCards.find(card => card.term === name)
          ? result
          : { ...result, [name]: result[name] ? result[name] + 1 : 1 },
      {} as Record<string, number>,
    );

    const existingSeeds = await this.barnDb.seeds.find({ selector: { name: { $in: Object.keys(newSeeds) } } }).exec();

    const { seedsToUpdate, newCards } = existingSeeds.reduce(
      (result, seed) => {
        if (!newSeeds[seed.name]) {
          return result;
        }

        const count = seed.count + newSeeds[seed.name];

        if (count >= seedToCardTreshold) {
          return { ...result, newCards: [...result.newCards, seed.name] };
        }

        return {
          ...result,
          seedsToUpdate: [...result.seedsToUpdate, { ...seed.toJSON(), count, lastAddedAt: new Date().toISOString() }],
        };
      },
      { seedsToUpdate: [] as DbSeed[], newCards: [] as string[] },
    );

    // TODO: when count is more than seedPlantingTreshold
    // shoult be added to newCards
    const seedsToAdd = Object.keys(newSeeds)
      .filter(name => !existingSeeds.some(seed => seed.name === name))
      .map(name => ({
        id: nanoid(),
        name,
        count: newSeeds[name],
        addedAt: new Date().toISOString(),
        lastAddedAt: new Date().toISOString(),
      }));

    return { seedsToAdd, seedsToUpdate, newCards };
  }
}

const seedToCardTreshold = 5;

interface CardToAdd {
  term: string;
  fullTerm?: string;
  definition?: string;
}
