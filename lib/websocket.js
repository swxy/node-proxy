/**
 * @file 作为一个socket.io包装
 */
const SocketIO = require('socket.io');

let io;

exports.init = function (server) {
    io = SocketIO(server);
    io.on('connection', function(socket){
        socket.emit('news', { hello: 'world' });
        socket.on('event', function(data){
            console.log(data);
            io.sockets.emit('event', data);
        });
        socket.on('disconnect', function(){
            console.log('disconnect');
        });
    });
};

exports.emit = function (msg) {
    io.sockets.emit('message', msg);
};

exports.io = io;