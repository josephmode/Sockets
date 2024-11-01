const { Socket } = require('dgram');
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const port = process.env.PORT || 9002; // Puedes cambiar 3000 por el puerto que desees
const path = require('path')
const io = require('socket.io')(http);
const WavHeader = require('wav-headers');

http.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
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

  socket.on('audio-stream', (audioData) => {
    if (Buffer.isBuffer(audioData)) {
      try {
        const header = WavHeader.decode(audioData);
        console.log('Audio format:', header.format);
        console.log('Number of channels:', header.channels);
        console.log('Sample rate:', header.sampleRate);
        console.log('Bit depth:', header.bitsPerSample);
        console.log('Duration (seconds):', audioData.length / (header.sampleRate * header.channels * header.bitsPerSample / 8));
        socket.broadcast.emit('audio-stream', audioData);
      } catch (error) {
        console.error('Error al decodificar el audio:', error);
      }
    } else {
      console.log('Los datos de audio no son un Buffer.');
    }
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
  res.json({ "msg": "Hello world" });
});