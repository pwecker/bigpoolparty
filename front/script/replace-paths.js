import { replaceInFile } from 'replace-in-file'
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

const options = [
  {
    files: join(__dirname, '../dist/lib/**/*.js'),
    from: /(\/lib\/)/g,
    to: 'https://bigpoolparty.com/lib/',
  },
  {
    files: join(__dirname, '../dist/lib/**/*.js'),
    from: /http:\/\/localhost:1337\/api\//g,
    to: 'https://bigpoolparty-production.up.railway.app/api/',
  }
];

(async () => {
  try {
    for (const opt of options) {
      const results = await replaceInFile(opt);
      console.log('Replacement results:', results);
    }
  } catch (error) {
    console.error('Error occurred:', error);
  }
})();