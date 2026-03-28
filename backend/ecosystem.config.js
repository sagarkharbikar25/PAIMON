module.exports = {
  apps: [{
    name: 'pravas-api',
    script: 'src/index.js',
    instances: 'max',
    exec_mode: 'cluster',
    watch: false,
    max_memory_restart: '500M',
    env_production: {
      NODE_ENV: 'production',
      PORT: 5000,
    },
    error_file: 'logs/err.log',
    out_file: 'logs/out.log',
    merge_logs: true,
  }],
};