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
const app = new Koa();

app.use(serve('../', {
    index: ['page/index.html', 'index.html']
}));

app.use(ctx => {
    ctx.body = 'test server';
});


if (!module.parent) {
    app.listen(4001,'0.0.0.0', (port=4001) => {
        console.log(`Listening on http://127.0.0.1:${port}`);
    });
}
