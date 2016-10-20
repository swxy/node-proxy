const fs = require('fs');
const path = require('path');
const parseUrl = require('url').parse;
const proxy = require('./httpProxy');
const minimatch = require('minimatch');
const util = require('./util.js');
const log = require('./log');
const isArray = Array.isArray;
const PATH_REGEX = /^([\w+\/]*?)([\w+\.]*\.\w+)$/;
let conf;

function parseUrlPath (urlPath) {
    var match = urlPath.match(PATH_REGEX);
    if (match) {
        return {
            path: match[1],
            name: match[2]
        };
    }
    return {path: urlPath, name: null};
}

function wrapMatch (rule, url) {

    if (typeof rule === 'string') {
        return rule;
    }
    if (typeof rule === 'object') {
        return rule.to(url, parseUrlPath(url), rule);
    }
    return url;
}

function match (url) {
    let found;
    let arr = [url.path, url.pathname];

    if (conf.map && typeof conf.map === 'object') {
        let mapKeys = Object.keys(conf.map);
        mapKeys.every((key) => {
            arr.every(url => {
                if (minimatch(url, key)) {
                    found = conf.map[key];
                    return false;
                }
                return !found;
            });
            return !found;
        });
        if (found) {
            return found;
        }
    }
    if (conf.rules && isArray(conf.rules)) {
        let rules = conf.rules;
        rules.every((rule) => {
            if (!rule.match || !rule.to) {
                return true;
            }
            arr.every(url => {
                if (rule.match instanceof RegExp) {
                    if (rule.match.test(url)) {
                        found = rule;
                        return false;
                    }
                }
                else if (minimatch(url, rule.match)) {
                    found = rule;
                    return false;
                }

                return !found;
            });
            return !found;
        });
    }
    return found;
}

function isSameOrigin (url, target) {
    return url.host === target.host && url.port === target.port;
}

module.exports = (options) => {
    const filePath = options.confFile;

    if (!fs.existsSync(path.resolve(filePath))) {
        throw new Error(`rewrite: configure file [${filePath}] not found`);
    }

    conf = require(path.resolve(filePath));

    return async (ctx, next) => {
        const url = parseUrl(ctx.url);
        const matchRule = match(url);
        const ruleMatched = wrapMatch(matchRule, ctx.url);

        if (matchRule  && ruleMatched !== url.path) {

            log.debug(`rewrite ruleMatched: ${ruleMatched}`);

            const target = parseUrl(ruleMatched);
            ctx.originalUrl = ctx.originalUrl || ctx.url;
            ctx.url = target.path + (target.search ? (url.query ? ('&' + url.query) : '') : url.search || '');

            if (isSameOrigin(url, target)) {
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