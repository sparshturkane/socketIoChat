// importing dependencies
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

// declaring arrays
users=[];
connections = [];

// listening to port 3000 and console logging
server.listen(process.env.PORT || 3000);
console.log("http://localhost:3000");

// app.get displays get response from root location '/'
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

// on connection to socket
io.sockets.on('connection', function(socket) {
    connections.push(socket);
    console.log('Connected: %s sockets connected', connections.length);

    //disconnect
    socket.on('disconnect',function(data) {
        connections.splice(connections.indexOf(socket), 1);
        console.log('Disconnected: %s sockets connected', connections.length);
    });

    // send message (catching emitted 'send message')
    socket.on('send message', function(data) {
        console.log(data);
        // emiting 'new message' to display in html
        io.sockets.emit('new message', {msg: data});
    });

    // geting userName from client
    socket.on('user name', function(data) {
        console.log(data);
        users.push(data);
        io.sockets.emit('new user', {users: users});
    });
});
