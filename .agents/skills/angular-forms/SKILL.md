---
name: angular-forms
description: Angular reactive forms patterns with NonNullableFormBuilder, validation, error display, and form handling. Use when creating or modifying forms in components.
---

# Angular Forms

Reactive forms patterns for Angular components.

## Core Patterns

### NonNullableFormBuilder

Use `NonNullableFormBuilder` for type-safe forms.

```typescript
import { NonNullableFormBuilder, Validators } from '@angular/forms';

export class CardDetailsComponent implements OnInit {
  private fb = inject(NonNullableFormBuilder);

  form = this.fb.group({
    term: ['', [Validators.minLength(1), Validators.required]],
    fullTerm: [''],
    definition: [''],
    tags: ['', Validators.pattern(/^[a-zA-Z0-9,\s]*$/)],
  });

  ngOnInit() {
    this.form.setValue({
      term: this.card().term,
      fullTerm: this.card().fullTerm ?? '',
      definition: this.card().definition,
      tags: this.card().tags.join(', '),
    });
  }
}
```

### Form Submission

```typescript
onSubmit() {
  if (!this.form.valid) return;

  const formValue = this.form.getRawValue();
  this.save.emit({ ...formValue, id: this.card().id });
}

// Template
<form [formGroup]="form" (ngSubmit)="onSubmit()">
  <!-- form controls -->
  <button type="submit" [disabled]="form.invalid">Save</button>
</form>
```

### Form Controls in Template

```typescript
template: `
  <form [formGroup]="form" (ngSubmit)="onSubmit()">
    <div>
      <label for="term">Term</label>
      <input id="term" formControlName="term" />
    </div>
    
    <div>
      <label for="definition">Definition</label>
      <textarea id="definition" formControlName="definition"></textarea>
    </div>
    
    <button type="submit" [disabled]="form.invalid">Save</button>
  </form>
`;
```

### Error Display

Display errors only when field is touched or dirty.

```typescript
template: `
  <div>
    <label for="tags">Tags</label>
    <input id="tags" formControlName="tags" />
    @if (form.get('tags')?.invalid && (form.get('tags')?.dirty || form.get('tags')?.touched)) {
      @if (form.get('tags')?.hasError('pattern')) {
        <p class="text-semantic-danger">Tags can only contain letters, numbers, commas and spaces</p>
      }
      @if (form.get('tags')?.hasError('required')) {
        <p class="text-semantic-danger">Tags is required</p>
      }
    }
  </div>
`;
```

### Common Validators

```typescript
form = this.fb.group({
  // Required
  name: ['', Validators.required],

  // Required with min length
  term: ['', [Validators.required, Validators.minLength(1)]],

  // Pattern validation
  tags: ['', Validators.pattern(/^[a-zA-Z0-9,\s]*$/)],

  // Email
  email: ['', [Validators.required, Validators.email]],

  // Min/Max
  age: [0, [Validators.min(0), Validators.max(120)]],

  // Multiple validators
  password: ['', [Validators.required, Validators.minLength(8)]],
});
```

### Dynamic Form Values

```typescript
// Patch specific values
this.form.patchValue({
  term: newTerm,
});

// Set all values (must match structure)
this.form.setValue({
  term: this.card().term,
  fullTerm: this.card().fullTerm ?? '',
  definition: this.card().definition,
  tags: this.card().tags.join(', '),
});

// Get raw value (includes disabled controls)
const formValue = this.form.getRawValue();

// Get value (excludes disabled controls)
const value = this.form.value;
```

### Signal-Based Form State (Non-Reactive)

For simpler forms, use signals directly.

```typescript
export class AddSeedsComponent {
  newSeed = signal('');

  updateSeed(event: Event) {
    this.newSeed.set((event.target as HTMLTextAreaElement).value);
  }

  add() {
    const newSeeds = this.newSeed()
      .split('\n')
      .map(seed => seed.trim())
      .filter(seed => !!seed);
    // Process seeds...
    this.newSeed.set('');
  }
}

// Template
<textarea [value]="newSeed()" (input)="updateSeed($event)"></textarea>
<button (click)="add()">Add</button>
```

## Reference Files

- `src/app/cards/card-details/card-details.component.ts` - Complete reactive form example
- `src/app/seeds/add-seeds/add-seeds.component.ts` - Signal-based form state
