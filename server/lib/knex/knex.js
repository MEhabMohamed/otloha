const knex = require('knex');
const knexConfig = require('./knexfile');

const db = knex(knexConfig);
const runMigrations = () => db.migrate.latest();
const closeKnex = () => db.destroy();

module.exports = { db, runMigrations, closeKnex };

