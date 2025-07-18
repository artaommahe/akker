import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CardsService } from 'src/app/cards/cards.service';
import { SeedsService } from 'src/app/seeds/seeds.service';

import { ButtonDirective } from '../../ui/button/button';
import { DemoDataService } from '../demo-data.service';

@Component({
  selector: 'app-init-demo-data',
  template: `
    @if (barnIsEmpty()) {
      <button appButton [appButtonType]="'primary'" (click)="initDemo()">Load demo data</button>
    }
  `,
  imports: [ButtonDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InitDemoDataComponent {
  private demoService = inject(DemoDataService);
  private cardsService = inject(CardsService);
  private seedsService = inject(SeedsService);

  private cardsCount = this.cardsService.getCardsCount();
  private seedsCount = this.seedsService.getSeedsCount();

  barnIsEmpty = computed(
    () =>
      this.cardsCount.hasValue() &&
      this.cardsCount.value() === 0 &&
      this.seedsCount.hasValue() &&
      this.seedsCount.value() === 0,
  );

  initDemo() {
    this.demoService.initDemoData();
  }
}
