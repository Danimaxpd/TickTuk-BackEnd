import fp from 'fastify-plugin';
import { FastifyPluginAsync, FastifyRequest, FastifyReply } from 'fastify';

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (
      request: FastifyRequest,
      reply: FastifyReply
    ) => Promise<void>;
    generateFrontendToken: () => string;
  }
}

const authPlugin: FastifyPluginAsync = async (fastify) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }

  const authenticate = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const authHeader = request.headers.authorization;
      if (!authHeader) {
        throw new Error('Missing authorization header');
      }

      const [bearer, token] = authHeader.split(' ');
      if (bearer !== 'Bearer' || !token) {
        throw new Error('Invalid authorization format');
      }

      fastify.jwt.verify(token);

      const decoded = fastify.jwt.decode(token);
      if (
        decoded &&
        typeof decoded === 'object' &&
        'type' in decoded &&
        decoded.type !== 'frontend'
      ) {
        throw new Error('Invalid token type');
      }
    } catch (err) {
      reply.code(401).send({
        error: 'Unauthorized',
        message: err instanceof Error ? err.message : 'Authentication failed',
      });
    }
  };

  fastify.decorate('authenticate', authenticate);
  fastify.decorate('generateFrontendToken', () => {
    return fastify.jwt.sign({
      type: 'frontend',
      timestamp: Date.now(),
      expiresIn: Math.floor(Date.now() / 1000) + 3600, // 1 hour
    });
  });
};

export default fp(authPlugin, {
  name: 'auth-plugin',
});
