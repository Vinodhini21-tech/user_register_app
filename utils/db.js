import mysql from 'mysql2/promise';
import fs from 'fs';

// Read Docker secrets
const dbUser = fs.readFileSync('/run/secrets/db_user', 'utf8').trim();
const dbPassword = fs.readFileSync('/run/secrets/db_password', 'utf8').trim();
const dbHost = fs.readFileSync('/run/secrets/db_host', 'utf8').trim();
const dbName = fs.readFileSync('/run/secrets/db_name', 'utf8').trim();

// Create MySQL connection pool
const db = mysql.createPool({
  host: dbHost,
  user: dbUser,
  password: dbPassword,
  database: dbName,
});

export default db;
