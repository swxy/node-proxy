module.exports = {
    map: {
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