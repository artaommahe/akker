import { setProjectAnnotations } from '@analogjs/storybook-angular/testing';
import { beforeAll } from 'vitest';

import * as previewAnnotations from './preview';

const annotations = setProjectAnnotations([previewAnnotations]);

// Run Storybook's beforeAll hook
beforeAll(annotations.beforeAll);
