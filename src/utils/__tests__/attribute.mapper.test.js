import mapAttributesToTicket from '../../utils/attribute.mapper.util.js';
import {mockContext} from '../../utils/test.util';
import {log} from '../../utils/logging.util';

describe('Attribute mapper unittest', () => {
  const next = () => {};

  const serviceId = 'a799f79-9797as979-4jk44-323332ed34';
  const user = {};
  const culr = {
    accounts: [
      {
        provider: '000111',
        userIdType: 'CPR',
        userIdValue: '0102456789'
      },
      {
        provider: '111222',
        userIdType: 'LOCAL-1',
        userIdValue: '222333'
      }
    ],
    municipalityNumber: '333',
    culrId: 'some-random-curl-id'
  };

  it('do nothing', () => {
    const ctx = mockContext();
    mapAttributesToTicket(ctx, ctx, next);
    expect(ctx.session.user).toEqual(user);
  });

  it('map all possible values', () => {
    const ctx = mockContext();
    ctx.setUser({cpr: '0102456789'});
    ctx.setState({
      culr: culr,
      serviceClient: {
        id: serviceId,
        attributes: {
          birthDate: {},
          birthYear: {},
          gender: {},
          cpr: {},
          libraries: {},
          municipality: {},
          uniqueId: {},
          municipalityAgencyId: {}
        }
      },
      ticket: {}
    });

    mapAttributesToTicket(ctx, ctx, next);

    expect(ctx.session.state.ticket.attributes).toEqual({
      birthDate: '0102',
      birthYear: '2045',
      gender: 'm',
      cpr: '0102456789',
      agencies: [
        {agencyId: '000111', userId: '0102456789', userIdType: 'CPR'},
        {agencyId: '111222', userId: '222333', userIdType: 'LOCAL-1'}
      ],
      uniqueId: 'some-random-curl-id',
      municipality: '333',
      municipalityAgencyId: '733300'
    });
  });
  it('should map to correct municipalityAgencyId', () => {
    const ctx = mockContext();
    ctx.setUser({cpr: '0102456789', agency: '733300'});
    ctx.setState({
      culr: {accounts: [], municipalityNumber: null},
      serviceClient: {
        attributes: {municipalityAgencyId: {}}
      }
    });
    mapAttributesToTicket(ctx, ctx, next);
    expect(ctx.session.state.ticket.attributes).toEqual({
      municipalityAgencyId: null
    });

    // Test MunicipalityNumber is expanded to an agency ID
    ctx.setState({
      culr: {accounts: [], municipalityNumber: '333'}
    });
    mapAttributesToTicket(ctx, ctx, next);
    expect(ctx.session.state.ticket.attributes).toEqual({
      municipalityAgencyId: '733300'
    });

    // Test agency ID is returned when no municipalityNumber
    ctx.setUser({cpr: '0102456789', agency: '12345'});
    ctx.setState({
      culr: {accounts: [], municipalityNumber: null}
    });
    mapAttributesToTicket(ctx, ctx, next);
    expect(ctx.session.state.ticket.attributes).toEqual({
      municipalityAgencyId: '12345'
    });
  });

  it('map to correct milenium in birthYear', () => {
    const ctx = mockContext();
    ctx.setState({
      culr: {accounts: [{userIdType: 'CPR', userIdValue: '0102030788'}]},
      serviceClient: {
        attributes: {birthYear: {}}
      }
    });
    mapAttributesToTicket(ctx, ctx, next);
    expect(ctx.session.state.ticket.attributes).toEqual({birthYear: '1903'});

    ctx.setState({
      culr: {accounts: [{userIdType: 'CPR', userIdValue: '0102364788'}]}
    });
    mapAttributesToTicket(ctx, ctx, next);
    expect(ctx.session.state.ticket.attributes).toEqual({birthYear: '2036'});

    ctx.setState({
      culr: {accounts: [{userIdType: 'CPR', userIdValue: '0102374788'}]}
    });
    mapAttributesToTicket(ctx, ctx, next);
    expect(ctx.session.state.ticket.attributes).toEqual({birthYear: '1937'});

    ctx.setState({
      culr: {accounts: [{userIdType: 'CPR', userIdValue: '0102575788'}]}
    });
    mapAttributesToTicket(ctx, ctx, next);
    expect(ctx.session.state.ticket.attributes).toEqual({birthYear: '2057'});

    ctx.setState({
      culr: {accounts: [{userIdType: 'CPR', userIdValue: '0102585788'}]}
    });
    mapAttributesToTicket(ctx, ctx, next);
    expect(ctx.session.state.ticket.attributes).toEqual({birthYear: '1858'});
  });

  it('map gender', () => {
    const ctx = mockContext();
    ctx.setState({
      culr: {accounts: [{userIdType: 'CPR', userIdValue: '0102036788'}]},
      serviceClient: {
        attributes: {gender: {}}
      },
      ticket: {}
    });
    mapAttributesToTicket(ctx, ctx, next);
    expect(ctx.session.state.ticket.attributes).toEqual({
      gender: 'f'
    });
  });

  it('map invalid cpr', () => {
    const ctx = mockContext();
    ctx.setState({
      culr: {accounts: [{userIdType: 'CPR', userIdValue: '0123456789'}]},
      serviceClient: {
        attributes: {birthDate: {}, birthYear: {}, gender: {}, cpr: {}}
      },
      ticket: {}
    });
    mapAttributesToTicket(ctx, ctx, next);
    expect(ctx.session.state.ticket.attributes).toEqual({
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
        attributes: {libraries: {}}
      },
      ticket: {}
    });

    mapAttributesToTicket(ctx, ctx, next);
    expect(ctx.session.state.ticket.attributes).toEqual({
      agencies: [
        {agencyId: '000111', userId: '0102456789', userIdType: 'CPR'},
        {agencyId: '111222', userId: '222333', userIdType: 'LOCAL-1'}
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
        attributes: {libraries: {}, municipality: {}}
      },
      ticket: {}
    });

    mapAttributesToTicket(ctx, ctx, next);
    expect(ctx.session.state.ticket.attributes).toEqual({
      agencies: [
        {agencyId: '000111', userId: '0102456789', userIdType: 'CPR'},
        {agencyId: '111222', userId: '222333', userIdType: 'LOCAL-1'}
      ],
      municipality: null
    });
  });

  it('log an error for unknown attribute', () => {
    log.error = jest.fn();
    const ctx = mockContext();
    ctx.setState({
      culr: {accounts: [{userIdType: 'CPR', userIdValue: '0102036788'}]},
      serviceClient: {
        attributes: {notThere: {}}
      },
      ticket: {}
    });
    mapAttributesToTicket(ctx, ctx, next);
    expect(ctx.session.state.ticket.attributes).toEqual({});
    expect(log.error).toBeCalledWith('Cannot map attribute: notThere');
  });
});
