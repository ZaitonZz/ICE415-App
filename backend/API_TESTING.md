# Yandere AI Game Backend - API Testing Guide

This file contains example API requests you can use to test the backend.

## Base URL

```
http://localhost:5000
```

## Health Check

```bash
curl http://localhost:5000/health
```

## 1. Register a New User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"testplayer\",\"email\":\"test@example.com\",\"password\":\"password123\"}"
```

**Expected Response:**

```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": {
      "_id": "...",
      "username": "testplayer",
      "email": "test@example.com",
      "isAdmin": false,
      "isActive": true
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

## 2. Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@example.com\",\"password\":\"password123\"}"
```

## 3. Get Current User Info

```bash
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 4. Get Game State

```bash
curl http://localhost:5000/api/game/state \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 5. Save Game State

```bash
curl -X POST http://localhost:5000/api/game/state \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"gameState\":\"playing\",\"selectedWaifu\":\"sweet\",\"affection\":75,\"conversationCount\":5,\"achievements\":[\"first_love\"]}"
```

## 6. Update Profile

```bash
curl -X PUT http://localhost:5000/api/users/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"newusername\"}"
```

## 7. Get User Statistics

```bash
curl http://localhost:5000/api/users/stats \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 8. Reset Game State

```bash
curl -X DELETE http://localhost:5000/api/game/state \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 9. Update Password

```bash
curl -X PUT http://localhost:5000/api/auth/update-password \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"currentPassword\":\"password123\",\"newPassword\":\"newpassword123\"}"
```

## 10. Refresh Access Token

```bash
curl -X POST http://localhost:5000/api/auth/refresh-token \
  -H "Content-Type: application/json" \
  -d "{\"refreshToken\":\"YOUR_REFRESH_TOKEN\"}"
```

## 11. Logout

```bash
curl -X POST http://localhost:5000/api/auth/logout \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 12. Delete Account

```bash
curl -X DELETE http://localhost:5000/api/users/account \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## Testing with Postman or Thunder Client

You can also import these requests into Postman or use VS Code's Thunder Client extension:

1. Create a new request
2. Set the method (GET, POST, PUT, DELETE)
3. Enter the URL
4. Add headers:
   - `Content-Type: application/json` (for POST/PUT requests)
   - `Authorization: Bearer YOUR_ACCESS_TOKEN` (for protected routes)
5. Add body (for POST/PUT requests)
6. Send request

## Common HTTP Status Codes

- `200 OK` - Successful GET, PUT, or POST request
- `201 Created` - Successful resource creation
- `400 Bad Request` - Invalid input or validation error
- `401 Unauthorized` - Missing or invalid authentication
- `403 Forbidden` - Authenticated but not authorized
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

## Error Response Format

```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "fieldName",
      "message": "Validation error message"
    }
  ]
}
```
