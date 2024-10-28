const { Socket } = require('dgram');
const express = require('express');
const app = express();
const http = require('http');
const https = require('https');
const fs = require('fs');
const options = {
  key: fs.readFileSync('/etc/letsencrypt/live/sockete.ddns.net/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/sockete.ddns.net/fullchain.pem')
};

// Crea el servidor HTTPS
const serverHttps = https.createServer(options, app);
// Crea el servidor HTTP
const serverHttp = http.createServer(app);

//const port = process.env.PORT || 9002; // Puedes cambiar 3000 por el puerto que desees
const path = require('path')
const io = require('socket.io')(http);


serverHttp.on('request', (req, res) => {
  res.writeHead(301, { 'Location': 'https://' + req.headers.host + req.url });
  res.end();
});

serverHttps.listen(443, () => {
  console.log('Servidor HTTPS escuchando en el puerto 443');
});

serverHttp.listen(80, () => {
  console.log('Servidor HTTP escuchando en el puerto 80');
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