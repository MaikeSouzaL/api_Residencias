import pg from 'pg';

// Configuração da conexão com o banco de dados PostgreSQL
const pool = new pg.Pool({
  user: 'postgres',
  password: 'admin',
  host: 'localhost',
  database: 'facilita_juridico',
  port: 5433,
});
export default pool;
