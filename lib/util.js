const minimatch = require('minimatch');
const isArray = Array.isArray;

const PATH_REGEX = /^([\w+\/]*?)([\w+\.]*\.\w+)$/;

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

module.exports = {

    wrapMatch (rule, url) {

        if (typeof rule === 'string') {
            return rule;
        }
        if (typeof rule === 'object') {
            return rule.to(url, parseUrlPath(url), rule);
        }
        return url;
    },

    match (url, conf) {
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
    },

    isSameOrigin (url, target) {
        return url.host === target.host && url.port === target.port;
    }
};