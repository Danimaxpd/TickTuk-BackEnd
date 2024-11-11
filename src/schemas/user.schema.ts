export const userSchema = {
  type: "object",
  required: ["firstName", "lastName", "email", "password"],
  properties: {
    firstName: { type: "string" },
    lastName: { type: "string" },
    gender: { type: "string" },
    description: { type: "string" },
    email: { type: "string", format: "email" },
    password: { type: "string", minLength: 6 },
  },
} as const;

export const userResponseSchema = {
  type: "object",
  properties: {
    id: {
      type: "string",
      description: "Unique identifier for the user",
    },
    firstName: { type: "string" },
    lastName: { type: "string" },
    gender: { type: "string" },
    description: { type: "string" },
    email: { type: "string" },
    createdAt: { type: "string", format: "date-time" },
  },
  required: ["id", "firstName", "lastName", "email", "createdAt"],
} as const;
