var express = require('express');
var app = express();

var server = require('http').createServer(app);
var io = require('socket.io')(server);

var cons = require('consolidate');
var swig = require('swig');

var siteRouter = require('./app/routers/siteRouter');

app.use(express.static('app/public'));

app.engine('html', cons.swig);
app.set('view engine', 'html');
app.set('views', __dirname + '/app/views');

//disable cache to see page changes
app.set('view cache', false);
swig.setDefaults({ cache: false });

var port = process.env.port || 8080;

app.use('/', siteRouter);


//Socket.IO Logic

var totUsers = 0;

io.on('connection', function(socket) {
    console.log("Client Connesso alla socket!!");

    var addUser = false;

    socket.on('disconnect',function(){
        console.log("Client disconnesso dalla socket!!");
        totUsers -= 1;
    });

    socket.on('add user', function(data){
        if(addUser) {
            return;
        }

        addUser = true;

        socket.username = data.username;
        totUsers += 1;

        socket.emit('login');
        socket.broadcast.emit('user join', { username: data.username, totUsers: totUsers });

    });

    socket.on('message', function(data){
        socket.broadcast.emit('message',{username: socket.username, message: data.message });
    });


})


server.listen(port);
console.log("Server is listening on port "+port);


