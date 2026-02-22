---
name: angular-templates
description: Angular template patterns including native control flow (@if, @for, @switch), @defer for lazy loading, class/style bindings, and accessibility. Use when writing or modifying component templates.
---

# Angular Templates

Template patterns for Angular components.

## Core Patterns

### Native Control Flow

Use native control flow (`@if`, `@for`, `@switch`), NOT structural directives (`*ngIf`, `*ngFor`).

```typescript
// DO - Native control flow
template: `
  @if (isLoading()) {
    <p>Loading...</p>
  } @else if (error()) {
    <p class="text-semantic-danger">{{ error() }}</p>
  } @else {
    <ul>
      @for (card of cards(); track card.id) {
        <li>{{ card.term }}</li>
      } @empty {
        <li>No cards found</li>
      }
    </ul>
  }
`;

// DON'T - Structural directives
template: `
  <div *ngIf="isLoading(); else loaded">Loading...</div>
  <ul><li *ngFor="let card of cards(); trackBy: trackById">{{ card.term }}</li></ul>
`;
```

### @for with track

Always use `track` for performance.

```typescript
@for (card of cards(); track card.id) {
  <app-card [card]="card" />
}

@for (item of items(); track item.id; let i = $index; let isFirst = $first) {
  <div [class.border-t]="!isFirst">{{ i }}: {{ item.name }}</div>
}
```

### @defer for Lazy Loading

Use `@defer` for lazy component loading.

```typescript
template: `
  <app-dialog [open]="open()">
    <ng-template>
      @defer {
        @if (card(); as card) {
          <app-card-details [card]="card" />
        }
      } @loading {
        <p>Loading...</p>
      }
    </ng-template>
  </app-dialog>
`;
```

### Class and Style Bindings

Use `class` and `style` bindings, NOT `ngClass` or `ngStyle`.

```typescript
// DO - Native bindings
template: `
  <button 
    [class]="isActive() ? 'bg-primary text-white' : 'bg-secondary'"
    [class.disabled]="isDisabled()"
    [style.width.px]="width()"
  >
    Click
  </button>
`;

// DON'T
template: `
  <button [ngClass]="{ 'bg-primary': isActive(), 'disabled': isDisabled() }">
  <button [ngStyle]="{ 'width.px': width() }">
`;
```

### Conditional Classes with clsx

Use `clsx` for complex conditional classes.

```typescript
// In component
containerClass = computed(() =>
  clsx(
    'flex gap-2 p-4',
    this.isActive() && 'bg-active',
    this.size() === 'large' && 'text-lg',
  ),
);

// In template
<div [class]="containerClass()">
```

### Event Bindings

```typescript
// Signal update on event
<input [value]="searchString()" (input)="searchString.set($event.target.value)" />

// Method call
<button (click)="handleSave()">Save</button>

// With event object
<input (keydown)="handleKeydown($event)" />
```

### Template References with ng-template

```typescript
template: `
  <ng-container *ngTemplateOutlet="syntax"></ng-container>
  
  <ng-template #syntax>
    <p>Template content here</p>
  </ng-template>
`;
```

### Accessibility

Include accessibility attributes.

```typescript
template: `
  <input 
    aria-label="Search cards"
    aria-describedby="search-syntax"
    [value]="searchString()"
  />
  
  <button aria-label="Clear search string" (click)="clear()">
    <app-icon name="crossInCircle" aria-hidden="true" />
  </button>
  
  <ul [attr.aria-label]="listAriaLabel()">
    @for (card of cards(); track card.id) {
      <li>{{ card.term }}</li>
    }
  </ul>
`;
```

### Two-Way Binding

```typescript
// Using signal two-way binding
<input [(value)]="searchString" />

// Equivalent to
<input [value]="searchString()" (valueChange)="searchString.set($event)" />
```

## Reference Files

- `src/app/cards/search-cards/search-cards.component.ts` - Complex template with @if/@else, @for, ng-template
- `src/app/cards/card-details-dialog/card-details-dialog.component.ts` - @defer pattern
- `src/app/cards/cards-list/cards-list.component.ts` - @for with track, accessibility
- `src/app/layout/layout.component.ts` - Navigation template patterns
