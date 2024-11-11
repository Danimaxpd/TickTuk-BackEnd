import { FastifyInstance } from "fastify";

export default async function authRoutes(fastify: FastifyInstance) {
  fastify.post(
    "/auth/token",
    {
      schema: {
        description: "Generate a new authentication token using API key",
        tags: ["Authentication"],
        body: {
          type: "object",
          required: ["apiKey"],
          properties: {
            apiKey: {
              type: "string",
              description: "API key for authentication",
            },
          },
        },
        response: {
          200: {
            description: "Successfully generated token",
            type: "object",
            properties: {
              token: {
                type: "string",
                description: "JWT token for subsequent requests",
              },
            },
          },
          401: {
            description: "Invalid API key",
            type: "object",
            properties: {
              error: { type: "string" },
            },
          },
        },
      },
    },
    async (request, reply) => {
      const { apiKey } = request.body as { apiKey: string };

      if (!process.env.API_KEY) {
        throw new Error("API_KEY is not defined in environment");
      }

      if (apiKey !== process.env.API_KEY) {
        reply.code(401).send({ error: "Invalid API key" });
        return;
      }

      const token = fastify.generateFrontendToken();
      return { token };
    },
  );

  fastify.post(
    "/auth/validate",
    {
      schema: {
        description: "Validate an existing token",
        tags: ["Authentication"],
        headers: {
          type: "object",
          required: ["authorization"],
          properties: {
            authorization: {
              type: "string",
              description: "Bearer token",
            },
          },
        },
        response: {
          200: {
            description: "Token is valid",
            type: "object",
            properties: {
              valid: { type: "boolean" },
            },
          },
          401: {
            description: "Invalid or expired token",
            type: "object",
            properties: {
              error: { type: "string" },
              message: { type: "string" },
            },
          },
        },
      },
    },
    async () => {
      return { valid: true };
    },
  );
}
