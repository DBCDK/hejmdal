import mapAttributesToTicket from '../../utils/attribute.mapper.util.js';
import {mockContext} from '../../utils/test.util';
import {log} from '../../utils/logging.util';
import '../../components/UniLogin/__tests__/nockFixtures';

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
    municipalityAgencyId: '733300',
    culrId: 'guid-0102456789'
  };

  it('do nothing', () => {
    const ctx = mockContext();
    mapAttributesToTicket(ctx, ctx, next);
    expect(ctx.session.user).toEqual(user);
  });

  it('map all possible values', async () => {
    const ctx = mockContext();
    ctx.setUser({cpr: '0102456789', uniloginId: 'valid_user_id'});
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
          municipalityAgencyId: {},
          uniLoginInstitutions: {}
        }
      },
      ticket: {}
    });

    await mapAttributesToTicket(ctx, ctx, next);

    expect(ctx.session.state.ticket.attributes).toEqual({
      birthDate: '0102',
      birthYear: '2045',
      gender: 'm',
      cpr: '0102456789',
      agencies: [
        {agencyId: '000111', userId: '0102456789', userIdType: 'CPR'},
        {agencyId: '111222', userId: '222333', userIdType: 'LOCAL-1'}
      ],
      uniqueId: 'guid-0102456789',
      municipality: '333',
      municipalityAgencyId: '733300',
      uniLoginInstitutions: [
        {id: '101DBC', name: 'DANSK BIBLIOTEKSCENTER A/S'},
        {id: 'A03132', name: 'Vejle Bibliotekerne c/o www.pallesgavebod.dk'}
      ]
    });
  });

  it('map to correct milenium in birthYear', async () => {
    const ctx = mockContext();
    ctx.setState({
      culr: {accounts: [{userIdType: 'CPR', userIdValue: '0102030788'}]},
      serviceClient: {
        attributes: {birthYear: {}}
      }
    });
    await mapAttributesToTicket(ctx, ctx, next);
    expect(ctx.session.state.ticket.attributes).toEqual({birthYear: '1903'});

    ctx.setState({
      culr: {accounts: [{userIdType: 'CPR', userIdValue: '0102364788'}]}
    });
    await mapAttributesToTicket(ctx, ctx, next);
    expect(ctx.session.state.ticket.attributes).toEqual({birthYear: '2036'});

    ctx.setState({
      culr: {accounts: [{userIdType: 'CPR', userIdValue: '0102374788'}]}
    });
    await mapAttributesToTicket(ctx, ctx, next);
    expect(ctx.session.state.ticket.attributes).toEqual({birthYear: '1937'});

    ctx.setState({
      culr: {accounts: [{userIdType: 'CPR', userIdValue: '0102575788'}]}
    });
    await mapAttributesToTicket(ctx, ctx, next);
    expect(ctx.session.state.ticket.attributes).toEqual({birthYear: '2057'});

    ctx.setState({
      culr: {accounts: [{userIdType: 'CPR', userIdValue: '0102585788'}]}
    });
    await mapAttributesToTicket(ctx, ctx, next);
    expect(ctx.session.state.ticket.attributes).toEqual({birthYear: '1858'});
  });

  it('map gender', async () => {
    const ctx = mockContext();
    ctx.setState({
      culr: {accounts: [{userIdType: 'CPR', userIdValue: '0102036788'}]},
      serviceClient: {
        attributes: {gender: {}}
      },
      ticket: {}
    });
    await mapAttributesToTicket(ctx, ctx, next);
    expect(ctx.session.state.ticket.attributes).toEqual({
      gender: 'f'
    });
  });

  it('map invalid cpr', async () => {
    const ctx = mockContext();
    ctx.setState({
      culr: {accounts: [{userIdType: 'CPR', userIdValue: '0123456789'}]},
      serviceClient: {
        attributes: {birthDate: {}, birthYear: {}, gender: {}, cpr: {}}
      },
      ticket: {}
    });
    await mapAttributesToTicket(ctx, ctx, next);
    expect(ctx.session.state.ticket.attributes).toEqual({
      birthDate: null,
      birthYear: null,
      gender: null,
      cpr: '0123456789'
    });
  });

  it('map libraries only values', async () => {
    const ctx = mockContext();
    ctx.setState({
      culr: culr,
      serviceClient: {
        attributes: {libraries: {}}
      },
      ticket: {}
    });

    await mapAttributesToTicket(ctx, ctx, next);
    expect(ctx.session.state.ticket.attributes).toEqual({
      agencies: [
        {agencyId: '000111', userId: '0102456789', userIdType: 'CPR'},
        {agencyId: '111222', userId: '222333', userIdType: 'LOCAL-1'}
      ]
    });
  });

  it('map response from culr missing municipality', async () => {
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

    await mapAttributesToTicket(ctx, ctx, next);
    expect(ctx.session.state.ticket.attributes).toEqual({
      agencies: [
        {agencyId: '000111', userId: '0102456789', userIdType: 'CPR'},
        {agencyId: '111222', userId: '222333', userIdType: 'LOCAL-1'}
      ],
      municipality: null
    });
  });

  it('log an error for unknown attribute', async () => {
    log.error = jest.fn();
    const ctx = mockContext();
    ctx.setState({
      culr: {accounts: [{userIdType: 'CPR', userIdValue: '0102036788'}]},
      serviceClient: {
        attributes: {notThere: {}}
      },
      ticket: {}
    });
    await mapAttributesToTicket(ctx, ctx, next);
    expect(ctx.session.state.ticket.attributes).toEqual({});
    expect(log.error).toBeCalledWith('Cannot map attribute: notThere');
  });
});
