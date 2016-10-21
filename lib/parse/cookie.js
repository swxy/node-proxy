const log = require('../log');
const _ = require('../util');

function cookie(ctx) {
    const cookieHeader = ctx.headers.cookie;
    if (cookieHeader) {
        log.notice(`parse request < ${ctx.url} > cookie `);
        log.table(_.parseCookie(cookieHeader));
    }
}

module.exports = cookie;