/* eslint-disable */

const model = {
  // We support returning promises.
  getAccessToken: function() {
    console.log('getAcc');
    return new Promise('works!');
  },

  // Or, calling a Node-style callback.
  getAuthorizationCode: function(done) {
    console.log('getAuth', done);
    done(null, 'works!');
  },

  saveAuthorizationCode: function(done) {
    console.log('saveAuth', done);
    done(null, 'works!');
  },

  // Or, using generators.
  getClient: function*(a, b) {
    console.log('getClient', a, b);
    yield somethingAsync();
    return 'works!';
  },

  // Or, async/wait (using Babel).
  getUser: async function() {
    console.log('getUser');
    await somethingAsync();
    return 'works!';
  }
};

export default model;
