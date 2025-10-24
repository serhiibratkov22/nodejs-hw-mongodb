// src/server.js
import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import router from './routers/index.js';
import initMongoConnection from './db/initMongoConnection.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import cookieParser from 'cookie-parser';

import { swaggerDocs } from './middlewares/swaggerDocs.js';
import { UPLOAD_DIR } from './constants/index.js';

const setupServer = async () => {
  const app = express();

  app.use(
    express.json({
      type: ['application/json', 'application/vnd.api+json'],
      limit: '100kb',
    }),
  );
  app.use(cors());
  app.use(cookieParser());
  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.get('/', (req, res) => {
    res.json({
      message: 'Hello World!',
    });
  });

  app.use('/uploads', express.static(UPLOAD_DIR));
  app.use('/api-docs', swaggerDocs());

  app.use(router);
  app.use(notFoundHandler);
  app.use(errorHandler);

  const PORT = process.env.PORT || 3000;

  try {
    await initMongoConnection();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(
        `Swagger docs available at http://localhost:${PORT}/api-docs`,
      );
    });
  } catch (error) {
    console.error('Error connecting database', error);
    process.exit(1);
  }
};

export default setupServer;
