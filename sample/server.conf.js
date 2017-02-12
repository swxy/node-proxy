module.exports = {
    map: {
        // web打开时配置icon
        '/favicon.ico': '/static/img/favicon.ico',
        '/a.css': '/static/css/b.css'
    },
    rules: [
        {
            match: /^\/css\/.*/,
            to: function (url) {
                return '/static' + url;
            }
        }
    ]
};