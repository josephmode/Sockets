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
      try {
        // Suponiendo un encabezado WAV de 44 bytes (ajusta según el formato)
        const chunkId = audioData.toString('ascii', 0, 4);
        const format = audioData.toString('ascii', 8, 12);
        const subchunk1Size = audioData.readUInt32LE(16);
        const audioFormat = audioData.readUInt16LE(20);
        const numChannels = audioData.readUInt16LE(22);
        const sampleRate = audioData.readUInt32LE(24);
        const byteRate = audioData.readUInt32LE(28);
        const blockAlign = audioData.readUInt16LE(32);
        const bitsPerSample = audioData.readUInt16LE(34);

        console.log('Chunk ID:', chunkId);
        console.log('Format:', format);
        console.log('Subchunk1Size:', subchunk1Size);
        console.log('AudioFormat:', audioFormat);
        console.log('NumChannels:', numChannels);
        console.log('SampleRate:', sampleRate);
        console.log('ByteRate:', byteRate);
        console.log('BlockAlign:', blockAlign);
        console.log('BitsPerSample:', bitsPerSample);


        // socket.broadcast.emit('audio-stream', audioData);
        // console.log('Received audio data:', audioData); // Imprime los datos completos para análisis
        // console.log('Data length:', audioData.length);
        // console.log('First 10 bytes:', audioData.slice(0, 10).toString('hex')); // Imprime los primeros bytes para inspeccionar el encabezado
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