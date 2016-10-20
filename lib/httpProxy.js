const httpProxy = require('http-proxy');

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

module.exports = proxy;