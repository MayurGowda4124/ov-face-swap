# Mixed Content Issue - HTTPS to HTTP Blocking

## Problem
Vercel serves your app over **HTTPS**, but your backend is **HTTP**. Modern browsers block HTTPS pages from accessing HTTP endpoints for security (Mixed Content Policy).

## Solution: Use ngrok to Create HTTPS Tunnel

### Step 1: Install ngrok
1. Go to https://ngrok.com and sign up (free)
2. Download ngrok for Windows
3. Extract and place `ngrok.exe` in a folder (e.g., `C:\ngrok\`)

### Step 2: Get Your Auth Token
1. After signing up, go to https://dashboard.ngrok.com/get-started/your-authtoken
2. Copy your authtoken

### Step 3: Configure ngrok
```bash
# Open Command Prompt
cd C:\ngrok
ngrok config add-authtoken YOUR_AUTH_TOKEN_HERE
```

### Step 4: Start ngrok Tunnel
```bash
# Make sure your backend is running first (python app.py)
# Then in a new terminal:
ngrok http 8000
```

### Step 5: Get HTTPS URL
ngrok will show you a URL like:
```
Forwarding: https://abc123.ngrok-free.app -> http://localhost:8000
```

### Step 6: Use ngrok URL in Settings
In your iPad app Settings page, use:
- **Backend Host IP**: `abc123.ngrok-free.app` (the ngrok domain, no http://)
- **Port**: Leave empty or use `443` (HTTPS default port)

**OR** use the full URL format:
- **Backend Host IP**: `https://abc123.ngrok-free.app` (with https://)
- **Port**: Leave empty

## Alternative: Use ngrok Static Domain (Recommended)

For a permanent URL (free tier available):

1. Go to https://dashboard.ngrok.com/cloud-edge/domains
2. Reserve a free static domain (e.g., `your-app.ngrok-free.app`)
3. Start ngrok with your domain:
   ```bash
   ngrok http 8000 --domain=your-app.ngrok-free.app
   ```

## Update Code to Handle HTTPS Backend

The code should automatically handle HTTPS URLs. Make sure the Settings page accepts URLs with `https://` prefix.

## Important Notes

1. **ngrok Free Tier Limitations**:
   - URL changes on restart (unless using static domain)
   - Session timeout after 2 hours
   - Limited requests per minute

2. **For Production**:
   - Consider using a paid ngrok plan
   - Or set up proper SSL certificate for your backend
   - Or use a cloud service with HTTPS

3. **Testing**:
   - After setting up ngrok, test the connection from Settings page
   - The test should now work from Vercel app

## Quick Start Commands

```bash
# 1. Install and configure ngrok (one time)
ngrok config add-authtoken YOUR_TOKEN

# 2. Start backend
cd backend
python app.py

# 3. Start ngrok tunnel (in another terminal)
ngrok http 8000

# 4. Use the HTTPS URL shown by ngrok in your app settings
```

