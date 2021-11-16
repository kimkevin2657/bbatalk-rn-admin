var ignoreWatch = [
  'node_modules',
  'logs',
  'data',
  'dist',
  'conf'
]
// Options reference: https://pm2.keymetrics.io/docs/usage/application-declaration/
module.exports = {
  apps : [
  {
    name: 'server-1',
    script: 'index.js',
    autorestart: true,
    watch: true,
    ignore_watch: ignoreWatch,
    max_memory_restart: '1000M',
    env: {
      'PORT': '3000',
      'NODE_ENV': 'production'
    }
  },
  {
    name: 'server-2',
    script: 'index.js',
    autorestart: true,
    watch: true,
    ignore_watch: ignoreWatch,
    max_memory_restart: '1000M',
    env: {
      'PORT': '3001',
      'NODE_ENV': 'production'
    }
  },
  {
    name: 'server-3',
    script: 'index.js',
    autorestart: true,
    watch: true,
    ignore_watch: ignoreWatch,
    max_memory_restart: '1000M',
    env: {
      'PORT': '3002',
      'NODE_ENV': 'production'
    }
  },
  {
    name: 'server-4',
    script: 'index.js',
    autorestart: true,
    watch: true,
    ignore_watch: ignoreWatch,
    max_memory_restart: '1000M',
    env: {
      'PORT': '3003',
      'NODE_ENV': 'production'
    }
  },
  ]
};