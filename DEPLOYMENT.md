# Deployment Guide for iPad Face Swap App

## Quick Start

### Step 1: Setup Backend on Your Laptop

1. Make sure your backend is running:
   ```bash
   cd backend
   python app.py
   ```

2. Find your laptop's local IP address:
   - **Windows**: Open Command Prompt and run `ipconfig`
     - Look for "IPv4 Address" under your WiFi adapter (e.g., `192.168.1.100`)
   - **Mac/Linux**: Open Terminal and run `ifconfig` or `ip addr`
     - Look for your WiFi adapter's inet address

3. Update the backend to allow connections from your network:
   - In `backend/app.py`, change line 206 from:
     ```python
     uvicorn.run(app, host='localhost', port=8000)
     ```
   - To:
     ```python
     uvicorn.run(app, host='0.0.0.0', port=8000)
     ```
   - This allows connections from other devices on your network

### Step 2: Setup Frontend

1. Navigate to the iPad folder:
   ```bash
   cd ipad
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with your laptop's IP:
   ```env
   VITE_BACKEND_URL=http://YOUR_LAPTOP_IP:8000
   ```
   Replace `YOUR_LAPTOP_IP` with the IP you found in Step 1.

4. Add character images:
   - Place 4 images in `public/assets/`:
     - `male1.jpg`
     - `male2.jpg`
     - `female1.jpg`
     - `female2.jpg`

### Step 3: Test Locally

1. Start the dev server:
   ```bash
   npm run dev
   ```

2. Open the app on your iPad browser:
   - Make sure iPad and laptop are on the same WiFi
   - Visit: `http://YOUR_LAPTOP_IP:3000` (replace with your laptop's IP)

### Step 4: Deploy to Vercel

#### Option A: Using Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   cd ipad
   vercel
   ```

4. Follow the prompts:
   - Set up and deploy? **Yes**
   - Which scope? (Select your account)
   - Link to existing project? **No**
   - Project name? (Press Enter for default or enter a name)
   - Directory? (Press Enter for `./`)
   - Override settings? **No**

5. After deployment, you'll get a URL like: `https://your-app.vercel.app`

#### Option B: Using Vercel Web Interface

1. Go to [vercel.com](https://vercel.com) and sign in

2. Click "Add New Project"

3. Import your Git repository (GitHub/GitLab/Bitbucket)

4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `ipad`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

5. Add Environment Variable:
   - Name: `VITE_BACKEND_URL`
   - Value: `http://YOUR_LAPTOP_IP:8000` (your laptop's local IP)

6. Click "Deploy"

### Step 5: Access on iPad

1. Make sure your iPad and laptop are on the same WiFi network

2. Open Safari on your iPad

3. Visit the Vercel URL you received (e.g., `https://your-app.vercel.app`)

4. The app will connect to your local backend running on your laptop

## Important Notes

- **Backend must be running**: The Vercel frontend will try to connect to your laptop's backend. Make sure the backend is running whenever you want to use the app.

- **Same WiFi network**: Both devices must be on the same local network for the connection to work.

- **Firewall**: Make sure your laptop's firewall allows incoming connections on port 8000.

- **IP Address changes**: If your laptop's IP address changes (common with DHCP), you'll need to update the `VITE_BACKEND_URL` environment variable in Vercel.

## Troubleshooting

### Can't connect to backend
- Verify both devices are on the same WiFi
- Check that backend is running: `http://YOUR_LAPTOP_IP:8000/docs` should show the API docs
- Verify firewall isn't blocking port 8000
- Try accessing the backend URL directly from iPad browser

### Images not loading
- Check that character images are in `public/assets/` folder
- Verify image filenames match exactly: `male1.jpg`, `male2.jpg`, `female1.jpg`, `female2.jpg`

### Camera not working
- Grant camera permissions in Safari settings
- Try refreshing the page
- Check Safari settings: Settings > Safari > Camera permissions

## Production Considerations

For a production setup, you would want to:
1. Deploy the backend to a cloud service (AWS, Heroku, etc.)
2. Update `VITE_BACKEND_URL` to point to the deployed backend
3. This way, the app works even when your laptop is off

