/**
 * @file koa server
 * @author swxy
 */
require('babel-register')({
    plugins: ['transform-async-to-generator']
});

const Koa = require('koa');
const path = require('path');
const co = require('co');
const app = new Koa();
const rewrite = require('./lib/rewrite');

app.use(co.wrap(rewrite({
    rewrite_file: path.join(process.cwd(), './test/rewrite/server.conf.js')
})));

app.use(ctx => {
    ctx.body = 'Hello Koa';
});

app.listen(3000);