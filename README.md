# node-proxy
做个node的代理服务器, 完成静态资源服务器,然后支持配置接口转发等。

# 命令行参数
1. 使用 `-f server.conf.js` 或者 `--file=server.conf.js`指定配置文件的路径。
2. 使用 `--root=xx/ddd` 指定server的根目录

# 配置文件

```
module.exports = {
    map: {
        // web打开时配置icon
        '/favicon.ico': '/static/img/favicon.ico'
    },
    rules: [
        {
            match: /^\/css\/.*/,
            to: function (url) { // url 指的是匹配该规则的原始url
                return '/static' + url;
            }
        }
    ]
};
```

首先会遍历`map`下的规则,如果匹配上,则直接应用该规则。如果没有匹配到相关规则,
会遍历`rules`中的配置,然后返回匹配结果。

# 计划
1. 完成request页面展示
2. 可以编辑请求、响应
3. 支持页面配置映射
4. 完成一个插件，捕获页面请求
5. 页面请求代理
