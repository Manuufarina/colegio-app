const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://colegio_app_user:1dCtkbMgiyqDdVTY52u2VMRNjHY91WOt@dpg-cv7d23l2ng1s7384efgg-a.oregon-postgres.render.com/colegio_app',
  ssl: { rejectUnauthorized: false } // Necesario para conexiones en Render
});

// Ejemplo de consulta
pool.query('SELECT * FROM años_lectivos', (err, res) => {
  if (err) {
    console.error('Error ejecutando la consulta:', err);
  } else {
    console.log('Resultado:', res.rows);
  }
  pool.end(); // Cierra la conexión tras la consulta
});