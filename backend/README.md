# Yandere AI Game - Backend API

Backend server for the Yandere AI Game with user authentication, game state management, and more.

## 🚀 Features

- ✅ **User Authentication**: JWT-based authentication with access and refresh tokens
- ✅ **Account Security**: Password hashing, login attempt limiting, account locking
- ✅ **Game State Management**: Save, load, and reset game progress
- ✅ **User Profiles**: Update profile information
- ✅ **Statistics Tracking**: Track achievements, conversations, and progress
- ✅ **RESTful API**: Clean and organized endpoints
- ✅ **Error Handling**: Comprehensive error handling middleware
- ✅ **Input Validation**: Request validation with express-validator
- ✅ **Security**: Helmet, CORS, rate limiting

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## 🛠️ Installation

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Create `.env` file:**

   ```bash
   cp .env.example .env
   ```

3. **Configure environment variables:**
   Edit `.env` file with your settings:

   - MongoDB connection string
   - JWT secrets (use strong random strings in production)
   - Port and other configurations

4. **Start MongoDB:**
   - Local: Make sure MongoDB service is running
   - Atlas: Use your connection string in `.env`

## 🚀 Running the Server

### Development Mode (with auto-reload):

```bash
npm run dev
```

### Production Mode:

```bash
npm start
```

Server will run on `http://localhost:5000` (or your configured PORT)

## 📡 API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint           | Description          | Auth Required |
| ------ | ------------------ | -------------------- | ------------- |
| POST   | `/register`        | Register new user    | No            |
| POST   | `/login`           | Login user           | No            |
| POST   | `/logout`          | Logout user          | Yes           |
| POST   | `/refresh-token`   | Refresh access token | No            |
| GET    | `/me`              | Get current user     | Yes           |
| PUT    | `/update-password` | Update password      | Yes           |

### Users (`/api/users`)

| Method | Endpoint   | Description         | Auth Required |
| ------ | ---------- | ------------------- | ------------- |
| PUT    | `/profile` | Update profile      | Yes           |
| DELETE | `/account` | Delete account      | Yes           |
| GET    | `/stats`   | Get user statistics | Yes           |

### Game State (`/api/game`)

| Method | Endpoint | Description      | Auth Required |
| ------ | -------- | ---------------- | ------------- |
| GET    | `/state` | Get game state   | Yes           |
| POST   | `/state` | Save game state  | Yes           |
| DELETE | `/state` | Reset game state | Yes           |

## 📝 API Usage Examples

### Register User

```bash
POST /api/auth/register
Content-Type: application/json

{
  "username": "player1",
  "email": "player1@example.com",
  "password": "password123"
}
```

### Login

```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "player1@example.com",
  "password": "password123"
}
```

### Get Game State

```bash
GET /api/game/state
Authorization: Bearer <access_token>
```

### Save Game State

```bash
POST /api/game/state
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "gameState": "playing",
  "selectedWaifu": "sweet",
  "affection": 75,
  "conversationCount": 5,
  "achievements": ["first_love", "sweet_talker"]
}
```

## 🔐 Authentication Flow

1. **Register/Login**: Receive `accessToken` and `refreshToken`
2. **API Requests**: Include access token in Authorization header:
   ```
   Authorization: Bearer <access_token>
   ```
3. **Token Refresh**: When access token expires, use refresh token:
   ```bash
   POST /api/auth/refresh-token
   {
     "refreshToken": "<refresh_token>"
   }
   ```

## 🗄️ Database Schema

### User Model

- username (unique)
- email (unique)
- password (hashed)
- isAdmin
- isActive
- lastLogin
- loginAttempts
- lockUntil

### GameState Model

- userId (reference to User)
- gameState
- selectedWaifu
- mood
- affection
- conversationCount
- conversationHistory
- achievements
- screenshots
- gifts
- and more...

## 🛡️ Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Tokens**: Secure token-based authentication
- **Rate Limiting**: Prevents brute force attacks
- **Account Locking**: Locks account after 5 failed login attempts
- **CORS**: Configured for frontend origin
- **Helmet**: Security headers
- **Input Validation**: Validates and sanitizes all inputs

## 🐛 Error Handling

All errors return JSON in this format:

```json
{
  "success": false,
  "message": "Error message",
  "errors": [] // Optional array of validation errors
}
```

## 📦 Dependencies

- **express**: Web framework
- **mongoose**: MongoDB ODM
- **bcryptjs**: Password hashing
- **jsonwebtoken**: JWT tokens
- **express-validator**: Input validation
- **helmet**: Security headers
- **cors**: Cross-origin resource sharing
- **morgan**: HTTP logging
- **compression**: Response compression
- **dotenv**: Environment variables

## 🔧 Configuration

Key environment variables:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/yandere-ai-game
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret-key
JWT_EXPIRE=7d
JWT_REFRESH_EXPIRE=30d
FRONTEND_URL=http://localhost:5173
```

## 📚 Next Steps

1. ✅ User authentication system (COMPLETED)
2. 🔜 Achievement endpoints
3. 🔜 Gift system endpoints
4. 🔜 Screenshot endpoints
5. 🔜 Date system endpoints
6. 🔜 Waifu management
7. 🔜 Admin panel backend
8. 🔜 Image proxy/caching
9. 🔜 Leaderboards
10. 🔜 Social features

## 🤝 Contributing

This is a student project for ICE415 course.

## 📄 License

ISC
