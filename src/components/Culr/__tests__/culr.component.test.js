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

    it('should return error', () => {
      getCulrAttributes(ctx, next);

      assert.isNull(ctx.getState().culr.user);
      assert.equal(ctx.getState().culr.error, 'brugeren findes ikke');
    });

    it('should also return error', () => {
      const userId = '0123456789';
      ctx.setUser({userId: userId});
      getCulrAttributes(ctx, next);

      assert.isNull(ctx.getState().culr.error);
      assert.equal(ctx.getState().culr.attributes.userId, userId);
    });
  });
});
