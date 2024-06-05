import { Injectable, computed, effect, signal } from '@angular/core';

interface Barn {
  version: number;
  seeds: Record<string, Seed>;
}

interface Seed {
  name: string;
  count: number;
  addedAt: number;
  lastAddedAt: number;
}

@Injectable({ providedIn: 'root' })
export class BarnService {
  private barn = signal<Barn>({ version: 1, seeds: {} });

  seeds = computed(() => this.barn().seeds);

  constructor() {
    this.initStorage();
  }

  addSeed(name: string) {
    this.barn.update(barn => {
      const seed = barn.seeds[name] ?? { name, count: 0, addedAt: Date.now(), lastAddedAt: Date.now() };

      return {
        ...barn,
        seeds: {
          ...barn.seeds,
          [name]: { ...seed, count: seed.count + 1, lastAddedAt: Date.now() },
        },
      };
    });
  }

  private initStorage() {
    const barn = localStorage.getItem(barnStorageKey);

    if (barn) {
      this.barn.set(JSON.parse(barn));
    }

    effect(() => {
      const barn = this.barn();

      localStorage.setItem(barnStorageKey, JSON.stringify(barn));
    });
  }
}

const barnStorageKey = 'barn';
