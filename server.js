// importing dependencies
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

var mysql = require('mysql');

var dbConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'fbstatus'
});

var pool  = mysql.createPool({
    connectionLimit : 10,
    host            : 'localhost',
    user            : 'root',
    password        : '123456',
    database        : 'fbstatus'
});

dbConnection.connect();
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

        // storing in database
        // INSERT INTO table_name (column1, column2, column3, ...)
        // VALUES (value1, value2, value3, ...);

        // dbConnection.query('INSERT INTO fbstatus (s_text) VALUES (?)', [data], function (error, results, fields) {
        //     // error will be an Error if one occurred during the query
        //     // results will contain the results of the query
        //     // fields will contain information about the returned results fields (if any)
        //     if (error) throw error;
        // });
        // dbConnection.end();

        pool.query('INSERT INTO fbstatus (s_text) VALUES (?)', [data], function (error, results, fields) {
            if (error) throw error;
            // console.log('The solution is: ', rows[0].solution);
        });
    });

    // geting userName from client
    socket.on('user name', function(data) {
        console.log(data);
        users.push(data);
        io.sockets.emit('new user', {users: users});
    });
});
