# CoinOne Template - Local Setup

## Overview
This template has been cleaned from external CDN dependencies. All Chrome extension scripts and WordPress-specific code have been removed.

## Required Local Files

You need to download and place the following files in the appropriate directories:

### CSS Files (create a `css/` folder)
1. **elementor.min.css** - Main Elementor framework styles
2. **animations.min.css** - Animation effects (fadeIn, fadeInUp, shrink)
3. **fontawesome.min.css** - Font Awesome icons
4. **swiper.min.css** - Swiper slider styles

### JavaScript Files (create a `js/` folder)
1. **jquery.min.js** - jQuery library (v3.7.1 or later)
2. **swiper.min.js** - Swiper slider library
3. **jquery-ui.min.js** - jQuery UI library
4. **imagesloaded.min.js** - ImagesLoaded library

## Directory Structure
```
new/
├── index.html (cleaned)
├── index.css (your existing styles)
├── styles.css (component styles)
├── app.js (main JavaScript)
├── README.md (this file)
├── css/
│   ├── elementor.min.css
│   ├── animations.min.css
│   ├── fontawesome.min.css
│   └── swiper.min.css
└── js/
    ├── jquery.min.js
    ├── swiper.min.js
    ├── jquery-ui.min.js
    └── imagesloaded.min.js
```

## Download Sources

### jQuery
- **URL**: https://code.jquery.com/jquery-3.7.1.min.js
- **Save as**: `js/jquery.min.js`

### jQuery UI
- **URL**: https://code.jquery.com/ui/1.13.3/jquery-ui.min.js
- **Save as**: `js/jquery-ui.min.js`

### Swiper
- **JS**: https://cdn.jsdelivr.net/npm/swiper@8/swiper-bundle.min.js
- **CSS**: https://cdn.jsdelivr.net/npm/swiper@8/swiper-bundle.min.css
- **Save as**: `js/swiper.min.js` and `css/swiper.min.css`

### ImagesLoaded
- **URL**: https://unpkg.com/imagesloaded@5.0.0/imagesloaded.pkgd.min.js
- **Save as**: `js/imagesloaded.min.js`

### Font Awesome
- **CSS**: https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css
- **Save as**: `css/fontawesome.min.css`
- **Note**: Also download the `webfonts/` folder for icons to work

### Elementor & Animations
These are Elementor-specific files. You can either:
1. Create minimal versions based on the inline styles already in the HTML
2. Use the provided `styles.css` which contains most of what you need
3. Download from Elementor's GitHub repository

## Quick Setup Script

Create these folders and download the files:

```bash
# Create directories
mkdir -p css js

# Download jQuery
curl https://code.jquery.com/jquery-3.7.1.min.js -o js/jquery.min.js

# Download jQuery UI
curl https://code.jquery.com/ui/1.13.3/jquery-ui.min.js -o js/jquery-ui.min.js

# Download Swiper
curl https://cdn.jsdelivr.net/npm/swiper@8/swiper-bundle.min.js -o js/swiper.min.js
curl https://cdn.jsdelivr.net/npm/swiper@8/swiper-bundle.min.css -o css/swiper.min.css

# Download ImagesLoaded
curl https://unpkg.com/imagesloaded@5.0.0/imagesloaded.pkgd.min.js -o js/imagesloaded.min.js

# Download Font Awesome
curl https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css -o css/fontawesome.min.css
```

## What Was Removed

✅ Chrome extension scripts  
✅ WordPress emoji handling  
✅ WordPress RSS feeds  
✅ WordPress API links  
✅ External CDN links to demo2.strongtheme.com  
✅ Unnecessary tracking scripts  
✅ Browser extension iframes  

## What Was Kept

✅ All HTML content and structure  
✅ All inline CSS styles  
✅ Elementor configuration objects  
✅ Lazy loading functionality  
✅ All data attributes and classes  
✅ Complete page layout  

## Next Steps

1. Download the required CSS and JS files
2. Test the page in a browser
3. When ready, convert to JSX/React components
4. Integrate with your BlockVault project

## Notes

- The file is now **100% self-contained** with no external dependencies once you download the libraries
- All styles and scripts reference local files only
- The `elementorFrontendConfig` object is preserved for compatibility
- Total file reduction: ~2979 lines → ~2793 lines (removed ~186 lines of unnecessary code)

