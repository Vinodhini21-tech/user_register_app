// pages/register.js
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Register() {
  const [formData, setFormData] = useState({name: '',email: '',password: ''});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  
  console.log(formData);
  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  console.log(formData);
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Perform validation (basic for demonstration)
    if (!formData.name || !formData.email || !formData.password) {
      setError('All fields are required.');
      setLoading(false);
      return;
    }

    try {
      // Simulate an API call for registration (replace with real API logic)
      // Here we are just logging to the console.
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Redirect to login page or dashboard after successful registration
        console.log(response)
        setFormData({name: '',email: '',password: ''})
        alert('User Registered Successfully !');
        //router.push('/login');
      } else {
        setError('Registration failed. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Register</h1>
      <form onSubmit={handleSubmit} >
        <div>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
        </div>

        {error && <p className="error">{error}</p>}

        <button type="submit" disabled={loading} align="center">
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>

      <style jsx>{`
  .container {
    max-width: 600px;
    margin: 0 auto;
    padding: 40px;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    text-align: center;
  }

  h1 {
    font-size: 28px;
    font-weight: bold;
    color: #333;
    margin-bottom: 20px;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  label {
    font-size: 14px;
    font-weight: 600;
    text-align: left;
    color: #555;
  }

  input {
    padding: 12px;
    margin: 5px 0;
    border: 1px solid #ccc;
    border-radius: 8px;
    font-size: 16px;
    width: 100%;
    transition: all 0.3s ease;
  }

  input:focus {
    border-color: #0070f3;
    outline: none;
    box-shadow: 0 0 5px rgba(0, 112, 243, 0.2);
  }

  .error {
    color: red;
    font-size: 14px;
    margin-top: 10px;
  }

  button {
    padding: 12px 20px;
    background-color: #0070f3;
    color: white;
    font-size: 16px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  button:hover:not(:disabled) {
    background-color: #005bb5;
  }

  button:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`}</style>

    </div>
  );
}
