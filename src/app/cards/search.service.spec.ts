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
      vi.setSystemTime(new Date('2025-03-30T00:00:00Z'));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    // valid parsing results
    test.each([
      ['tags:tag1', { term: '', tags: ['tag1'], addedAfter: undefined }],
      ['tags:tag1,tag2', { term: '', tags: ['tag1', 'tag2'], addedAfter: undefined }],
      ['tags:tag1,tag2 tags:tag3', { term: '', tags: ['tag1', 'tag2', 'tag3'], addedAfter: undefined }],
      ['last:2d', { term: '', tags: [], addedAfter: new Date('2025-03-28T00:00:00Z') }],
      ['last:3w', { term: '', tags: [], addedAfter: new Date('2025-03-09T00:00:00Z') }],
      ['last:1m', { term: '', tags: [], addedAfter: new Date('2025-02-28T00:00:00Z') }],
      ['last:1m last:6w', { term: '', tags: [], addedAfter: new Date('2025-02-16T00:00:00Z') }],
      ['search term', { term: 'search term', tags: [], addedAfter: undefined }],
      ['(regex|search) term', { term: '(regex|search) term', tags: [], addedAfter: undefined }],
      [
        'tags:tag1 last:2d search term',
        { term: 'search term', tags: ['tag1'], addedAfter: new Date('2025-03-28T00:00:00Z') },
      ],
    ])('should parse search string `%s`', (searchString, expectedSearchParams) => {
      const result = searchService.parseSearchString(searchString);

      expect(result).toEqual(expectedSearchParams);
    });

    // invalid parsing results
    test.each([
      ['last:xxx'],
      ['last:0d'],
      ['last:-1d'],
      ['last:ad'],
      ['last:1x'],
      //
    ])('should parse invalid search string `%s`', searchString => {
      const result = searchService.parseSearchString(searchString);

      expect(result).toEqual({ term: '', tags: [], addedAfter: undefined });
    });
  });
});
