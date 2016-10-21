/**
 * @file
 * Unittesting methods in culr.component
 */

import {assert} from 'chai';

import {initState} from '../../../utils/state.util';
import {getCulrAttributes} from '../culr.component.js';
import {mockContext} from '../../../utils/test.util';

describe('Unittesting methods in culr.component:', () => {
  let ctx = mockContext();

  describe('getCulrAttributes', () => {
    const next = () => {};

    beforeEach(() => {
      ctx.query = {};
      initState(ctx, () => {});
    });

    it('should return empty object', () => {
      getCulrAttributes(ctx, next);

      assert.deepEqual(ctx.getState().culr, {});
    });
  });
});
