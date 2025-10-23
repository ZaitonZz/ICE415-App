# MongoDB Setup Guide

You need to have MongoDB running to use the backend. Here are your options:

## Option 1: MongoDB Atlas (Cloud - Recommended for Beginners)

MongoDB Atlas is a free cloud database service. Perfect for development and testing.

### Steps:

1. **Create a Free Account**

   - Go to https://www.mongodb.com/cloud/atlas/register
   - Sign up with email or Google account

2. **Create a Free Cluster**

   - Choose "Free" tier (M0 Sandbox)
   - Select your nearest region (e.g., AWS - Singapore for Philippines)
   - Click "Create Cluster"

3. **Create a Database User**

   - Go to "Database Access" in the left sidebar
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Set username and password (save these!)
   - Set role to "Atlas admin" or "Read and write to any database"
   - Click "Add User"

4. **Whitelist Your IP Address**

   - Go to "Network Access" in the left sidebar
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Confirm

5. **Get Your Connection String**

   - Go to "Database" in the left sidebar
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - It looks like: `mongodb+srv://username:<password>@cluster.mongodb.net/?retryWrites=true&w=majority`

6. **Update Your .env File**
   - Open `backend/.env`
   - Replace the MONGODB_URI with your connection string
   - Replace `<password>` with your actual password
   - Add your database name after `.net/` like: `mongodb+srv://username:password@cluster.mongodb.net/yandere-ai-game?retryWrites=true&w=majority`

Example:

```env
MONGODB_URI=mongodb+srv://myuser:mypassword123@cluster0.abc123.mongodb.net/yandere-ai-game?retryWrites=true&w=majority
```

---

## Option 2: Local MongoDB (Advanced)

### For Windows:

1. **Download MongoDB Community Edition**

   - Go to https://www.mongodb.com/try/download/community
   - Choose "Windows" and download MSI installer
   - Run the installer
   - Choose "Complete" installation
   - Install "MongoDB as a Service" (checkbox)
   - Install MongoDB Compass (GUI tool - optional but helpful)

2. **Verify Installation**

   ```powershell
   mongo --version
   ```

3. **Start MongoDB Service**
   MongoDB should start automatically as a Windows Service.

   To check if it's running:

   ```powershell
   Get-Service MongoDB
   ```

   To start it manually:

   ```powershell
   net start MongoDB
   ```

4. **Your .env should use:**
   ```env
   MONGODB_URI=mongodb://localhost:27017/yandere-ai-game
   ```

### For Mac (using Homebrew):

```bash
# Install MongoDB
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community

# Stop MongoDB
brew services stop mongodb-community
```

### For Linux (Ubuntu/Debian):

```bash
# Import MongoDB public GPG key
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

# Create list file
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Update package database
sudo apt-get update

# Install MongoDB
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod

# Enable MongoDB to start on boot
sudo systemctl enable mongod

# Check status
sudo systemctl status mongod
```

---

## Verify MongoDB Connection

Once MongoDB is running, restart your backend server:

```bash
cd backend
npm run dev
```

You should see:

```
✅ MongoDB Connected Successfully
🚀 Server running on port 5000
```

---

## MongoDB GUI Tools (Optional but Helpful)

### MongoDB Compass (Official)

- Download: https://www.mongodb.com/try/download/compass
- Free, official GUI for MongoDB
- Great for viewing and managing your data

### Studio 3T

- Download: https://studio3t.com/download/
- Free for personal use
- More features than Compass

---

## Troubleshooting

### "Connection Refused" Error

- **Local MongoDB**: Make sure MongoDB service is running
- **Atlas**: Check your connection string, username, password, and IP whitelist

### "Authentication Failed" Error

- Check your username and password in the connection string
- Make sure the user has proper permissions in Atlas

### "Network Timeout" Error

- **Atlas**: Check your IP is whitelisted
- **Local**: Check if MongoDB service is running

### Port 27017 Already in Use

```powershell
# Windows - Find and kill process
netstat -ano | findstr :27017
taskkill /PID [process_id] /F

# Mac/Linux
lsof -i :27017
kill -9 [process_id]
```

---

## Quick Test

Once connected, you can test the API:

```bash
# Test health endpoint
curl http://localhost:5000/health

# Test registration
curl -X POST http://localhost:5000/api/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"username\":\"testuser\",\"email\":\"test@example.com\",\"password\":\"password123\"}"
```

If you see a successful response, MongoDB is connected and working! 🎉
