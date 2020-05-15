const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const crypto = require('crypto');

const src_dir = './src/vocabulary';
const out_dir = './data';

const yml_files = [];
const json = [];

function collect_yml_files(yml_files, dir) {
  const files = fs.readdirSync(dir, { encoding: 'utf-8', withFileTypes: true });
  files.forEach(f => {
    if (f.isDirectory()) {
      collect_yml_files(yml_files, path.join(dir, f.name));
    } else if (f.isFile() && f.name.endsWith('.yaml')) {
      yml_files.push(path.join(dir, f.name));
    }
  });
}

collect_yml_files(yml_files, src_dir);

yml_files.forEach(f => {
  const name = path.basename(f, path.extname(f));
  const data = yaml.safeLoad(fs.readFileSync(f, 'utf-8'));
  json.push(...data.map(d => ({ ...d, category: name })));
});

function md5(value) {
  return crypto.createHash('md5').update(value).digest('hex');
}

fs.writeFileSync(path.join(out_dir, 'vocabulary.json'), JSON.stringify(json.map(j => ({ ...j, id: md5(`${j.J}${j.D}`) })), undefined, 2), { encoding: 'utf-8' });
