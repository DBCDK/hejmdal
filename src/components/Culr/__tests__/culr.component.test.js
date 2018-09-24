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
  const noop = () => {};

  describe('getCulrAttributes', () => {
    const next = noop;

    beforeEach(() => {
      ctx.query = {};
      initState(ctx, noop);
    });

    it('remain undefined when no userId is given', async() => {
      await getCulrAttributes(ctx, ctx, next);

      assert.isUndefined(ctx.getState().culr);
    });

    it('should set culr object on state -- OK200', async() => {
      ctx.setUser({userId: '5555666677'});
      await getCulrAttributes(ctx, ctx, next);

      assert.deepEqual(ctx.getState().culr, {
        accounts: [
          {
            provider: '790900',
            userIdType: 'CPR',
            userIdValue: '5555666677'
          },
          {
            provider: '100800',
            userIdType: 'LOCAL-1',
            userIdValue: '456456'
          }
        ],
        municipalityNumber: '909'
      });
    });

    it('should return empty object -- ACCOUNT_DOES_NOT_EXIST', async() => {
      ctx.setUser({userId: 'not_existing_user'});
      await getCulrAttributes(ctx, ctx, next);

      assert.deepEqual(ctx.getState().culr, {});
    });
  });
});
