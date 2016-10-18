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

    beforeEach(() => {
      ctx = {query: {}};
      initState(ctx, () => {});
    });

    it('should return error', () => {
      const result = getCulrAttributes(ctx);

      assert.isNull(result.user);
      assert.equal(result.error, 'brugeren findes ikke');
    });

    it('should return error', () => {
      const userId = '0123456789';
      ctx.session.user.userId = userId;
      const result = getCulrAttributes(ctx);

      assert.isNull(result.error);
      assert.equal(result.user.userId, userId);
    });
  });
});
