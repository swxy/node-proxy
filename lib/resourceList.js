/**
 * 静态资源文件列表
 */

const fs = require('fs');
const url = require('url');
const path = require('path');

function resourceList(DOC_ROOT) {
    return (ctx, next) => {
        let pathname = ctx.path;
        let fullpath = path.join(DOC_ROOT, pathname);
        console.log(pathname, fullpath);

        try {
            let stat = fs.statSync(fullpath);

            if (stat.isDirectory()) {
                let html = '';
                let files = fs.readdirSync(fullpath);

                html = '<!doctype html>';
                html += '<html>';
                html += '<head>';
                html += '<link rel="icon" href="/favicon.ico" type="image/x-icon">';
                html += '<title>' + pathname + '</title>';
                html += '</head>';
                html += '<body>';
                html += '<h1> - ' + pathname + '</h1>';
                html += '<div id="file-list">';
                html += '<ul>';

                if (pathname != '/') {
                    html += '<li><a href="' + pathname + (pathname.endsWith('/') ? '..' : '/..') + '">..</a></li>';
                }

                files.forEach(function (item) {
                    var s_url = path.join(pathname, item);
                    html += '<li><a href="' + s_url + '">' + item + '</a></li>';
                });

                html += '</ul>';
                html += '</div>';
                html += '</body>';
                html += '</html>';

                ctx.body = html;
                return;
            }
        }
        catch (e) {
            console.error(e);
        }

        return next();
    }
}

module.exports = resourceList;