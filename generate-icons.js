const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

const sizes = [
  { size: 512, name: 'logo512.png' },
  { size: 192, name: 'logo192.png' },
  { size: 180, name: 'logo180.png' },  // iOS/iPad
  { size: 167, name: 'logo167.png' },  // iPad Pro
  { size: 152, name: 'logo152.png' },  // iPad
  { size: 32, name: 'favicon.png' }
];

const splashScreenSizes = [
  { width: 2048, height: 2732, name: 'ipad-12.9.png' },  // 12.9" iPad Pro
  { width: 1668, height: 2388, name: 'ipad-11.png' },    // 11" iPad Pro
  { width: 1640, height: 2360, name: 'ipad-10.9.png' },  // 10.9" iPad Air
  { width: 1668, height: 2224, name: 'ipad-10.5.png' },  // 10.5" iPad
];

async function generateIcons() {
  try {
    // Create public directory if it doesn't exist
    await fs.mkdir(path.join(__dirname, 'public'), { recursive: true });
    
    // Create splash directory if it doesn't exist
    await fs.mkdir(path.join(__dirname, 'public', 'splash'), { recursive: true });

    // Generate app icons
    for (const { size, name } of sizes) {
      await sharp(path.join(__dirname, 'public', 'logo.svg'))
        .resize(size, size)
        .png()
        .toFile(path.join(__dirname, 'public', name));
      console.log(`Generated ${name}`);
    }

    // Generate splash screens
    for (const { width, height, name } of splashScreenSizes) {
      // Create a white background
      const background = await sharp({
        create: {
          width,
          height,
          channels: 4,
          background: { r: 255, g: 255, b: 255, alpha: 1 }
        }
      }).png().toBuffer();

      // Load and resize the logo
      const logoSize = Math.min(width, height) * 0.4; // Logo takes 40% of the smaller dimension
      const logo = await sharp(path.join(__dirname, 'public', 'logo.svg'))
        .resize(Math.round(logoSize), Math.round(logoSize))
        .toBuffer();

      // Composite the logo onto the center of the background
      await sharp(background)
        .composite([{
          input: logo,
          gravity: 'center'
        }])
        .toFile(path.join(__dirname, 'public', 'splash', name));
      
      console.log(`Generated splash screen ${name}`);
    }

    console.log('All icons and splash screens generated successfully!');
  } catch (error) {
    console.error('Error generating icons:', error);
    process.exit(1);
  }
}

generateIcons(); 