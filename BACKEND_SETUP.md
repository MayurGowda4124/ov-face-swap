# Backend Setup Guide for iPad App

## Step 1: Update Backend to Allow Network Connections

The backend needs to be configured to accept connections from other devices on your network (not just localhost).

### Option A: Edit `backend/app.py` (Recommended)

1. Open `backend/app.py`
2. Find line 206 (near the bottom):
   ```python
   uvicorn.run(app, host='localhost', port=8000)
   ```
3. Change it to:
   ```python
   uvicorn.run(app, host='0.0.0.0', port=8000)
   ```
4. Save the file

This allows the backend to accept connections from any device on your network.

## Step 2: Find Your Laptop's IP Address

You need to find your laptop's local IP address so the iPad can connect to it.

### Windows:
1. Open Command Prompt (Press `Win + R`, type `cmd`, press Enter)
2. Type: `ipconfig`
3. Look for "IPv4 Address" under your WiFi adapter
   - Example: `192.168.1.100` or `192.168.0.50`

### Mac/Linux:
1. Open Terminal
2. Type: `ifconfig` (Mac/Linux) or `ip addr` (Linux)
3. Look for your WiFi adapter's `inet` address
   - Example: `192.168.1.100`

**Note this IP address** - you'll need it in Step 4!

## Step 3: Start the Backend

### Option A: Using Python directly

1. Open Command Prompt or Terminal
2. Navigate to the backend folder:
   ```bash
   cd backend
   ```
3. Activate the virtual environment:
   ```bash
   # Windows
   venv\Scripts\activate
   
   # Mac/Linux
   source venv/bin/activate
   ```
4. Start the backend:
   ```bash
   python app.py
   ```

### Option B: Using the batch file (if available)

1. Double-click `kingfisher-backend.bat` (if it exists and is configured)
2. Or create a new batch file with:
   ```batch
   @echo off
   cd backend
   venv\Scripts\activate
   python app.py
   pause
   ```

### Verify Backend is Running

You should see output like:
```
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8000
```

**Keep this terminal window open** - the backend needs to keep running!

## Step 4: Configure iPad App

1. Navigate to the `ipad` folder
2. Create a `.env` file (if it doesn't exist):
   ```env
   VITE_BACKEND_URL=http://YOUR_LAPTOP_IP:8000
   ```
   Replace `YOUR_LAPTOP_IP` with the IP address you found in Step 2.
   
   Example:
   ```env
   VITE_BACKEND_URL=http://192.168.1.100:8000
   ```

3. Save the `.env` file

## Step 5: Test the Connection

### Test from your laptop:
1. Open a browser on your laptop
2. Go to: `http://localhost:8000/docs`
3. You should see the FastAPI documentation page

### Test from iPad (after deploying):
1. Make sure both devices are on the same WiFi network
2. On your iPad, open Safari
3. Try to access: `http://YOUR_LAPTOP_IP:8000/docs`
4. If you can see the API docs, the connection works!

## Step 6: Firewall Settings (If Connection Fails)

If the iPad can't connect, you may need to allow the port through Windows Firewall:

### Windows:
1. Open Windows Defender Firewall
2. Click "Advanced settings"
3. Click "Inbound Rules" → "New Rule"
4. Select "Port" → Next
5. Select "TCP" and enter port `8000`
6. Select "Allow the connection"
7. Apply to all profiles
8. Name it "Backend API"

## Troubleshooting

### Backend won't start:
- Make sure Python is installed
- Make sure all dependencies are installed: `pip install -r requirements.txt`
- Check if port 8000 is already in use

### iPad can't connect:
- Verify both devices are on the same WiFi network
- Check that the IP address in `.env` is correct
- Make sure the backend is running with `host='0.0.0.0'`
- Check Windows Firewall settings
- Try pinging the laptop IP from another device

### Connection works but API fails:
- Check the browser console for errors
- Verify the backend URL in `.env` matches your laptop's IP
- Make sure the backend is still running

## Quick Start Commands

```bash
# 1. Navigate to backend
cd backend

# 2. Activate virtual environment
venv\Scripts\activate  # Windows
# OR
source venv/bin/activate  # Mac/Linux

# 3. Start backend
python app.py
```

The backend will run on `http://0.0.0.0:8000` and accept connections from any device on your network.

