/**
 * 静态资源文件列表
 */

const fs = require('fs');
const url = require('url');
const path = require('path');
const httpProxy = require('http-proxy');
const log = require('./log');

function passThrough(DOC_ROOT) {
    const proxy = httpProxy.createProxyServer({
        changeOrigin: true,
        autoRewrite: true
    });

    proxy.on('error',  (error, req, res) => {
        log.error('rewrite: proxy error');
        if (!res.headerSent) {
            res.writeHead(500, {'Content-Type': 'application/json'});
        }
        res.body = JSON.stringify({
            error: 'proxy_error',
            reason: error.message
        })
    });
    return async (ctx, next) => {
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