import { Injectable, computed, effect, signal } from '@angular/core';

interface Barn {
  version: number;
  seeds: Record<string, Seed>;
  sprouts: Sprout[];
}

// TODO: add id
export interface Seed {
  name: string;
  count: number;
  addedAt: number;
  lastAddedAt: number;
}

// TODO: add id
export interface Sprout {
  name: string;
  addedAt: number;
}

@Injectable({ providedIn: 'root' })
export class BarnService {
  private barn = signal<Barn>({ version: 1, seeds: {}, sprouts: [] });

  seeds = computed(() => this.barn().seeds);
  sprouts = computed(() => this.barn().sprouts);

  constructor() {
    this.initStorage();
  }

  addSeed(name: string) {
    const sprout = this.barn().sprouts.find(sprout => sprout.name === name);

    // if the seed is already sprouted, don't add it to the seeds
    if (sprout) {
      return;
    }

    let seed: Seed | undefined = this.barn().seeds[name];

    // if the count of this seed is greater than or equal to the treshold, convert it to a sprout
    if (seed?.count >= seedPlantingTreshold - 1) {
      this.addSprout(name);
      this.removeSeed(name);
      return;
    }

    this.barn.update(barn => {
      seed ??= { name, count: 0, addedAt: Date.now(), lastAddedAt: Date.now() };

      return {
        ...barn,
        seeds: {
          ...barn.seeds,
          [name]: { ...seed, count: seed.count + 1, lastAddedAt: Date.now() },
        },
      };
    });
  }

  addMultipleSeeds(names: string[]) {
    names.forEach(name => this.addSeed(name));
  }

  removeSeed(name: string) {
    this.barn.update(barn => {
      const { [name]: _, ...seeds } = barn.seeds;

      return { ...barn, seeds: seeds };
    });
  }

  removeSprout(name: string) {
    this.barn.update(barn => ({
      ...barn,
      sprouts: barn.sprouts.filter(sprout => sprout.name !== name),
    }));
  }

  updateSprout(name: string, newData: Partial<Sprout>) {
    this.barn.update(barn => ({
      ...barn,
      sprouts: barn.sprouts.map(sprout => (sprout.name === name ? { ...sprout, ...newData } : sprout)),
    }));
  }

  private addSprout(name: string) {
    this.barn.update(barn => ({
      ...barn,
      sprouts: [...barn.sprouts, { name, addedAt: Date.now() }],
    }));
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
const seedPlantingTreshold = 5;
