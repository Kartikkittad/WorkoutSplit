const fs = require('fs');
const zlib = require('zlib');

function parsePNG(filePath) {
  const buffer = fs.readFileSync(filePath);
  let offset = 8;
  let width = 0;
  let height = 0;
  let idatBuffers = [];
  while (offset < buffer.length) {
    const length = buffer.readUInt32BE(offset);
    const type = buffer.toString('ascii', offset + 4, offset + 8);
    if (type === 'IHDR') {
      width = buffer.readUInt32BE(offset + 8);
      height = buffer.readUInt32BE(offset + 12);
    } else if (type === 'IDAT') {
      idatBuffers.push(buffer.subarray(offset + 8, offset + 8 + length));
    } else if (type === 'IEND') break;
    offset += 12 + length;
  }
  const compressedData = Buffer.concat(idatBuffers);
  const decompressedData = zlib.inflateSync(compressedData);
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
      if (filterType === 0) val = x;
      else if (filterType === 1) val = (x + a) & 0xFF;
      else if (filterType === 2) val = (x + b) & 0xFF;
      else if (filterType === 3) val = (x + Math.floor((a + b) / 2)) & 0xFF;
      else if (filterType === 4) {
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

const { width, height, pixels } = parsePNG('c:/Users/ADMIN/Documents/WorkoutSplit/public/body-back.png');

console.log('Sample pixels on right side (x = 350):');
for (let y = 180; y <= 550; y += 30) {
  const x = 350;
  const idx = (y * width + x) * 4;
  console.log(`y=${y}: R=${pixels[idx]} G=${pixels[idx+1]} B=${pixels[idx+2]} A=${pixels[idx+3]}`);
}
