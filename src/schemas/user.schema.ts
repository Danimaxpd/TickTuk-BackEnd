export const userSchema = {
  type: 'object',
  required: ['firstName', 'lastName', 'email', 'password'],
  properties: {
    firstName: { type: 'string' },
    lastName: { type: 'string' },
    email: { type: 'string', format: 'email' },
    password: { type: 'string', minLength: 6 }
  }
} as const;

export const userResponseSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    firstName: { type: 'string' },
    lastName: { type: 'string' },
    email: { type: 'string' },
    createdAt: { type: 'string' }
  }
} as const; 