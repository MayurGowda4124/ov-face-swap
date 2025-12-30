# iPad Face Swap App

A React-based web application for face swapping, optimized for iPad browsers. The frontend is deployed on Vercel and connects to a local backend running on your laptop.

## Setup Instructions

### 1. Install Dependencies

```bash
cd ipad
npm install
```

### 2. Configure Backend URL

Create a `.env` file in the `ipad` folder:

```env
VITE_BACKEND_URL=http://YOUR_LAPTOP_IP:8000
```

Replace `YOUR_LAPTOP_IP` with your laptop's local IP address (e.g., `192.168.1.100`).

To find your laptop's IP:
- Windows: Run `ipconfig` in Command Prompt and look for IPv4 Address
- Mac/Linux: Run `ifconfig` or `ip addr` and look for your WiFi adapter's IP

### 3. Add Character Images

Place 4 character images in the `public/assets/` folder:
- `male1.jpg` - First male character
- `male2.jpg` - Second male character
- `female1.jpg` - First female character
- `female2.jpg` - Second female character

### 4. Development

Run the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### 5. Build for Production

```bash
npm run build
```

This creates a `dist` folder with the production build.

### 6. Deploy to Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Navigate to the `ipad` folder
3. Run: `vercel`
4. Follow the prompts to deploy

Or use the Vercel web interface:
1. Go to [vercel.com](https://vercel.com)
2. Import your project
3. Point to the `ipad` folder
4. Deploy

### 7. Backend Setup

Make sure your backend is running on your laptop:

```bash
cd backend
python app.py
```

The backend should be accessible at `http://YOUR_LAPTOP_IP:8000`

**Important**: Make sure your laptop and iPad are on the same WiFi network!

## Pages

1. **Start Page** - Welcome screen with "Get Started" button
2. **Character Selection** - Choose from 2 male and 2 female characters
3. **Capture Page** - Take a photo using the iPad camera
4. **Processing Page** - Shows loading spinner while processing
5. **Result Page** - Displays the face-swapped result with download option

## Troubleshooting

- **Can't connect to backend**: Check that both devices are on the same WiFi and the backend URL in `.env` is correct
- **Camera not working**: Make sure you've granted camera permissions in the browser
- **Images not loading**: Verify that character images are in `public/assets/` folder

