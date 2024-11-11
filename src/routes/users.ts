import { FastifyPluginAsync } from "fastify";
import { UserService } from "../services/user.service";
import { userSchema, userResponseSchema } from "../schemas/user.schema";
import { User } from "../models/user.model";
import fp from "fastify-plugin";

interface CreateUserBody extends Omit<User, "createdAt"> {}

const userRoutes: FastifyPluginAsync = fp(async (fastify) => {
  const userService = new UserService();

  // Common security schema for all routes
  const securitySchema = {
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
  };

  fastify.post<{ Body: CreateUserBody }>(
    "/users",
    {
      schema: {
        description: "Create a new user",
        tags: ["Users"],
        ...securitySchema,
        body: userSchema,
        response: {
          201: {
            description: "User created successfully",
            ...userResponseSchema,
          },
          401: {
            description: "Unauthorized access",
            type: "object",
            properties: {
              error: { type: "string" },
              message: { type: "string" },
            },
          },
        },
      },
      onRequest: [(request, reply) => fastify.authenticate(request, reply)],
    },
    async (request, reply) => {
      const user = await userService.createUser(request.body);
      reply.code(201).send(user);
    },
  );

  fastify.get(
    "/users",
    {
      schema: {
        description: "Get all users",
        tags: ["Users"],
        ...securitySchema,
        response: {
          200: {
            description: "List of users",
            type: "array",
            items: userResponseSchema,
          },
          401: {
            description: "Unauthorized access",
            type: "object",
            properties: {
              error: { type: "string" },
              message: { type: "string" },
            },
          },
        },
      },
      onRequest: [(request, reply) => fastify.authenticate(request, reply)],
    },
    async (_request, reply) => {
      const users = await userService.getAllUsers();
      reply.send(users);
    },
  );

  fastify.delete<{ Params: { id: string } }>(
    "/users/:id",
    {
      schema: {
        description: "Delete a user by ID",
        tags: ["Users"],
        ...securitySchema,
        params: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description: "User ID to delete",
            },
          },
          required: ["id"],
        },
        response: {
          204: {
            description: "User deleted successfully",
            type: "null",
          },
          401: {
            description: "Unauthorized access",
            type: "object",
            properties: {
              error: { type: "string" },
              message: { type: "string" },
            },
          },
          404: {
            description: "User not found",
            type: "object",
            properties: {
              message: { type: "string" },
            },
          },
        },
      },
      onRequest: [(request, reply) => fastify.authenticate(request, reply)],
    },
    async (request, reply) => {
      const success = await userService.deleteUser(request.params.id);
      if (!success) {
        reply.code(404).send({ message: "User not found" });
        return;
      }
      reply.code(204).send();
    },
  );
});

export default userRoutes;
