import { Injectable, inject } from '@angular/core';

import { BarnService, type CardToAdd } from './barn.service';

@Injectable({ providedIn: 'root' })
export class BarnDemoService {
  private barnService = inject(BarnService, { optional: true });

  async init() {
    const urlParams = new URLSearchParams(window.location.search);
    const isDemoMode = urlParams.get('demo') === 'true';

    if (!isDemoMode || !this.barnService) {
      return;
    }

    try {
      await this.barnService.addSeeds(demoSeeds);
      await this.barnService.addCards(demoCards);
    } catch (error) {
      console.error("Can't initialize demo data", error);
    }

    urlParams.delete('demo');
    const newUrl = urlParams.toString()
      ? `${window.location.pathname}?${urlParams.toString()}`
      : window.location.pathname;
    window.history.replaceState({}, '', newUrl);
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
  { term: 'postkantoor', fullTerm: 'p**o**stkantoor', definition: 'post office' },
  { term: 'voorkomen', fullTerm: 'voork**o**men', definition: 'to prevent' },
] satisfies CardToAdd[];
