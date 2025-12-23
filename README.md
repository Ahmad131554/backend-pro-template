# 🚀 Professional Node.js Backend Template

A production-ready, enterprise-grade Node.js/Express.js backend template with TypeScript, featuring comprehensive authentication, role-based permissions, professional logging, and industry best practices.

## ✨ Features

### 🔐 Authentication & Security
- **JWT Authentication** - Access tokens with refresh token support
- **Password Reset Flow** - Email-based OTP verification
- **Role-Based Access Control (RBAC)** - Admin, Moderator, User roles
- **Permission-Based Authorization** - Fine-grained permission system
- **Rate Limiting** - Configurable limits for auth and general endpoints
- **Security Headers** - Comprehensive security middleware
- **Input Validation & Sanitization** - Express-validator with custom rules

### 📊 Professional Logging
- **Pino Logger** - High-performance structured logging
- **Request/Response Logging** - Automatic HTTP request tracking
- **Security Event Logging** - Failed auth attempts, suspicious activity
- **Performance Monitoring** - Request duration and performance metrics
- **Environment-Aware** - Pretty logs in development, JSON in production

### 🏗️ Architecture & Code Quality
- **Clean Architecture** - Proper separation of concerns
- **TypeScript** - Full type safety with strict configuration
- **Modular Structure** - Organized interfaces, types, utilities
- **Error Handling** - Professional error responses with proper status codes
- **File Upload** - Multer integration with security validation
- **Database Integration** - MongoDB with Mongoose ODM

### 🛠️ Developer Experience
- **Hot Reload** - Nodemon for development
- **Code Formatting** - Prettier with consistent rules
- **Linting** - ESLint with TypeScript support
- **Git Hooks** - Husky for pre-commit quality checks
- **Environment Config** - Comprehensive environment validation

## 📁 Project Structure

```
src/
├── config/              # Configuration files
│   ├── db.config.ts     # Database connection
│   ├── env.config.ts    # Environment validation
│   ├── multer.config.ts # File upload config
│   └── constants.config.ts # App constants
├── constants/           # Shared constants
│   └── index.ts         # HTTP status codes, roles
├── controllers/         # Request handlers
│   ├── auth.controller.ts
│   ├── user.controller.ts
│   └── index.ts
├── interfaces/          # TypeScript interfaces
│   ├── auth.interface.ts
│   ├── user.interface.ts
│   ├── api.interface.ts
│   └── index.ts
├── library/             # Core system libraries
│   └── logger.ts        # Professional Pino logger
├── middlewares/         # Express middleware
│   ├── auth.ts          # Authentication
│   ├── permissions.ts   # RBAC & permissions
│   ├── security.ts      # Rate limiting & headers
│   ├── requestLogger.ts # Request logging
│   ├── error.ts         # Error handling
│   ├── upload.ts        # File upload
│   ├── validate.ts      # Input validation
│   └── index.ts
├── models/              # Database models
│   └── user.model.ts
├── routes/              # API routes
│   ├── auth.routes.ts
│   ├── user.routes.ts
│   └── index.ts
├── services/            # Business logic
│   ├── auth.service.ts
│   ├── user.service.ts
│   └── index.ts
├── types/               # TypeScript types
│   ├── common.types.ts
│   ├── express.d.ts
│   └── index.ts
├── utils/               # Utility functions
│   ├── validation.utils.ts
│   ├── response.utils.ts
│   ├── date.utils.ts
│   ├── crypto.utils.ts
│   ├── pagination.utils.ts
│   ├── ApiError.ts
│   ├── apiResponse.ts
│   ├── asyncHandler.ts
│   └── index.ts
├── validators/          # Input validation rules
│   ├── auth.validation.ts
│   └── user.validation.ts
├── app.ts              # Express app setup
└── server.ts           # Server startup & shutdown
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- pnpm (recommended) or npm
- MongoDB

### Installation

1. **Clone the template**
   ```bash
   git clone <repository-url>
   cd your-project-name
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start development server**
   ```bash
   pnpm dev
   ```

The server will start on `http://localhost:8000` with beautiful structured logging!

## 🔧 Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
NODE_ENV=development
PORT=8000

# Database
MONGO_URI=mongodb://localhost:27017/your_database

