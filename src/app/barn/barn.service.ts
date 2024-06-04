import { Injectable, signal } from '@angular/core';

interface Barn {
  seeds: Record<string, Seed>;
}

interface Seed {
  name: string;
  count?: number;
}

@Injectable({ providedIn: 'root' })
export class BarnService {
  private barn = signal<Barn>({ seeds: {} });

  addSeed(name: string) {
    this.barn.update(barn => {
      const seed = barn.seeds[name];

      return {
        ...barn,
        seeds: {
          ...barn.seeds,
          [name]: { ...seed, count: (seed?.count || 0) + 1 },
        },
      };
    });
  }
}
