/**
 * @file 对于没有匹配上的资源，直接透传
 */

const fs = require('fs');
const url = require('url');
const path = require('path');
const proxy = require('./httpProxy');
const log = require('./logger');
const cookie = require('./parse/cookie');
const params = require('./parse/params');

function passThrough() {

    return async (ctx, next) => {
        // cookie(ctx);
        // params(ctx);
        const urlPath = url.parse(ctx.url).path;
        //if (urlPath.indexOf('socket.io') !== -1 && urlPath.indexOf('socket.io.js') === -1) {
        //    return next();
        //}
        log.debug(`pass through the request: ${ctx.url}`);
        return await new Promise((resolve) => {
            proxy.web(ctx.req, ctx.res, {
                target: ctx.protocol + '://' + ctx.host
            }, (e) => {
                log.error(e);
            });
        });
    }
}

module.exports = passThrough;