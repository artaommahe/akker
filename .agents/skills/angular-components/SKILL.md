---
name: angular-components
description: Patterns for Angular standalone components with signals, input/output functions, host bindings, and ViewChild/ContentChild. Use when creating or modifying Angular components (.component.ts files).
---

# Angular Components

Patterns for creating Angular components in this project.

## Core Patterns

### Standalone Components

Components are standalone by default. **Do NOT set `standalone: true`**.

```typescript
// DO
@Component({
  selector: 'app-example',
  template: `...`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class ExampleComponent {}

// DON'T
@Component({
  selector: 'app-example',
  standalone: true, // NOT needed - it's the default
  ...
})
```

### Input/Output Functions

Use `input()` and `output()` functions, NOT decorators.

```typescript
// DO
export class ExampleComponent {
  // Required input
  data = input.required<MyData>();

  // Optional with default
  title = input<string>('Default Title');

  // Optional that can be undefined
  subtitle = input<string | undefined>(undefined);

  // Input with alias
  openInput = input.required<boolean>({ alias: 'open' });

  // Output
  save = output<MyData>();
  close = output<void>();
}

// DON'T
export class ExampleComponent {
  @Input() data!: MyData;      // Don't use decorators
  @Output() save = new EventEmitter<MyData>();
}
```

### Host Bindings

Put host bindings in the `host` object, NOT using `@HostBinding`/`@HostListener`.

```typescript
// DO
@Component({
  selector: 'app-example',
  host: {
    '[class]': 'containerClass()',
    '[attr.aria-label]': 'ariaLabel()',
    '(click)': 'handleClick()',
  },
})
export class ExampleComponent {
  containerClass = computed(() => clsx('flex gap-2', this.isActive() && 'bg-active'));
}

// DON'T
export class ExampleComponent {
  @HostBinding('class') containerClass = 'flex';
  @HostListener('click') handleClick() {}
}
```

### Change Detection

Always use `ChangeDetectionStrategy.OnPush`.

```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
})
```

### ViewChild and ContentChild

Use `viewChild()` and `contentChild()` functions with `.required()` when element must exist.

```typescript
// Required - throws if not found
dialogRef = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');
contentRef = contentChild.required(TemplateRef);

// Optional - returns undefined if not found
searchInputRef = viewChild<ElementRef<HTMLInputElement>>('searchInput');
```

### Component Interface Export

Export interfaces for component data alongside the component.

```typescript
// cards-list-item.component.ts
export class CardsListItemComponent {
  card = input.required<CardsListItemCard>();
}

export interface CardsListItemCard {
  id: string;
  term: string;
  stability: number | undefined;
}
```

## Reference Files

- `src/app/cards/cards-list-item/cards-list-item.component.ts` - Basic component with inputs/outputs
- `src/app/cards/card-details/card-details.component.ts` - Component with forms
- `src/app/ui/button/button.ts` - Directive-based component with host bindings
- `src/app/ui/modal/modal.component.ts` - ViewChild/ContentChild patterns
- `src/app/cards/search-cards/search-cards.component.ts` - Complex signal state
