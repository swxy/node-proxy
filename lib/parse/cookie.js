const log = require('../log');
const _ = require('../util');

function cookie(ctx) {
    const cookieHeader = ctx.headers.cookie;
    if (cookieHeader) {
        log.table(_.parseCookie(cookieHeader));
    }
}

module.exports = cookie;