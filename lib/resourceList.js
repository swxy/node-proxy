/**
 * 静态资源文件列表
 */

const fs = require('fs');
const url = require('url');
const path = require('path');
const log = require('./log');

function resourceList(DOC_ROOT) {
    return (ctx, next) => {
        let pathname = ctx.path;
        let fullpath = path.join(DOC_ROOT, pathname);
        log.notice(`resourceList: ${pathname} -> ${fullpath}`);

        try {
            let stat = fs.statSync(fullpath);

            if (stat.isDirectory()) {
                let files = fs.readdirSync(fullpath);
                let html = `<!doctype html><html><head>
                <link rel="icon" href="/favicon.ico" type="image/x-icon">
                <title>${pathname}</title></head><body><h1> - ${pathname}</h1>
                <div id="file-list"><ul>`;

                if (pathname != '/') {
                    html += '<li><a href="' + pathname + (pathname.endsWith('/') ? '..' : '/..') + '">..</a></li>';
                }

                files.forEach(function (item) {
                    var s_url = path.join(pathname, item);
                    html += '<li><a href="' + s_url + '">' + item + '</a></li>';
                });

                html += '</ul></div></body></html>';
                ctx.body = html;
                return;
            }
        }
        catch (e) {
            //console.error(e);
        }

        return next();
    }
}

module.exports = resourceList;