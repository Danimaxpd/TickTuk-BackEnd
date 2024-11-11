import Fastify from 'fastify';
import cors from '@fastify/cors';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import jwt from '@fastify/jwt';
import authPlugin from './plugins/auth';
import userRoutes from './routes/users';
import mongoose from 'mongoose';
import authRoutes from './routes/auth';

const fastify = Fastify({
  logger: true,
});

const swaggerOptions = {
  swagger: {
    info: {
      title: 'User Management API',
      description: 'API documentation for User Management Service',
      version: '1.0.0',
    },
    host: 'localhost', // Domain port is defined in docker-compose.yml
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json'],
  },
};

const start = async (): Promise<void> => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined');
    }
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    fastify.log.info('MongoDB connected successfully');

    // Register plugins
    await fastify.register(cors);
    await fastify.register(swagger, swaggerOptions);
    await fastify.register(swaggerUi, {
      routePrefix: '/documentation',
      uiConfig: {
        docExpansion: 'full',
        deepLinking: false,
      },
    });

    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined');
    }

    await fastify.register(jwt, {
      secret: process.env.JWT_SECRET,
    });

    await fastify.register(authPlugin);
    await fastify.register(authRoutes);
    await fastify.register(userRoutes);

    // Start server
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
    fastify.log.info('Server is running on port 3000');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

// Handle graceful shutdown
const gracefulShutdown = async (): Promise<void> => {
  try {
    await fastify.close();
    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

start();
