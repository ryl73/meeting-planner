const fs = require('fs');

fs.copyFileSync('.env.example', '.env');

fs.mkdirSync('tmp/pgdata', { recursive: true });
