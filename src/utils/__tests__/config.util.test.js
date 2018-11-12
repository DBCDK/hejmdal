/**
 * @file
 * Unittesting methods in config.util.js
 */

import {validateConfig} from '../config.util.js';

describe('Unittesting methods in config.util.js', () => {
  let CONFIG;

  beforeEach(() => {
    CONFIG = {
      app: {
        port: Number(1234)
      },
      postgres: {
        client: 'postgresql',
        connection: {
          host: 'host'
        }
      },
      log: {
        level: 'LEVEL',
        pretty: true,
        pretty_: false
      },
      session: {
        life_time: Number(0)
      }
    };
  });

  it('Should not throw', () => {
    validateConfig(CONFIG);
  });

  it('Should throw when a Number has value NaN', () => {
    CONFIG.app.port = Number('TEST');

    const result = () => {
      validateConfig(CONFIG);
    };

    expect(result).toThrow();
  });

  it('Should throw when a value is undefined', () => {
    CONFIG.postgres.connection.host = undefined; // eslint-disable-line no-undefined

    const result = () => {
      validateConfig(CONFIG);
    };

    expect(result).toThrow();
  });
});
