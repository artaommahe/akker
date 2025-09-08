import { setProjectAnnotations } from '@analogjs/storybook-angular/testing';
import * as addonA11y from '@storybook/addon-a11y/preview';
import { beforeAll } from 'vitest';

import * as previewAnnotations from './preview';

// NOTE: order matters due to storybook bug
// https://github.com/storybookjs/storybook/issues/32372
const annotations = setProjectAnnotations([addonA11y, previewAnnotations]);

// Run Storybook's beforeAll hook
beforeAll(annotations.beforeAll);