# JWT Secrets (generate secure random strings)
JWT_SECRET=your_super_secure_jwt_secret_key_here
JWT_RESET_SECRET=your_super_secure_reset_secret_key_here

# Logging
LOG_PRETTY=true
```

## 📚 API Endpoints

### 🔐 Authentication (`/api/v1/auth`)
```http
POST /auth/register          # User registration
POST /auth/login             # User login
POST /auth/forgot-password   # Request password reset
POST /auth/verify-otp        # Verify OTP code
POST /auth/reset-password    # Reset password with token
```

### 👤 User Management (`/api/v1/users`)
```http
GET    /users/profile        # Get current user profile
PUT    /users/profile        # Update current user profile
POST   /users/profile-picture # Upload profile picture
GET    /users/:userId        # Get user by ID (admin/owner only)
```

### 🏥 System
```http
GET /health                  # Health check endpoint
```

## 🛡️ Security Features

### Role-Based Access Control
```typescript
// Protect routes by role
app.use('/admin', requireAdmin);           // Admin only
app.use('/moderate', requireModerator);    // Admin + Moderator
app.use('/user', requireUser);             // All authenticated users

// Permission-based access
app.use('/sensitive', requirePermission(['admin:all']));

// Resource ownership validation
app.use('/users/:id', requireOwnershipOrAdmin('id'));
```

### Rate Limiting
- **Authentication endpoints**: 5 requests per 15 minutes
- **General API**: 100 requests per 15 minutes
- **Configurable** via `src/middlewares/security.ts`

## 📊 Logging

### Structured Logging Examples
```typescript
// Authentication events
AppLogger.auth("User logged in", userId, { email, timestamp });

// Security events
AppLogger.security("Failed login attempt", "high", { ip, userAgent });

// API performance
AppLogger.api("GET /users", "GET", "/users", 200, { duration: "45ms" });

// Database operations
AppLogger.database("User created", "CREATE", { userId });
```

### Log Output
Development mode shows beautiful, colored logs:
```
[12:34:56.789] INFO: 🚀 Server running on http://localhost:8000
[12:34:56.790] INFO: 📱 Environment: development
[12:34:56.791] INFO: 🔗 Health check: http://localhost:8000/health
```

## 🧪 Development

### Available Scripts
```bash
pnpm dev          # Start development server with hot reload
pnpm build        # Build for production
pnpm start        # Start production server
pnpm typecheck    # Type checking
pnpm lint         # Lint code
pnpm format       # Format code with Prettier
```

### Code Quality
- **TypeScript** - Strict configuration for type safety
- **ESLint** - Code linting with TypeScript support
- **Prettier** - Consistent code formatting
- **Husky** - Git hooks for quality checks

## 🚀 Production Deployment

### Build for Production
```bash
pnpm build
```

### Environment Variables
Ensure all production environment variables are set:
- Use strong, unique JWT secrets
- Set `NODE_ENV=production`
- Configure proper MongoDB connection
- Set `LOG_PRETTY=false` for JSON logs

### PM2 Deployment Example
```bash
pm2 start dist/server.js --name "your-app"
```

## 🔧 Customization

### Adding New Routes
1. Create controller in `src/controllers/`
2. Add service logic in `src/services/`
3. Define routes in `src/routes/`
4. Add validation rules in `src/validators/`
5. Export from respective index files

### Adding Permissions
```typescript
// In src/types/common.types.ts
export type Permission = 
  | 'user:read' 
  | 'user:write' 
  | 'your:new:permission';

// In src/middlewares/permissions.ts
const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  admin: ['admin:all', ...],
  // Add new permission mappings
};
```

### Custom Logging
```typescript
AppLogger.info("Custom log", { data: "value" });
AppLogger.error("Error occurred", error);
AppLogger.performance("Operation completed", duration, { operation: "example" });
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

Built with modern tools and industry best practices:
- **Express.js** - Fast, unopinionated web framework
- **TypeScript** - Type safety and developer experience
- **Pino** - High-performance logging
- **MongoDB & Mongoose** - Database and ODM
- **JWT** - Secure authentication
- **Express-validator** - Input validation
- **Multer** - File upload handling

---

## 🆘 Support

If you encounter any issues or have questions, please create an issue in the repository.

**Happy coding! 🎉**