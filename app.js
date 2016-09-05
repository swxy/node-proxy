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
const serve = require('koa-static');
const favicon = require('koa-favicon');
const app = new Koa();

const args = process.argv.join('|');
const document_root = path.resolve(/--root[=|\|](.*?)(?:\||$)/.test(args) ? RegExp.$1 : process.cwd());


const resourceList = require('./lib/resourceList');


const rewrite = require('./lib/rewrite');

app.use(rewrite({
    rewrite_file: path.join(process.cwd(), './test/rewrite/server.conf.js')
}));

app.use(favicon(__dirname + '/public/favicon.ico'));

app.use(serve(document_root, {
    index: ['page/index.html', 'index.html']
}));

app.use(resourceList(document_root));

app.use(ctx => {
    ctx.body = 'Hello Koa';
});

app.listen(3000,'0.0.0.0', (port=3000) => {
    console.log(`Listening on http://127.0.0.1:${port}`);
});
