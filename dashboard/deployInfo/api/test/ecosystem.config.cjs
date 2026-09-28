module.exports = {
  apps: [
    {
      name: 'auto_tags_api',
      script: 'dist/main.js',
      instances: 1,
      exec_mode: 'fork',
      kill_timeout: 10000,
      listen_timeout: 10000,
      wait_ready: false,
      watch: false,
      autorestart: true,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        API_PORT: 3016,
        LOG_PRETTY: 'false',
      },
    },
  ],
};
