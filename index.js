const express = require('express')
const socket = require('socket.io');
const http = require('http');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = socket(server);

app.use('/css', express.static('./static/css'))
app.use('/js', express.static('./static/js'))


app.get('/', (req, res) => {
  fs.readFile('./static/index.html', function(err, data) {
    if(err) 
      res.send(err)
    else {
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write(data);
      res.end();
    }
  })
})


io.sockets.on('connection', function(socket) {

  // 접속 
  socket.on('newUser', (name) => {
    console.log(`${name}님이 접속하셨습니다.`);
    socket.name = name;
    io.sockets.emit('update', {type: 'connect', name: 'SERVER', message: `${name}님이 접속하셨니다.`});
  })

  // 메시지 전송 
  socket.on('message', function(data) {
    data.name = socket.name
    socket.broadcast.emit('update', data);
  })

  // 접속 종료 
  socket.on('disconnect', function() {
    console.log(socket.name + '님이 나가셨습니다.')
    socket.broadcast.emit('update', {type: 'disconnect', name: 'SERVER', message: socket.name + '님이 나가셨습니다.'});
  })
})


server.listen(5000, function() {
  console.log(`Server Running on 5000`);
})