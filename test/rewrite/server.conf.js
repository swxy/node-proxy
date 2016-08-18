module.exports = {
    host: '',
    map: {
        '/test': 'http://www.tuicool.com'
    },
    regex: [
        {
            match: /^\/static\//,
            to: ''
        }
    ]
    
};