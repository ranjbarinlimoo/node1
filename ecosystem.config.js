module.exports = {
  apps: [
    {
      name: 'server',
      exec_mode: 'cluster',
      instances: 'max',
      script: './server.js',
      args: 'production',
    },
  ],
}
