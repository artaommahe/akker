import { Injectable, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';

import { SeedsApiService } from '../barn/seeds-api.service';

@Injectable({ providedIn: 'root' })
export class SeedsService {
  private seedsApiService = inject(SeedsApiService);

  getSeeds({ limit }: { limit?: number } = {}) {
    return rxResource({ stream: () => this.seedsApiService.getSeeds({ limit }) });
  }
  getSeedsCount() {
    return rxResource({ stream: () => this.seedsApiService.getSeedsCount() });
  }
}
