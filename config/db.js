const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Necesario para Render
  },
});

pool.connect()
  .then(() => console.log('Conexión a la base de datos PostgreSQL establecida'))
  .catch(err => {
    console.error('Error al conectar a la base de datos PostgreSQL:', err);
    process.exit(1);
  });

module.exports = pool;