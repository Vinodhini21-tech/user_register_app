// /pages/api/users/[id].js
import db from '../../../utils/db';

export default async function handler(req, res) {
  const { id } = req.query; // Extract the user ID from the URL

  if (req.method === 'PUT') {
    console.log('put request')
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    try {
      // Update the user details in the database
      const [result] = await db.query(
        'UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?',
        [name, email, password, id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.status(200).json({ message: 'User updated successfully', user: { id, name, email, password } });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to update user' });
    }
  } else if (req.method === 'DELETE') {
    try {
      // Delete the user from the database
      const [result] = await db.query('DELETE FROM users WHERE id = ?', [id]);

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to delete user' });
    }
  } else {
    // Return 405 for unsupported HTTP methods
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
