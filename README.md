# TickTuk User Management Service

A robust microservice built with Fastify and TypeScript for managing user authentication, authorization, and profile management in the TickTuk application.

## 🚀 Features

- User registration and authentication
- JWT-based authorization
- RESTful API endpoints
- Swagger documentation
- MongoDB integration with Typegoose
- Load balancing with Nginx
- Docker containerization
- Clean architecture with repository pattern

## 🛠 Tech Stack

- **Runtime**: Node.js (>=20.0.0)
- **Framework**: Fastify
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose & Typegoose
- **Authentication**: JWT (@fastify/jwt)
- **Documentation**: Swagger/OpenAPI
- **Testing**: Jest
- **Container**: Docker & Docker Compose
- **Load Balancer**: Nginx
- **Code Quality**: ESLint, Prettier, Husky

## 🏗 Project Structure

```
src/
├── models/ # Database models using Typegoose
├── repositories/ # Data access layer with generic repository pattern
├── services/ # Business logic layer
├── routes/ # API endpoints and request handlers
├── plugins/ # Fastify plugins (auth, cors, etc.)
├── schemas/ # Request/Response validation schemas
├── types/ # TypeScript type definitions
└── index.ts # Application entry point
```

## 🚀 Getting Started

### Prerequisites

- Node.js >= 20.0.0
- MongoDB
- Docker & Docker Compose (for containerized deployment)

### Local Development

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/ticktuk-user-management.git
   cd ticktuk-user-management
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file:

   - Docker already has the variables

   ```bash
   MONGODB_URI=mongodb://localhost:27017/user-management
   JWT_SECRET=your-secret-key
   ```

4. Start development server:

   ```bash
   npm run dev
   ```

### Docker Deployment

Deploy the entire stack with load balancing:

```bash
docker-compose up -d
```

This will start:

- 2 API instances
- MongoDB instance
- Nginx load balancer

## 📚 API Documentation

Once running, access the Swagger documentation at:
http://localhost/documentation

### Available Endpoints

- `POST /users` - Create new user
- `GET /users` - List all users
- `DELETE /users/:id` - Delete user

## 🧪 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run clean` - Clean build directory

## 🔒 Security Features

- JWT-based authentication
- Password hashing
- Input validation with JSON schemas
- CORS protection
- Environment variable configuration
- Secure HTTP headers with Nginx

## 🐳 Docker Configuration

The service is containerized with:

- Multi-container setup using Docker Compose
- Load balancing across multiple API instances
- Persistent MongoDB volume
- Nginx reverse proxy
- Environment variable management

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

David Jimenez

- Email: danimax.com@gmail.com
- GitHub: [@danimaxpd](https://github.com/danimaxpd)
