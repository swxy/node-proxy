const fs = require('fs');
const path = require('path');
const parseUrl = require('url').parse;
const proxy = require('./httpProxy');
const _ = require('./util.js');
const log = require('./logger');
const WebSocket = require('./websocket');
let conf;

module.exports = (options) => {
    const filePath = options.confFile;

    if (!fs.existsSync(path.resolve(filePath))) {
        throw new Error(`rewrite: configure file [${filePath}] not found`);
    }

    conf = require(path.resolve(filePath));

    return async (ctx, next) => {
        log.debug('proxy detect: ' + ctx.url);
        const url = parseUrl(ctx.url);
        const matchRule = _.match(url, conf);
        const ruleMatched = _.wrapMatch(matchRule, ctx.url);

        if (matchRule  && ruleMatched !== url.path) {

            log.debug(`rewrite ruleMatched: ${ruleMatched}`);

            const target = parseUrl(ruleMatched);
            const protocol = target.protocol || url.protocol;
            const host = target.host || url.host;
            ctx.originalUrl = ctx.originalUrl || ctx.url;
            ctx.url = target.path + (target.search ? (url.query ? ('&' + url.query) : '') : url.search || '');

            if (_.isSameOrigin(url, target)) {
                log.debug(`same origin: the target path ${target.path} & url path ${url.path}`);
                ctx.path = target.path;
                return next();
            }
            WebSocket.emit(ctx.headers);
            await new Promise((resolve) => {
                proxy.web(ctx.req, ctx.res, {
                    target: protocol + '//' + host
                }, (e) => {
                    log.debug('callback');
                });
            });
        }
        return next();
    }
};