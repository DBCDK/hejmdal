/**
 * @file
 * Unittesting methods in culr.component
 */

import {assert} from 'chai';

import {initState} from '../../../utils/state.util';
import {getCulrAttributes} from '../culr.component.js';

describe('Unittesting methods in culr.component:', () => {

  describe('getCulrAttributes', () => {
    let ctx;
    const next = () => {};

    beforeEach(() => {
      ctx = {query: {}};
      initState(ctx, () => {});
    });

    it('should return error', () => {
      getCulrAttributes(ctx, next);

      assert.isNull(ctx.session.culr.user);
      assert.equal(ctx.session.culr.error, 'brugeren findes ikke');
    });

    it('should return error', () => {
      const userId = '0123456789';
      ctx.session.user.userId = userId;
      getCulrAttributes(ctx, next);

      assert.isNull(ctx.session.culr.error);
      assert.equal(ctx.session.culr.culr.userId, userId);
    });
  });
});
