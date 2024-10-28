const { Socket } = require('dgram');
const express = require('express');
//const port = parseInt(process.env.PORT) || process.argv[3] || 8080;
const http = require('http').createServer(app);
const path = require('path')
const io = require('socket.io')(http);
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
const firebaseConfig = {
  apiKey: "AIzaSyCnBHJBbEVmRoL00ud9Bp5V4DAT4K_5S0g",
  authDomain: "pruebas-27523.firebaseapp.com",
  projectId: "pruebas-27523",
  storageBucket: "pruebas-27523.appspot.com",
  messagingSenderId: "980858422543",
  appId: "1:980858422543:web:df5cb34b8a552a4075ea7a",
  measurementId: "G-998WS6E2EK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

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