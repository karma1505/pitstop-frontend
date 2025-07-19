# Assets Directory

This directory contains images and other assets for the PitStop app.

## Required Images

### Logo Images
- **App Icon**: 1024x1024px (WebP) - for app store and device icons
- **Splash Logo**: 512x512px (WebP) - for splash screen
- **Login Logo**: 256x256px (WebP) - for login screen header

### Optional Images
- **Background Patterns**: 1920x1080px (WebP) - for decorative backgrounds
- **Illustrations**: Various sizes for empty states and onboarding

## Image Guidelines

### Format Recommendations
1. **Primary Format**: **WebP** (recommended)
   - Better compression than PNG (25-35% smaller)
   - Faster loading times
   - Full transparency support
   - Native support in React Native/Expo

2. **Fallback Format**: PNG (if WebP not available)
   - Use for app icons that require PNG format
   - Use for images that need maximum compatibility

### Design Guidelines
1. **Color Scheme**: Match the app's color palette
   - Primary: #007AFF (Blue)
   - Background: #0f0f0f (Dark)
   - Surface: #1C1C1E (Dark Gray)

2. **Style**: Modern, clean, and professional
3. **Branding**: Include "PitStop" text or icon elements
4. **Optimization**: Compress images for optimal performance

## File Structure
```
src/assets/
├── images/
│   ├── logo.webp
│   ├── splash-logo.webp
│   ├── login-logo.webp
│   ├── background.webp
│   └── fallback/
│       ├── logo.png
│       └── splash-logo.png
└── README.md
```

## Usage
Import images in your components:
```typescript
// WebP (recommended)
import logoImage from '../assets/images/logo.webp';

// PNG fallback (if needed)
import logoImageFallback from '../assets/images/fallback/logo.png';
```

## WebP Benefits
- **Smaller file sizes**: 25-35% smaller than PNG
- **Better performance**: Faster loading and rendering
- **Native support**: Built into React Native/Expo
- **Transparency**: Full alpha channel support
- **Quality**: Excellent visual quality at smaller sizes

## Conversion Tools
- **Online**: Convertio, CloudConvert
- **Desktop**: ImageOptim, Squoosh
- **Command line**: `cwebp` (Google WebP tools) 