import { inject, Injectable, Injector } from '@angular/core';
import { BarnDbService } from './barnDb.service';
import { toSignal } from '@angular/core/rxjs-interop';
import type { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BarnV2Service {
  private barnDb = inject(BarnDbService);
  private injector = inject(Injector);

  seeds() {
    return this.convertToSignal(this.barnDb.seeds.find().$);
  }

  // https://github.com/pubkey/rxdb/issues/6188
  private convertToSignal<T>(observable$: Observable<T>) {
    return toSignal(observable$, {
      initialValue: undefined,
      injector: this.injector,
      rejectErrors: true,
    });
  }
}
