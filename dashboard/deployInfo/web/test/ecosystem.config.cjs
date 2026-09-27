module.exports = {
  apps: [
    {
      name: 'auto_tags_web',
      script: 'apps/web/server.js',
      instances: 1,
      exec_mode: 'fork',
      kill_timeout: 5000,
      watch: false,
      autorestart: true,
      max_memory_restart: '768M',
      env: {
        NODE_ENV: 'production',
        PORT: 3004,
        HOSTNAME: '127.0.0.1',
      },
    },
  ],
};
