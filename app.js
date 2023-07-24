import express from 'express';
import BodyParser from 'body-parser';
import sequelize from './config/database';
import redisClient from './config/redis';

// import { cacheMiddleware } from './helpers/cachemiddleware';
import userRoutes from './routes/userRoutes';
import noteRoutes from './routes/noteRoutes';
import { getNoteById } from './controllers/noteController';
import { authenticateJWT } from './controllers/userController';

const app = express();
const PORT = process.env.PORT || 3000;

// Parse incoming JSON data
app.use(BodyParser.json());

// Middleware for Redis caching
const cacheMiddleware = (req, res, next) => {
  const key = '__express__' + req.originalUrl || req.url;
  console.log('cacheMiddleware => redisClient', Object.keys(redisClient));
  console.log('cacheMiddleware => req.user', req.user);
  console.log('cacheMiddleware => key', key);
  redisClient.get(key, (err, data) => {
    console.log('cacheMiddleware => data', data);
    if (err) {
      console.log('err', err);
      res.status(404).json({ message: err.message, details: err });
    }
    if (data) {
      console.log('Cache hit', data);
      res.send(JSON.parse(data));
      // res.status(201).json(data);
    } else {
      res.sendResponse = res.send;
      res.send = (body) => {
        redisClient.set(key, body);
        res.sendResponse(body);
      };
      next();
    }
  });
};

// Cached routes
app.get('/notes/:noteId', authenticateJWT, cacheMiddleware, getNoteById);

app.use('/users', userRoutes);
app.use('/notes', authenticateJWT, noteRoutes);

sequelize
  .sync({ force: false })
  .then(() => {
    console.log('Database synced');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Unable to sync database:', error);
  });