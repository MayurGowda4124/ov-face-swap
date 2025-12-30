# ngrok Setup Guide (Microsoft Store Version)

## Step 1: Get Your Auth Token

1. Go to https://dashboard.ngrok.com/get-started/your-authtoken
2. Sign in or create a free account
3. Copy your authtoken (it looks like: `2abc123xyz456...`)

## Step 2: Configure ngrok

Open PowerShell or Command Prompt and run:

```bash
ngrok config add-authtoken YOUR_AUTH_TOKEN_HERE
```

Replace `YOUR_AUTH_TOKEN_HERE` with the token you copied.

## Step 3: Start Your Backend

In one terminal/command prompt:

```bash
cd backend
python app.py
```

Wait until you see: `INFO:     Uvicorn running on http://0.0.0.0:8000`

## Step 4: Start ngrok Tunnel

Open a **NEW** terminal/command prompt (keep the backend running) and run:

```bash
ngrok http 8000
```

You'll see output like:
```
Session Status                online
Account                       Your Name (Plan: Free)
Version                       3.x.x
Region                        United States (us)
Latency                       -
Web Interface                 http://127.0.0.1:4040
Forwarding                    https://abc123.ngrok-free.app -> http://localhost:8000
```

## Step 5: Copy the HTTPS URL

Look for the line that says:
```
Forwarding    https://abc123.ngrok-free.app -> http://localhost:8000
```

Copy the HTTPS URL part: `abc123.ngrok-free.app` (or whatever ngrok gives you)

## Step 6: Use in Your App

1. Open your Vercel app on iPad
2. Go to Settings page
3. Enter:
   - **Backend Host IP**: `abc123.ngrok-free.app` (the ngrok domain, no https://)
   - **Port**: Leave empty or enter `443`
4. Click "Test Backend Connection"
5. Should show ✅ Connection successful!

## Important Notes

### ngrok Free Tier
- URL changes each time you restart ngrok (unless you get a static domain)
- Session expires after 2 hours
- Limited requests per minute

### For Permanent URL (Optional)
1. Go to https://dashboard.ngrok.com/cloud-edge/domains
2. Reserve a free static domain (e.g., `your-app.ngrok-free.app`)
3. Start ngrok with:
   ```bash
   ngrok http 8000 --domain=your-app.ngrok-free.app
   ```

### Keep Both Running
- Keep the backend terminal running (`python app.py`)
- Keep the ngrok terminal running (`ngrok http 8000`)
- If you close either one, the connection will break

## Troubleshooting

### "ngrok: command not found"
- If installed from Microsoft Store, try: `ngrok.exe` instead of `ngrok`
- Or use the full path to ngrok

### "authtoken is required"
- Make sure you ran: `ngrok config add-authtoken YOUR_TOKEN`
- Check that the token was copied correctly

### Connection still fails
- Make sure backend is running
- Make sure ngrok is running
- Check that you're using the HTTPS URL from ngrok (not the local IP)
- Try the "Test Backend Connection" button in Settings

