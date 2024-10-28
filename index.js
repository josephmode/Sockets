const express = require('express');
const app = express();
const https = require('https');
const fs = require('fs');
const path = require('path');
const options = {
    key: fs.readFileSync('/etc/letsencrypt/live/sockete.ddns.net/privkey.pem'), // Ruta a tu clave privada
    cert: fs.readFileSync('/etc/letsencrypt/live/sockete.ddns.net/fullchain.pem') // Ruta a tu certificado
};

const server = https.createServer(options, app);
const io = require('socket.io')(server); // Asocia Socket.IO al servidor HTTPS

server.listen(9002, () => {
    console.log('Servidor escuchando en el puerto 9002');
});

// Escuchar cuando un cliente se conecta
io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado');

  // Manejar evento 'message' enviado desde el cliente
  socket.on('message', (data) => {
    console.log('Mensaje recibido:', data);

    // Enviar respuesta al cliente
    socket.emit('response', `Servidor recibió: ${data}`);
  });

  // Escuchar desconexión del cliente
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
  res.json({"msg": "Hello world"});
});