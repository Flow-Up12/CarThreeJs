import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
const server = createServer(app);

app.use(cors({
  origin: 'http://localhost:3000', // Replace with your Vite app's URL
  methods: ['GET', 'POST']
}));

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000', // Replace with your Vite app's URL
    methods: ['GET', 'POST']
  }
});

const cars = {}; // Object to store car states keyed by socket ID

app.get('/', (req, res) => {
  const carCount = Object.keys(cars).length;
  res.send(`Server is running. Number of cars connected: ${carCount}`);
});

io.on('connection', (socket) => {
  console.log('a user connected', socket.id);

  // Initialize car state for the new connection
  cars[socket.id] = {
    position: [0, 0.5, 0],
    rotation: [0, 0, 0],
  };

  // Send existing car states to the new client
  socket.emit('initialize', cars);

  // Broadcast the new car state to other clients
  socket.broadcast.emit('newCar', { id: socket.id, state: cars[socket.id] });

  socket.on('updateCar', (data) => {
    cars[socket.id] = data; // Update car state
    socket.broadcast.emit('updateCar', { id: socket.id, state: data });
  });

  socket.on('disconnect', () => {
    console.log('user disconnected', socket.id);
    delete cars[socket.id]; // Remove car state
    io.emit('removeCar', socket.id); // Notify clients to remove the car
  });
});

server.listen(4000, () => {
  console.log('listening on *:4000');
});