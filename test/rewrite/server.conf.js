module.exports = {
    map: {
        '/test': 'http://www.tuicool.com',
        '/topics': 'http://www.tuicool.com/topics'
    },
    regex: [
        {
            match: /^\/assets\//,
            to: 'http://static0.tuicool.com/'
        },
        {
            match: /^\/static\//,
            to: function (path) {
                return '/public' + path;
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