const path = require('path');
const { env } = require('../config/env');

module.exports = {
  client: 'pg',
  connection: {
    host: env.db.host,
    port: env.db.port,
    user: env.db.user,
    password: env.db.password,
    database: env.db.database,
  },
  pool: { min: 1, max: 10 },
  migrations: {
    directory: path.resolve(__dirname, '../../migrations'),
    extension: 'js',
    tableName: 'knex_migrations',
  },
};

