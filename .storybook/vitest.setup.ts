import { setProjectAnnotations } from '@analogjs/storybook-angular/testing';
import * as addonA11y from '@storybook/addon-a11y/preview';
import { beforeAll } from 'vitest';

import * as previewAnnotations from './preview';

const annotations = setProjectAnnotations([previewAnnotations, addonA11y]);

// Run Storybook's beforeAll hook
beforeAll(annotations.beforeAll);
