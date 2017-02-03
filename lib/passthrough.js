/**
 * 静态资源文件列表
 */

const fs = require('fs');
const url = require('url');
const path = require('path');
const httpProxy = require('http-proxy');
const proxy = require('./httpProxy');
const log = require('./logger');
const cookie = require('./parse/cookie');
const params = require('./parse/params');

function passThrough() {

    return async (ctx, next) => {
        // cookie(ctx);
        // params(ctx);
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