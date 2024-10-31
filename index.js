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

  // Manejar evento 'message' enviado desde el cliente
  socket.on('message', (data) => {
    console.log('Mensaje recibido:', data);

    // Enviar respuesta al cliente
    socket.emit('response', `Servidor recibió: ${data}`);
  });

  socket.on('audio-stream', (audioData) => {
    // Asegúrate de que audioData es un Buffer o ArrayBuffer
    if (Buffer.isBuffer(audioData)) {
      const header = audioData.slice(0, 44); // Suponiendo que el encabezado es de 44 bytes
  
      // Verificar el encabezado
      console.log('Header:', header);
      const riff = header.toString('ascii', 0, 4);
      const wave = header.toString('ascii', 8, 12);
      const audioFormat = header.readUInt16LE(20);
      const numChannels = header.readUInt16LE(22);
      const sampleRate = header.readUInt32LE(24);
      const bitsPerSample = header.readUInt16LE(34);

      console.log(`RIFF: ${riff}, WAVE: ${wave}, Format: ${audioFormat}, Channels: ${numChannels}, SampleRate: ${sampleRate}, BitsPerSample: ${bitsPerSample}`);
  
      if (riff === 'RIFF' && wave === 'WAVE' && audioFormat === 1 && numChannels === 1 && sampleRate === 44100 && bitsPerSample === 16) {
        console.log('Audio es PCM16 WAV.');
        // Procesar el audio
        socket.broadcast.emit('audio-stream', audioData);
      } else {
        //console.log('El formato de audio no es PCM16 WAV.');
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
  res.json({"msg": "Hello world"});
});