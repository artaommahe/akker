import { Injectable, inject } from '@angular/core';

import { BarnService, type CardToAdd } from '../barn/barn.service';

@Injectable({ providedIn: 'root' })
export class DemoDataService {
  private barnService = inject(BarnService);

  async initDemoData() {
    try {
      await this.barnService.addSeeds(demoSeeds);
      await this.barnService.addCards(demoCards);
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
  { term: 'voorkomen', fullTerm: 'voork**o**men', definition: 'to prevent' },
  { term: 'leraar', definition: 'teacher' },
  { term: 'servet', definition: 'napkin' },
  { term: 'tijdschrift', fullTerm: 't**ij**dschrift', definition: 'magazine' },
  { term: 'framboos', definition: 'raspberry' },
] satisfies CardToAdd[];
