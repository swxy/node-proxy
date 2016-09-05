module.exports = {
    map: {
        '/tuicool': 'http://www.tuicool.com',
        '/topics': 'http://www.tuicool.com/topics'
    },
    rules: [
        {
            match: /^\/assets\//,
            to: 'http://static0.tuicool.com/'
        },
        {
            match: /^\/static\/.*/,
            to: function (url, pathObj) {
                return '/test/www' + pathObj.path + 'css/' + pathObj.name;
            }
        },
        {
            match: /\/sc\/pc\/deal\/getProductTypeAndCategory\?dealId=20940264/,
            to: function (path) {
                return 'http://mct.y.nuomi.com' + path;
            }
        }
    ]
    
};