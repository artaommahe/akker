import { Injectable, inject } from '@angular/core';

import { CardsService, type NewCard } from '../cards/cards.service';
import { SeedsService } from '../seeds/seeds.service';

@Injectable({ providedIn: 'root' })
export class DemoDataService {
  private cardsService = inject(CardsService);
  private seedsService = inject(SeedsService);

  async initDemoData() {
    try {
      await this.seedsService.addSeeds(demoSeeds);
      await this.cardsService.addCards(demoCards);
    } catch (error) {
      console.error("Can't initialize demo data", error);
    }
  }
}

const demoSeeds = ['snoep', 'hemel', 'doel', 'snoep', 'cadeau', 'cadeau', 'kat', 'kat', 'kat', 'kat', 'spel'];
const demoCards = [
  { term: 'aardbei' },
  { term: 'arbeid' },
  { term: 'bliksem' },
  { term: 'wolk', definition: 'cloud' },
  { term: 'boom', definition: 'tree' },
  { term: 'aarde', fullTerm: '**aa**rde', definition: 'earth' },
  { term: 'postkantoor', fullTerm: 'p**o**stkantoor', definition: 'post office', tags: ['nl', 'top1k'] },
  { term: 'voorkomen', fullTerm: 'voork**o**men', definition: 'to prevent', tags: ['nl', 'top2k'] },
  { term: 'leraar', definition: 'teacher', tags: ['nl', 'top1k'] },
  { term: 'servet', definition: 'napkin', tags: ['nl', 'top1k'] },
  { term: 'tijdschrift', fullTerm: 't**ij**dschrift', definition: 'magazine' },
  { term: 'framboos', definition: 'raspberry' },
] satisfies NewCard[];
