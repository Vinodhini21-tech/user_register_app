// pages/api/register.js
import db from '../../utils/db'; // Import the DB connection

// Registration API route
export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, email, password } = req.body;

    // Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Basic email validation
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    try {
      // Insert the user data into the database
      const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';

      // Use promise-based query (await it)
      const [result] = await db.execute(query, [name, email, password]);

      // Successfully inserted the user
      return res.status(200).json({ message: 'User registered successfully' });
    } catch (error) {
      console.error('Error occurred:', error);
      return res.status(500).json({ error: 'An error occurred while processing the request' });
    }
  } else {
    // If not POST request, return 405 (Method Not Allowed)
    return res.status(405).json({ error: 'Method not allowed' });
  }
}
