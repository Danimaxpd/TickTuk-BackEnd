import { FastifyInstance } from 'fastify';

export default async function authRoutes(fastify: FastifyInstance) {
  fastify.post(
    '/auth/token',
    {
      schema: {
        body: {
          type: 'object',
          required: ['apiKey'],
          properties: {
            apiKey: { type: 'string' },
          },
        },
        response: {
          200: {
            type: 'object',
            properties: {
              token: { type: 'string' },
            },
          },
        },
      },
    },
    async (request, reply) => {
      const { apiKey } = request.body as { apiKey: string };

      if (!process.env.API_KEY) {
        throw new Error('API_KEY is not defined in environment');
      }

      if (apiKey !== process.env.API_KEY) {
        reply.code(401).send({ error: 'Invalid API key' });
        return;
      }

      const token = fastify.generateFrontendToken();
      return { token };
    }
  );

  fastify.post(
    '/auth/validate',
    {
      onRequest: [(request, reply) => fastify.authenticate(request, reply)],
      schema: {
        response: {
          200: {
            type: 'object',
            properties: {
              valid: { type: 'boolean' },
            },
          },
        },
      },
    },
    async () => {
      return { valid: true };
    }
  );
}
