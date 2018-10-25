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
    expect(spy.called).toBe(true);
    expect(typeof spy.args[0][1].textObj).toBe('object');
  });

  it('Should not render info page', async () => {
    const spy = sandbox.spy(ctx, 'render');
    const next = sandbox.mock();
    ctx.params = {
      infoId: 'not_valid'
    };
    showInfo(ctx, ctx, next);
    expect(next.called).toBe(true);
    expect(spy.called).toBe(false);
  });
});
