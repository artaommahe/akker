import { Injectable, inject } from '@angular/core';
import { from, map, switchMap } from 'rxjs';

import { BarnDbService } from './barn-db.service';
import type { DbCard } from './rxdb/schema/cards';

@Injectable({ providedIn: 'root' })
export class CardsApiService {
  private barnDbService = inject(BarnDbService);

  getUnsortedCards() {
    return from(this.barnDbService.getDb()).pipe(
      switchMap(db => db.sprouts.find({ selector: { definition: { $eq: '' } } }).$),
      map(cards => cards.map(card => card.toMutableJSON())),
    );
  }

  getCards({ limit, term, tags }: GetCardsParams = {}) {
    return from(this.barnDbService.getDb()).pipe(
      switchMap(
        db =>
          db.sprouts.find({
            selector: {
              ...(term ? { term: { $regex: term, $options: 'i' } } : {}),
              ...(tags?.length ? { tags: { $in: tags } } : {}),
            },
            sort: [{ addedAt: 'desc' }],
            limit,
          }).$,
      ),
      map(cards => cards.map(card => card.toMutableJSON())),
    );
  }

  getCardsCount() {
    return from(this.barnDbService.getDb()).pipe(switchMap(db => db.sprouts.count().$));
  }

  async addCards(cards: DbCard[]) {
    const db = await this.barnDbService.getDb();

    await db.sprouts.bulkInsert(cards);
  }

  async updateCard(id: string, newData: Partial<DbCard>) {
    const db = await this.barnDbService.getDb();

    await db.sprouts.findOne({ selector: { id } }).modify(card => ({ ...card, ...newData }));
  }

  async removeCard(id: string) {
    const db = await this.barnDbService.getDb();

    await db.sprouts.findOne({ selector: { id } }).remove();
  }
}

export interface GetCardsParams {
  limit?: number;
  term?: string;
  tags?: string[];
}
