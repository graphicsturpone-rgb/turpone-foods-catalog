const fs = require('fs');

const transcriptPath = 'C:\\Users\\User\\.gemini\\antigravity\\brain\\042fac39-0515-4f87-88d6-b830bd5c336c\\.system_generated\\logs\\transcript_full.jsonl';
const fileContent = fs.readFileSync(transcriptPath, 'utf8');
const lines = fileContent.split('\n');
const line = lines[3937];
const obj = JSON.parse(line);
const content = obj.content;

let pos = 0;
let idx = 1;
while ((pos = content.indexOf('data:image/', pos)) !== -1) {
  const quoteEnd = content.indexOf('"', pos);
  console.log(`Image ${idx} starts at ${pos}, ends at ${quoteEnd}, length: ${quoteEnd - pos}`);
  if (quoteEnd !== -1 && idx > 1) { // 1 is main image, 2 and 3 are gallery images!
    const dataUrl = content.substring(pos, quoteEnd);
    const base64Str = dataUrl.replace(/^data:image\/\w+;base64,/, '');
    fs.writeFileSync(`assets/images/ca_imgs/Organic-Pinsa-Crust-gallery-${idx - 1}.webp`, Buffer.from(base64Str, 'base64'));
    console.log(`Saved assets/images/ca_imgs/Organic-Pinsa-Crust-gallery-${idx - 1}.webp (size: ${fs.statSync(`assets/images/ca_imgs/Organic-Pinsa-Crust-gallery-${idx - 1}.webp`).size})`);
  }
  pos = quoteEnd !== -1 ? quoteEnd : pos + 11;
  idx++;
}
