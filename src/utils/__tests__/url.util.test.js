import {getHost} from '../url.util';
describe('test host extraction', () => {
  it('get host from parsed url', async () => {
    const urlString = 'http://some-proxy.test/path/path2?query=somequery';
    expect(getHost(urlString)).toEqual('http://some-proxy.test');
  });
  it('get host from urlencoded url', async () => {
    const urlString = `http://some-proxy.test/path/path2?query=${encodeURIComponent(
      'http://some-destination.test/path/path2?query='
    )}`;
    expect(getHost(urlString)).toEqual('http://some-proxy.test');
  });
  it('Returns null with invalid host', async () => {
    const urlString = 'Not a valid url';
    expect(getHost(urlString)).toEqual(null);
  });
});
