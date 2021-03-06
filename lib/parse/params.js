const log = require('../logger');
const _ = require('../util');

function params(ctx) {
    log.notice(`parse request < ${ctx.url} > query string: `);
    log.table(ctx.query);
}

module.exports = params;