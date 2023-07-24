import express from 'express';
import BodyParser from 'body-parser';
import sequelize from './config/database';
import redisClient from './config/redis';

import userRoutes from './routes/userRoutes';
import noteRoutes from './routes/noteRoutes';
import { getAllNotes } from './controllers/noteController';
import { authenticateJWT } from './controllers/userController';

const app = express();
const PORT = process.env.PORT || 3000;

// Parse incoming JSON data
app.use(BodyParser.json());

// Middleware for Redis caching
const cacheMiddleware = (req, res, next) => {
  const key = '__express__' + req.originalUrl || req.url;
  redisClient.get(key, (err, data) => {
    if (data) {
      console.log('Cache hit');
      res.send(data);
    } else {
      res.sendResponse = res.send;
      res.send = (body) => {
        redisClient.set(key, JSON.stringify(body));
        res.sendResponse(body);
      };
      next();
    }
  });
};

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