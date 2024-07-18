const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const userRoutes = require('./routes/userRoutes');

const errorHandler = require('./middlewares/errorHandler');

const { PORT, MONGODB_URI } = require('./config');

const app = express();
app.use(helmet());

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB database');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err.message);
  });

app.use(express.json());

app.use(cors()); // should be confirued in production
// app.use(cors({
//   origin: '*', // add allowed origins only in production
//   methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
// }));

app.use('/users', userRoutes);


app.use('*', (req, res) => {
  res.status(404).send('Not found');
});

app.use(errorHandler);

process.on('uncaughtException', (exception) => {
  console.error('Uncaught exception occurred:\n', exception);
  // here use process.exit(1); and use process manager to restart at any stop in deployment phase.
});
process.on('unhandledRejection', (exception) => {
  console.error('unhandled Rejection occurred:\n', exception);
  // here use process.exit(1); and use process manager to restart at any stop in deployment phase.
});

const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Handle termination signals for graceful shutdown
function shutdown() {
  server.close((err) => {
    if (err) {
      console.error(`Error closing server: ${err}`);
      process.exit(1);
    }
    console.log('Server closed gracefully');
    process.exit(0);
  });
}

process.on('SIGINT', () => {
  console.log('Received SIGINT signal. Closing server gracefully...');
  shutdown();
});

process.on('SIGTERM', () => {
  console.log('Received SIGTERM signal. Closing server gracefully...');
  shutdown();
});
