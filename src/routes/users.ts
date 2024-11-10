import { FastifyPluginAsync } from 'fastify';
import { UserService } from '../services/user.service';
import { userSchema, userResponseSchema } from '../schemas/user.schema';
import { User } from '../models/user.model';
import fp from 'fastify-plugin';

interface CreateUserBody extends Omit<User, 'createdAt'> {}

const userRoutes: FastifyPluginAsync = fp(async (fastify) => {
  const userService = new UserService();

  fastify.post<{ Body: CreateUserBody }>('/users', {
    schema: {
      body: userSchema,
      response: {
        201: userResponseSchema
      }
    },
    preHandler: fastify.authenticate ? [fastify.authenticate] : undefined,
    handler: async (request, reply) => {
      const user = await userService.createUser(request.body);
      reply.code(201).send(user);
    }
  });

  fastify.get('/users', {
    schema: {
      response: {
        200: {
          type: 'array',
          items: userResponseSchema
        }
      }
    },
    preHandler: fastify.authenticate ? [fastify.authenticate] : undefined,
    handler: async (_request, reply) => {
      const users = await userService.getAllUsers();
      reply.send(users);
    }
  });

  fastify.delete<{ Params: { id: string } }>('/users/:id', {
    schema: {
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' }
        },
        required: ['id']
      }
    },
    preHandler: fastify.authenticate ? [fastify.authenticate] : undefined,
    handler: async (request, reply) => {
      const success = await userService.deleteUser(request.params.id);
      if (!success) {
        reply.code(404).send({ message: 'User not found' });
        return;
      }
      reply.code(204).send();
    }
  });
});

export default userRoutes; 