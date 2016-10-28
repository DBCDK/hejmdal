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
      userIdValue: '0102456789'
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
        attributes: ['birthDate', 'birthYear', 'gender', 'cpr', 'libraries', 'municipality']
      },
      ticket: {}
    });

    mapAttributesToTicket(ctx, next);

    assert.deepEqual(ctx.session.state.ticket.attributes, {
      birthDate: '010245',
      birthYear: '2045',
      gender: 'm',
      cpr: '0102456789',
      libraries: [
        {libraryid: '000111', loanerid: '0102456789'},
        {libraryid: '111222', loanerid: '222333'}
      ],
      municipality: '333'
    });
  });

  it('map to correct milenium in birthYear', () => {
    const ctx = mockContext();
    ctx.setState({
      culr: {accounts: [{userIdType: 'CPR', userIdValue: '0102030788'}]},
      serviceClient: {
        attributes: ['birthYear']
      }
    });
    mapAttributesToTicket(ctx, next);
    assert.deepEqual(ctx.session.state.ticket.attributes, {birthYear: '1903'});

    ctx.setState({culr: {accounts: [{userIdType: 'CPR', userIdValue: '0102364788'}]}});
    mapAttributesToTicket(ctx, next);
    assert.deepEqual(ctx.session.state.ticket.attributes, {birthYear: '2036'});

    ctx.setState({culr: {accounts: [{userIdType: 'CPR', userIdValue: '0102374788'}]}});
    mapAttributesToTicket(ctx, next);
    assert.deepEqual(ctx.session.state.ticket.attributes, {birthYear: '1937'});

    ctx.setState({culr: {accounts: [{userIdType: 'CPR', userIdValue: '0102575788'}]}});
    mapAttributesToTicket(ctx, next);
    assert.deepEqual(ctx.session.state.ticket.attributes, {birthYear: '2057'});

    ctx.setState({culr: {accounts: [{userIdType: 'CPR', userIdValue: '0102585788'}]}});
    mapAttributesToTicket(ctx, next);
    assert.deepEqual(ctx.session.state.ticket.attributes, {birthYear: '1858'});

  });

  it('map gender', () => {
    const ctx = mockContext();
    ctx.setState({
      culr: {accounts: [{userIdType: 'CPR', userIdValue: '0102036788'}]},
      serviceClient: {
        attributes: ['gender']
      },
      ticket: {}
    });
    mapAttributesToTicket(ctx, next);
    assert.deepEqual(ctx.session.state.ticket.attributes, {
      gender: 'f'
    });
  });

  it('map invalid cpr', () => {
    const ctx = mockContext();
    ctx.setState({
      culr: {accounts: [{userIdType: 'CPR', userIdValue: '0123456789'}]},
      serviceClient: {
        attributes: ['birthDate', 'birthYear', 'gender', 'cpr']
      },
      ticket: {}
    });
    mapAttributesToTicket(ctx, next);
    assert.deepEqual(ctx.session.state.ticket.attributes, {
      birthDate: null,
      birthYear: null,
      gender: null,
      cpr: '0123456789'
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
        {libraryid: '000111', loanerid: '0102456789'},
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
        {libraryid: '000111', loanerid: '0102456789'},
        {libraryid: '111222', loanerid: '222333'}
      ],
      municipality: null
    });
  });

  it('log an error for unknown attribute', () => {
    const ctx = mockContext();
    ctx.setState({
      culr: {accounts: [{userIdType: 'CPR', userIdValue: '0102036788'}]},
      serviceClient: {
        attributes: ['notThere']
      },
      ticket: {}
    });
    mapAttributesToTicket(ctx, next);
    assert.deepEqual(ctx.session.state.ticket.attributes, {});
    // TODO Vodden testes at der er logget?
  });

});
