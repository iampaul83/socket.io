var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var uuid = require('node-uuid');

var persons = 0;
var personList = {};

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
  person('conn');
  var id = uuid.v1();
  socket.emit('id', id);
  socket.on('disconnect', function () {
    person('disconn');
    io.emit('del-person', id);
  });
  socket.on('name', function(data) {
    personList[id] = data;
    io.emit('new-name', {id: id, name: data});
  });
});


server.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});

function person(st) {
  if(st === 'conn') {
    persons += 1;
  }else {
   persons -= 1;
  }
  io.emit('person', persons);
}
