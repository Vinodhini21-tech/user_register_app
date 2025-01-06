import mysql from 'mysql2/promise';
import db from '../../../utils/db';

// const db = mysql.createPool({
//   host: '164.92.228.144',
//   user: 'vinodhini',
//   password: 'vi123',
//   database: 'test',
// });

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const [rows] = await db.query('SELECT * FROM users');
      res.status(200).json(rows);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch users' });
    }
  } else if (req.method === 'POST') {
    const { name, email, password } = req.body;
    try {
      const [result] = await db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, password]);
      res.status(201).json({ id: result.insertId, name, email, password });
    } catch (error) {
      res.status(500).json({ error: 'Failed to add user' });
    }
  }
}
