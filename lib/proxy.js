const fs = require('fs');
const path = require('path');
const parseUrl = require('url').parse;
const proxy = require('./httpProxy');
const _ = require('./util.js');
const log = require('./log');
let conf;

module.exports = (options) => {
    const filePath = options.confFile;

    if (!fs.existsSync(path.resolve(filePath))) {
        throw new Error(`rewrite: configure file [${filePath}] not found`);
    }

    conf = require(path.resolve(filePath));

    return async (ctx, next) => {
        const url = parseUrl(ctx.url);
        const matchRule = _.match(url, conf);
        const ruleMatched = _.wrapMatch(matchRule, ctx.url);

        if (matchRule  && ruleMatched !== url.path) {

            log.debug(`rewrite ruleMatched: ${ruleMatched}`);

            const target = parseUrl(ruleMatched);
            ctx.originalUrl = ctx.originalUrl || ctx.url;
            ctx.url = target.path + (target.search ? (url.query ? ('&' + url.query) : '') : url.search || '');

            if (_.isSameOrigin(url, target)) {
                log.debug(`same origin: the target path ${target.path} & url path ${url.path}`);
                ctx.path = target.path;
                return next();
            }

            await new Promise((resolve) => {
                proxy.web(ctx.req, ctx.res, {
                    target: target.protocol + '//' + target.host
                }, (e) => {
                    log.debug('callback');
                });
            });
            return;
        }
        return next();
    }
};