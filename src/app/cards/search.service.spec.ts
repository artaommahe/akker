import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import { SearchService } from './search.service';

describe('SearchService', () => {
  let searchService: SearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SearchService],
    });

    searchService = TestBed.inject(SearchService);
  });

  describe('parseSearchString', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2025-02-01T00:00:00Z'));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    test.each([
      ['tags:tag1', { term: '', tags: ['tag1'], addedAfter: undefined }],
      ['tags:tag1,tag2', { term: '', tags: ['tag1', 'tag2'], addedAfter: undefined }],
      ['last:2d', { term: '', tags: [], addedAfter: new Date('2025-01-30T00:00:00Z') }],
      ['last:3w', { term: '', tags: [], addedAfter: new Date('2025-01-11T00:00:00Z') }],
      ['last:1m', { term: '', tags: [], addedAfter: new Date('2025-01-01T00:00:00Z') }],
      ['search term', { term: 'search term', tags: [], addedAfter: undefined }],
      ['(regex|search) term', { term: '(regex|search) term', tags: [], addedAfter: undefined }],
      [
        'tags:tag1 last:2d search term',
        { term: 'search term', tags: ['tag1'], addedAfter: new Date('2025-01-30T00:00:00Z') },
      ],
    ])('should parse search string `%s`', (searchString, expectedSearchParams) => {
      const result = searchService.parseSearchString(searchString);

      expect(result).toEqual(expectedSearchParams);
    });
  });
});
