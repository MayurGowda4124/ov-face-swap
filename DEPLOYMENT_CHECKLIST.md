# Pre-Deployment Checklist for iPad Face Swap App

## ✅ Code Issues Fixed

1. **Unused imports removed**
   - Removed `base64ToBlobUrl` import from `ProcessingPage.jsx`
   - Removed unused `useRef` and `printRef` from `QrCodePage.jsx`

2. **Navigation fixed**
   - Changed `SettingsPage.jsx` to use React Router's `navigate()` instead of `window.location.href`

3. **CSS layout fixed**
   - Fixed `QrCodePage.css` - changed `position: fixed` to `position: relative` to prevent layout issues

4. **Vite config updated**
   - Changed `base: './'` to `base: '/'` for proper Vercel deployment

5. **Error handling improved**
   - Added better error messages in `ProcessingPage.jsx`
   - Made Supabase upload failures non-blocking (falls back to base64)

## ⚠️ Manual Steps Required

### 1. Copy Font Files
The fonts need to be copied from the main frontend to the iPad app:

```bash
# Create fonts directory
mkdir ipad\public\fonts

# Copy font files (run from project root)
copy frontend\public\fonts\BebasNeue-Bold.ttf ipad\public\fonts\
```

**OR** manually copy these files:
- `frontend/public/fonts/BebasNeue-Bold.ttf` → `ipad/public/fonts/BebasNeue-Bold.ttf`

### 2. Verify All Assets Exist
Ensure these files exist in `ipad/public/assets/`:
- ✅ `logo.png`
- ✅ `start.png`
- ✅ `theme.jpg`
- ✅ `male1.jpg`
- ✅ `male2.jpg`
- ✅ `female1.jpg`
- ✅ `female2.jpg`

### 3. Test Build Locally
Before deploying to Vercel, test the build:

```bash
cd ipad
npm install
npm run build
npm run preview
```

Visit `http://localhost:4173` and verify:
- All pages load correctly
- Images display properly
- Fonts load correctly
- No console errors

## 🚀 Vercel Deployment

### Option 1: Vercel CLI
```bash
cd ipad
npm i -g vercel
vercel
```

### Option 2: Vercel Dashboard
1. Go to [vercel.com](https://vercel.com)
2. Import your Git repository
3. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `ipad`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

## 🔍 Potential Runtime Issues to Monitor

1. **CORS Errors**
   - Backend must allow requests from Vercel domain
   - Check backend CORS settings in `backend/app.py`

2. **Network Connectivity**
   - iPad and laptop must be on same WiFi
   - Backend must be running and accessible
   - Firewall must allow port 8000

3. **Camera Permissions**
   - iPad Safari requires HTTPS for camera access
   - Vercel provides HTTPS automatically
   - User must grant camera permissions

4. **LocalStorage**
   - Settings are stored in browser localStorage
   - Cleared if user clears browser data
   - Settings page allows reconfiguration

5. **Image Loading**
   - Character images must be accessible
   - Check network tab if images don't load
   - Verify asset paths are correct

6. **Supabase Upload**
   - Upload failures are non-blocking
   - Falls back to base64 image display
   - Check browser console for upload errors

## 📝 Environment Variables (Optional)

If you want to set a default backend URL in Vercel:
- **Name**: `VITE_BACKEND_URL`
- **Value**: `http://YOUR_LAPTOP_IP:8000`

Note: Users can override this in the Settings page.

## ✅ Post-Deployment Testing

After deployment, test on iPad:
1. Open Safari on iPad
2. Navigate to Vercel URL
3. Configure backend IP/port in Settings
4. Test full flow:
   - Start page → Character selection → Capture → Processing → Result → QR Code
5. Verify:
   - Camera access works
   - Face swap completes successfully
   - QR code displays correctly
   - Image downloads work

## 🐛 Known Limitations

1. **Safari Fullscreen X Button**
   - Native Safari fullscreen exit button cannot be removed programmatically
   - Logo acts as fullscreen toggle
   - Consider "Add to Home Screen" for app-like experience

2. **Backend Dependency**
   - App requires local backend to be running
   - Backend must be accessible from iPad's network
   - IP address may change (DHCP)

3. **Font Loading**
   - Fonts may fail to load if not copied correctly
   - App falls back to system fonts if custom fonts fail

