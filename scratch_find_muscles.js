const fs = require('fs');
const zlib = require('zlib');

function parsePNG(filePath) {
  const buffer = fs.readFileSync(filePath);
  
  // Check PNG signature
  if (buffer.readUInt32BE(0) !== 0x89504E47 || buffer.readUInt32BE(4) !== 0x0D0A1A0A) {
    throw new Error('Not a valid PNG file');
  }

  let offset = 8;
  let width = 0;
  let height = 0;
  let bitDepth = 0;
  let colorType = 0;
  let idatBuffers = [];

  while (offset < buffer.length) {
    const length = buffer.readUInt32BE(offset);
    const type = buffer.toString('ascii', offset + 4, offset + 8);
    
    if (type === 'IHDR') {
      width = buffer.readUInt32BE(offset + 8);
      height = buffer.readUInt32BE(offset + 12);
      bitDepth = buffer[offset + 16];
      colorType = buffer[offset + 17];
    } else if (type === 'IDAT') {
      idatBuffers.push(buffer.subarray(offset + 8, offset + 8 + length));
    } else if (type === 'IEND') {
      break;
    }
    offset += 12 + length;
  }

  const compressedData = Buffer.concat(idatBuffers);
  const decompressedData = zlib.inflateSync(compressedData);

  // De-filter the scanlines
  // Color type 6 is RGBA (4 bytes per pixel)
  const bytesPerPixel = 4;
  const scanlineLength = width * bytesPerPixel + 1;
  const pixels = Buffer.alloc(width * height * bytesPerPixel);

  let prevScanline = Buffer.alloc(scanlineLength - 1);
  
  for (let y = 0; y < height; y++) {
    const scanlineStart = y * scanlineLength;
    const filterType = decompressedData[scanlineStart];
    const currentScanline = decompressedData.subarray(scanlineStart + 1, scanlineStart + scanlineLength);
    const reconScanline = Buffer.alloc(width * bytesPerPixel);

    for (let i = 0; i < reconScanline.length; i++) {
      const x = currentScanline[i];
      const a = i >= bytesPerPixel ? reconScanline[i - bytesPerPixel] : 0;
      const b = prevScanline[i];
      const c = i >= bytesPerPixel ? prevScanline[i - bytesPerPixel] : 0;

      let val = 0;
      if (filterType === 0) { // None
        val = x;
      } else if (filterType === 1) { // Sub
        val = (x + a) & 0xFF;
      } else if (filterType === 2) { // Up
        val = (x + b) & 0xFF;
      } else if (filterType === 3) { // Average
        val = (x + Math.floor((a + b) / 2)) & 0xFF;
      } else if (filterType === 4) { // Paeth
        const p = a + b - c;
        const pa = Math.abs(p - a);
        const pb = Math.abs(p - b);
        const pc = Math.abs(p - c);
        let pr = 0;
        if (pa <= pb && pa <= pc) pr = a;
        else if (pb <= pc) pr = b;
        else pr = c;
        val = (x + pr) & 0xFF;
      }
      reconScanline[i] = val;
    }

    reconScanline.copy(pixels, y * width * bytesPerPixel);
    prevScanline = reconScanline;
  }

  return { width, height, pixels };
}

function analyzeMuscles(filePath, label) {
  const { width, height, pixels } = parsePNG(filePath);
  const muscles = {};

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const r = pixels[idx];
      const g = pixels[idx + 1];
      const b = pixels[idx + 2];
      const a = pixels[idx + 3];

      if (a < 50) continue;

      let colorKey = '';
      if (r > 200 && g < 100 && b < 100) {
        colorKey = 'red';
      } else if (r > 200 && g > 200 && b < 100) {
        colorKey = 'yellow';
      } else if (r > 200 && g >= 100 && g <= 200 && b < 100) {
        colorKey = 'orange';
      }

      if (colorKey) {
        let muscleName = colorKey;
        if (label === 'front') {
          if (colorKey === 'red') {
            muscleName = y < 400 ? 'Chest' : 'Quads';
            muscleName += x < 300 ? 'Left' : 'Right';
          } else if (colorKey === 'yellow') {
            muscleName = 'Abs';
          } else if (colorKey === 'orange') {
            muscleName = y < 260 ? 'Shoulder' : 'Bicep';
            muscleName += x < 300 ? 'Left' : 'Right';
          }
        } else {
          if (colorKey === 'orange') {
            muscleName = y < 350 ? 'Traps' : 'Glutes';
            muscleName += x < 300 ? 'Left' : 'Right';
          } else if (colorKey === 'red') {
            muscleName = y < 400 ? 'Back' : 'Hamstrings';
            muscleName += x < 300 ? 'Left' : 'Right';
          } else if (colorKey === 'yellow') {
            muscleName = 'Lats';
            muscleName += x < 300 ? 'Left' : 'Right';
          }
        }

        if (!muscles[muscleName]) {
          muscles[muscleName] = { minX: x, maxX: x, minY: y, maxY: y, count: 0 };
        }
        const m = muscles[muscleName];
        m.minX = Math.min(m.minX, x);
        m.maxX = Math.max(m.maxX, x);
        m.minY = Math.min(m.minY, y);
        m.maxY = Math.max(m.maxY, y);
        m.count++;
      }
    }
  }

  console.log(`--- ${label.toUpperCase()} VIEW ---`);
  Object.entries(muscles).forEach(([name, box]) => {
    console.log(`${name}: minX=${box.minX}, maxX=${box.maxX}, minY=${box.minY}, maxY=${box.maxY}, pixels=${box.count}`);
  });
}

analyzeMuscles('c:/Users/ADMIN/Documents/WorkoutSplit/public/body-front.png', 'front');
analyzeMuscles('c:/Users/ADMIN/Documents/WorkoutSplit/public/body-back.png', 'back');
