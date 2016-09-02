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

const wrapperRequire = require('./lib/wrapperRequire');
//const rewrite = wrapperRequire({modulePath:'./lib/rewrite', name: ''});

/*
app.use(co.wrap(rewrite.name({
    rewrite_file: path.join(process.cwd(), './test/rewrite/server.conf.js')
})));
*/

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

// 在接收到关闭信号的时候，关闭所有的 socket 连接。
(function(server) {
    var sockets = [];

    server.on('connection', function (socket) {
        sockets.push(socket);

        socket.on('close', function() {
            var idx = sockets.indexOf(socket);
            ~idx && sockets.splice(idx, 1);
        });
    });

    var finalize = function() {
        // Disconnect from cluster master
        process.disconnect && process.disconnect();
        process.exit(0);
    };

    // 关掉服务。
    process.on('SIGTERM', function() {
        console.log(' Recive quit signal in worker %s.', process.pid);
        sockets.length ? sockets.forEach(function(socket) {
            socket.destroy();
            finalize();
        }): server.close(finalize);
    });
})(app);