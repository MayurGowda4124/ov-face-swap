# Theme Setup Instructions

The iPad app now uses the same theme as your main frontend. You need to copy the following assets:

## Required Assets

### 1. Font Files
Copy these files from `frontend/public/fonts/` to `ipad/public/fonts/`:
- `BebasNeue-Bold.ttf`
- `heineken-regular.ttf` (if available)
- `heineken-bold.ttf` (if available)

### 2. Background Images
Copy these files from `frontend/public/assets/` to `ipad/public/assets/`:
- `Frame_1.png` - Used for Start/Welcome page
- `Frame_2.png` - Used for Character Selection and Result pages
- `Frame_3.png` - Used for Capture and Processing pages

## Quick Copy Commands

### Windows (PowerShell):
```powershell
# Create directories
New-Item -ItemType Directory -Force -Path "ipad\public\fonts"
New-Item -ItemType Directory -Force -Path "ipad\public\assets"

# Copy fonts
Copy-Item "frontend\public\fonts\*" -Destination "ipad\public\fonts\" -Recurse

# Copy background images
Copy-Item "frontend\public\assets\Frame_*.png" -Destination "ipad\public\assets\"
```

### Mac/Linux:
```bash
# Create directories
mkdir -p ipad/public/fonts
mkdir -p ipad/public/assets

# Copy fonts
cp -r frontend/public/fonts/* ipad/public/fonts/

# Copy background images
cp frontend/public/assets/Frame_*.png ipad/public/assets/
```

## After Copying

Once you've copied the assets, the theme will be automatically applied:
- **Start Page**: Uses Frame_1.png background with Heineken-Bold font
- **Character Selection**: Uses Frame_2.png background
- **Capture Page**: Uses Frame_3.png background with corner brackets
- **Processing Page**: Uses Frame_3.png background with loading frame
- **Result Page**: Uses Frame_2.png background with corner brackets

All buttons use the white background with #EA002A text color, matching your theme.

## Character Images

Don't forget to add your character images to `ipad/public/assets/`:
- `male1.jpg`
- `male2.jpg`
- `female1.jpg`
- `female2.jpg`

