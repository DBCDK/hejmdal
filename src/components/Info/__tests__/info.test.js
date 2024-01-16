import {showInfo} from '../info.component';
import {mockContext} from '../../../utils/test.util';

describe('test showinfo method', () => {
  let ctx;

  beforeEach(() => {
    ctx = mockContext();
  });

  it('Should render cookie info page', async () => {
    ctx.params = {
      infoId: 'cookies'
    };
    showInfo(ctx, ctx);
    expect(ctx.render).toMatchSnapshot();
  });

  it('Should not render info page', async () => {
    const next = jest.fn();
    ctx.params = {
      infoId: 'not_valid'
    };
    showInfo(ctx, ctx, next);
    expect(next).toHaveBeenCalled();
    expect(ctx.render).not.toHaveBeenCalled();
  });
});
