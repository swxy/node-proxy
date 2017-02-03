/**
 * @file koa server
 * @author swxy
 */
require('babel-register')({
    plugins: ['transform-async-to-generator']
});

const Koa = require('koa');
const http = require('http');
const path = require('path');
const co = require('co');
const serve = require('koa-static');
const logger = require('koa-logger');
const app = new Koa();

const args = process.argv.slice(2).join('|');
const document_root = path.resolve(/--root[=|\|](.*?)(?:\||$)/.test(args) ? RegExp.$1 : process.cwd());

const conf_file = path.resolve(/(\-f\||\-\-file=)(.*?)(?:\||$)/.test(args) ? RegExp.$2 : path.join(document_root, './server.conf.js'));

const resourceList = require('./lib/resourceList');
const passThrough = require('./lib/passthrough');
const proxy = require('./lib/proxy');

app.use(logger());

app.use(proxy({
    confFile: conf_file
}));

app.use(serve(document_root, {
    index: ['page/index.html', 'index.html']
}));

// app.use(passThrough());
app.use(resourceList(document_root));

app.use(ctx => {
    ctx.body = 'Hello Koa';
});

module.exports = http.createServer(app.callback());

if (!module.parent) {
    app.listen(4000,'0.0.0.0', (port=4000) => {
        console.log(`Listening on http://127.0.0.1:${port}`);
    });
}
