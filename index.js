const { Socket } = require('dgram');
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const port = process.env.PORT || 9002; // Puedes cambiar 3000 por el puerto que desees
const path = require('path')
const io = require('socket.io')(http);

http.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});

// Escuchar cuando un cliente se conecta
io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado');

  // Enviar mensajes de señalización entre pares
  socket.on('signal', (data) => {
    console.log('Señal recibida:', data);
    socket.broadcast.emit('signal', data); // Reenvía la señal a otros clientes
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
  res.render('index', { messages: [] }); // Inicialmente, la lista de mensajes está vacía
});

app.use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/api', (req, res) => {
  res.json({ "msg": "Hello world" });
});