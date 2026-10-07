const fs = require('fs');

const transcriptPath = 'C:\\Users\\User\\.gemini\\antigravity\\brain\\042fac39-0515-4f87-88d6-b830bd5c336c\\.system_generated\\logs\\transcript_full.jsonl';
const fileContent = fs.readFileSync(transcriptPath, 'utf8');
const lines = fileContent.split('\n');

for (let i = lines.length - 1; i >= 0; i--) {
  if (lines[i].includes('prod_1790799592574')) {
    try {
      const obj = JSON.parse(lines[i]);
      if (obj.content && obj.content.includes('"gallery"')) {
        console.log('Found gallery on line', i, 'Content len:', obj.content.length);
        const gIdx = obj.content.indexOf('"gallery":[');
        if (gIdx !== -1) {
          console.log('Gallery starts at:', gIdx);
          const endG = obj.content.indexOf(']', gIdx);
          console.log('Gallery ends at:', endG);
          if (endG !== -1) {
            const galStr = obj.content.substring(gIdx + 10, endG + 1);
            fs.writeFileSync('extracted_gallery.json', galStr);
            console.log('Saved extracted_gallery.json! Length:', galStr.length);
          }
        }
        break;
      }
    } catch(e) {}
  }
}
