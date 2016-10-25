import {assert} from 'chai';

import mapAttributesToTicket from '../attribute.mapper.component.js';
import {mockContext} from '../../utils/test.util';

describe('Attribute mapper unittest', () => {
  const next = () => {
  };

  const user = {};
  const culr = {
    accounts: [{
      provider: '000111',
      userIdType: 'CPR',
      userIdValue: '0123456789'
    },
      {
        provider: '111222',
        userIdType: 'LOCAL-1',
        userIdValue: '222333'
      }],
    municipalityNumber: '333'
  };

  it('do nothing', () => {
    const ctx = mockContext();
    mapAttributesToTicket(ctx, next);
    assert.deepEqual(ctx.session.user, user);
  });

  it('map all possible values', () => {
    const ctx = mockContext();
    ctx.setState({
      culr: culr,
      serviceClient: {
        attributes: ['cpr', 'libraries', 'municipality']
      },
      ticket: {}
    });

    mapAttributesToTicket(ctx, next);

    assert.deepEqual(ctx.session.state.ticket.attributes, {
      cpr: '0123456789',
      libraries: [
        {libraryid: '000111', loanerid: '0123456789'},
        {libraryid: '111222', loanerid: '222333'}
      ],
      municipality: '333'
    });
  });

  it('map libraries only values', () => {
    const ctx = mockContext();
    ctx.setState({
      culr: culr,
      serviceClient: {
        attributes: ['libraries']
      },
      ticket: {}
    });

    mapAttributesToTicket(ctx, next);
    assert.deepEqual(ctx.session.state.ticket.attributes, {
      libraries: [
        {libraryid: '000111', loanerid: '0123456789'},
        {libraryid: '111222', loanerid: '222333'}
      ]
    });
  });

  it('map response from culr missing municipality', () => {
    const ctx = mockContext();
    const _culr = Object.assign({}, culr);
    delete _culr.municipalityNumber;

    ctx.setState({
      culr: _culr,
      serviceClient: {
        attributes: ['libraries', 'municipality']
      },
      ticket: {}
    });

    mapAttributesToTicket(ctx, next);
    assert.deepEqual(ctx.session.state.ticket.attributes, {
      libraries: [
        {libraryid: '000111', loanerid: '0123456789'},
        {libraryid: '111222', loanerid: '222333'}
      ],
      municipality: null
    });
  });
});
