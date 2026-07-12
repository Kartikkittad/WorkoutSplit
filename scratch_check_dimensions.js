const fs = require('fs');
const path = require('path');

const files = [
  'c:/Users/ADMIN/Documents/WorkoutSplit/public/body-front.png',
  'c:/Users/ADMIN/Documents/WorkoutSplit/public/body-back.png'
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    const buffer = fs.readFileSync(file);
    // PNG dimensions are at offset 16 (width) and 20 (height) as 4-byte big-endian integers
    const width = buffer.readUInt32BE(16);
    const height = buffer.readUInt32BE(20);
    console.log(`${path.basename(file)}: ${width}x${height}`);
  } else {
    console.log(`${file} does not exist`);
  }
});
