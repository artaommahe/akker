import { Injectable } from '@angular/core';
import { type Duration, sub } from 'date-fns';

import type { GetCardsParams } from '../barn/cards-api.service';

@Injectable({ providedIn: 'root' })
export class SearchService {
  /**
   * supported syntax:
   * - `tags:tag1,tag2`
   * - `last:2d`, `last:3w`, `last:1m`
   * - remaining text is treated as a search term
   */
  parseSearchString(searchString: string): GetCardsParams {
    const searchTokens = searchString.match(searchStringTokensRegex) ?? [];

    const params = searchTokens.reduce(
      (params, token) => {
        if (token.startsWith('tags:')) {
          const tags = token
            .slice(5)
            .split(',')
            .map(tag => tag.trim())
            .filter(tag => tag.length > 0);

          return { ...params, tags: [...(params.tags ?? []), ...tags] };
        } else if (token.startsWith('last:')) {
          const lastMatch = token.match(/last:(\d+)([dwm])/);

          if (!lastMatch) {
            return params;
          }

          const value = parseInt(lastMatch[1], 10);
          const unit = lastMatch[2];

          if (isNaN(value) || value <= 0 || !isValidDateAgoUnit(unit)) {
            return params;
          }

          const addedAfter = getDateAgo(value, unit);

          return { ...params, addedAfter };
        }

        return { ...params, term: `${params.term} ${token}`.trim() };
      },
      { term: '', tags: [], addedAfter: undefined } as GetCardsParams,
    );

    return params;
  }
}
// used part of regex from https://github.com/nepsilon/search-query-parser/blob/8158d09c70b66168440e93ffabd720f4c8314c9b/lib/search-query-parser.js#L40
const searchStringTokensRegex = new RegExp(
  [
    // `<type>:` with single or double quotes
    // is not supported yet
    /* `(\\S+:'(?:[^'\\\\]|\\.)*')`,
    `(\\S+:"(?:[^"\\\\]|\\.)*")`, */
    // `<type>:<value>`
    `\\S+:\\S+`,
    // just remaining text
    `\\S+`,
  ].join('|'),
  'g',
);

enum DateAgoUnit {
  Day = 'd',
  Week = 'w',
  Month = 'm',
}

const isValidDateAgoUnit = (unit: string): unit is DateAgoUnit =>
  Object.values(DateAgoUnit).includes(unit as DateAgoUnit);

const getDateAgo = (value: number, unit: DateAgoUnit) => {
  const subOptions: Duration =
    unit === DateAgoUnit.Day ? { days: value } : unit === DateAgoUnit.Week ? { weeks: value } : { months: value };

  const date = sub(new Date(), subOptions);

  return date;
};
