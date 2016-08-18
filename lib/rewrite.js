const fs = require('fs');
const parseUrl = require('url').parse;
const httpProxy = require('http-proxy');
const thunkify = require('thunkify');
const util = require('./util.js');
const ruleRegx = /^(rewrite|redirect|proxy)\s+([^\s]+)\s+([^\s]+)$/i;

function rewriteParser(file) {
    let rules = new Set();

    if (!Array.isArray(file)) {
        file = [file];
    }

    file.forEach(function (fileItem) {
        if (!fs.existsSync(fileItem)) {
            return;
        }
        const content = fs.readFileSync(fileItem, 'utf-8');
        const lines = content.split(/\r\n|\n/);
        lines.forEach((line) => {
            let m = ruleRegx.exec(line);
            if (m) {
                rules.add({
                    type: m[1].toLowerCase(),
                    reg: new RegExp(m[2], 'i'),
                    to: m[3]
                })
            }
        });

    });

    return {
        match (url) {
            let found;
            const urlPath = url.path;
            for (let rule of rules.values()) {
                let m = urlPath.match(rule.reg);
                if (m) {
                    found = rule;
                    found.match = m;
                    break;
                }
            }
            return found;
        }
    }
}

module.exports = (options) => {
    const file = options.rewrite_file;
    const parser = rewriteParser(file);

    const proxy = httpProxy.createProxyServer({
        changeOrigin: true,
        autoRewrite: true
    });

    //const web = thunkify(proxy.web);
    
    proxy.on('error',  (error, req, res) => {
        console.error('proxy error');
    });

    return function* rewrite(ctx, next) {
        const url = parseUrl(ctx.url);
        const ruler = parser && parser.match(url);

        if (ruler) {
            var to = ruler.to.replace(/\$(\d+)/g, function(all, index) {
                return ruler.match[index] || '';
            });
            switch (ruler.type) {
                case 'rewrite':
                    ctx.originalUrl = req.originalUrl || ctx.url;
                    ctx.url = to;
                    break;
                case 'proxy':
                    var target = parseUrl(to);
                    ctx.originalUrl = ctx.originalUrl || ctx.url;
                    ctx.url = target.path + (target.search ? (url.query ? ('&' + url.query) : '') : url.search || '');

                    yield new Promise((resolve) => {
                        proxy.web(ctx.req, ctx.res, {
                            target: target.protocol + '//' + target.host
                        }, (e) => {
                            console.log('callback');
                            //resolve(e);
                        });
                    });

                    return;

                case 'redirect':
                default:
                    ctx.redirect(to);
                    return;
            }
        }
        return yield next();
    }
};