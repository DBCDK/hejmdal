import {assert} from 'chai';
import sinon from 'sinon';
import {showInfo} from '../info.component';
import {mockContext} from '../../../utils/test.util';

describe('test showinfo method', () => {
  let ctx;
  let sandbox;

  beforeEach(() => {
    ctx = mockContext();
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('Should render cookie info page', async () => {
    const spy = sandbox.spy(ctx, 'render');
    ctx.params = {
      infoId: 'cookies'
    };
    showInfo(ctx, ctx);
    assert.isTrue(spy.called);
    assert.isObject(spy.args[0][1].textObj);
  });

  it('Should not render info page', async () => {
    const spy = sandbox.spy(ctx, 'render');
    const next = sandbox.mock();
    ctx.params = {
      infoId: 'not_valid'
    };
    showInfo(ctx, ctx, next);
    assert.isTrue(next.called);
    assert.isFalse(spy.called);
  });
});
