/**
 * @file
 * Session relevant middleware
 */

import {CONFIG} from '../utils/config.util';
import {Store} from 'koa-session2';


/**
 * Handles sessions.
 *
 * Is a modification of koa-session2, to support remember-me functionality
 * @see https://github.com/Secbone/koa-session2/blob/master/index.js
 *
 * @param opts
 * @returns {Function}
 */
export default function session(opts = {}) {
  opts.key = opts.key || 'koa:sess';
  opts.store = opts.store || new Store();

  return async function (ctx, next) {
    let id = ctx.cookies.get(opts.key, opts);

    if (!id) {
      ctx.session = {};
    }
    else {
      ctx.session = await opts.store.get(id);
      // check session should be a no-null object
      if (typeof ctx.session !== 'object' || ctx.session === null) {
        ctx.session = {};
      }
    }

    let old = JSON.stringify(ctx.session);

    await next();

    // if not changed
    if (old === JSON.stringify(ctx.session)) {
      return;
    }

    // clear old session if exists
    if (id) {
      await opts.store.destroy(id);
      id = null;
    }

    // set new session
    if (ctx.session && Object.keys(ctx.session).length) {
      let sid = await opts.store.set(ctx.session, Object.assign({}, opts, {sid: id}));
      const maxAge = ctx.session.rememberMe && CONFIG.session.life_time || null;
      ctx.cookies.set(opts.key, sid, Object.assign({}, opts, {maxAge}));
    }
  };
}
