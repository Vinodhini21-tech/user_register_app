import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalMessage, setModalMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null); // For edit purposes
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '' });

  const router = useRouter();

  // Fetch the users when the component loads
  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch('/api/users');
      const data = await res.json();
      console.log(data);
      setUsers(data);
      setLoading(false);
    };

    fetchUsers();
  }, []);

  // Delete user
  const handleDelete = async (id) => {
    const response = await fetch(`/api/users/${id}`, { method: 'DELETE' });
    console.log(response);
    if (response.ok) {
      setUsers(users.filter(user => user.id !== id));
      setModalMessage('User deleted successfully.');
      setShowModal(true);
    }
  };

  // Handle edit (for now, set user to edit)
  const handleEdit = (user) => {
    setSelectedUser(user);
    setNewUser({ name: user.name, email: user.email, password: '' }); // Pre-fill the fields
    setShowModal(true);  // Open modal when editing
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    try {
      const response = await fetch(`/api/users/${selectedUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });
  
      const result = await response.json();
      console.log('Edit User Response:', result);
  
      if (response.ok) {
        // Update users list
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === selectedUser.id ? { ...user, ...newUser } : user
          )
        );
        setModalMessage('User updated successfully.'); // Set success message
        setShowModal(true); // Show the modal
        setSelectedUser(null); // Clear selected user
      } else {
        // Handle error
        setModalMessage(result.error || 'Failed to update user.');
        setShowModal(true); // Show error message
      }
    } catch (error) {
      console.error('Error updating user:', error);
      setModalMessage('An unexpected error occurred.');
      setShowModal(true);
    }
  };
  
  // Handle adding new user
  const handleAddUser = async (e) => {
    e.preventDefault();
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser),
    });
    if (response.ok) {
      const newUserData = await response.json();
      setUsers([...users, newUserData]);
      setModalMessage('User added successfully.');
      setShowModal(true);
      setNewUser({ name: '', email: '', password: '' }); // Reset the form
    }
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedUser(null);  // Clear selected user when closing
    setNewUser({ name: '', email: '', password: '' });  // Clear form fields
  };

  
  return (
    <div className="container">
      <h1>Admin Dashboard</h1>
      
      <form onSubmit={handleAddUser}>
        <input
          type="text"
          placeholder="Name"
          value={newUser.name}
          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={newUser.password}
          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
          required
        />
        <button type="submit">Add User</button>
      </form>

      {loading ? (
        <p>Loading users...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <button onClick={() => handleEdit(user)}>Edit</button>
                  <button onClick={() => handleDelete(user.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal for success/error message */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{modalMessage}</h2>
            <button onClick={closeModal}>Close</button>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {selectedUser && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Edit User</h2>
            <form onSubmit={handleSaveEdit}>
              <input
                type="text"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              />
              <input
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              />
              <input
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              />
              <button type="submit">Submit</button>
              <button onClick={closeModal}>Cancel</button>
            </form>
           
          </div>
        </div>
      )}

<style jsx>{`
  .container {
    max-width: 900px;
    margin: 0 auto;
    padding: 40px;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    text-align: center;
  }

  h1 {
    margin-bottom: 30px;
    font-size: 2rem;
    color: #333;
  }

  form {
    margin-bottom: 40px;
    display: flex;
    flex-direction: column;
    gap: 15px;
    align-items: center;
  }

  input {
    width: 100%;
    max-width: 400px;
    padding: 12px;
    margin: 0;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 1rem;
    box-sizing: border-box;
    transition: border-color 0.3s;
  }

  input:focus {
    border-color: #5c9bf3;
    outline: none;
  }

  button {
    padding: 10px 20px;
    font-size: 1rem;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  button:hover {
    background-color: #0056b3;
  }

  table {
    width: 100%;
    margin-top: 30px;
    border-collapse: collapse;
  }

  th, td {
    padding: 15px;
    border: 1px solid #ddd;
    text-align: left;
  }

  th {
    background-color: #f4f4f4;
    font-weight: bold;
  }

  tbody tr:nth-child(odd) {
    background-color: #f9f9f9;
  }

  tbody tr:hover {
    background-color: #f1f1f1;
  }

  button {
    padding: 8px 16px;
    margin: 5px;
    background-color: #ff6347;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  button:hover {
    background-color: #e53e3e;
  }

  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0;
    animation: fadeIn 0.3s forwards;
  }

  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  .modal-content {
    background: white;
    padding: 30px;
    border-radius: 8px;
    text-align: center;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    width: 90%;
    max-width: 500px;
  }

  .modal-content h2 {
    margin-bottom: 20px;
    font-size: 1.5rem;
    color: #333;
  }

  .modal-content button {
    background-color: #28a745;
    margin-top: 20px;
  }

  .modal-content button:hover {
    background-color: #218838;
  }

  .modal-content .close-btn {
    background-color: #dc3545;
  }

  .modal-content .close-btn:hover {
    background-color: #c82333;
  }
`}</style>

    </div>
  );
}
