const { Socket } = require('dgram');
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const port = process.env.PORT || 3000; // Puedes cambiar 3000 por el puerto que desees
const path = require('path')
const io = require('socket.io')(http);

http.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});


io.on('connection', (socket) => {
  console.log('Un usuario se ha conectado');

  socket.on('start_talking', () => {
    socket.broadcast.emit('user_talking', socket.id);
  });

  socket.on('stop_talking', () => {
    socket.broadcast.emit('user_stopped_talking', socket.id);
  });

  socket.on('audio_stream', (audioData) => {
    socket.broadcast.emit('audio_stream', audioData);
  });

  socket.on('disconnect', () => {
    console.log('Un usuario se ha desconectado');
  });

  socket.on('message', (data) => {
    console.log('Mensaje recibido:', data);
  });

});

// app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'views'));

// app.get('/', (req, res) => {
//   res.render('index', { messages: [] }); // Inicialmente, la lista de mensajes está vacía
// });

// app.use(express.static(path.join(__dirname, 'public')))
//   .set('views', path.join(__dirname, 'views'))
//   .set('view engine', 'ejs');

// app.get('/', (req, res) => {
//   res.render('index');
// });

// app.get('/api', (req, res) => {
//   res.json({"msg": "Hello world"});
// });