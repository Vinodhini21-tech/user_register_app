// src/components/GetDatabaseComponent.js

export async function fetchData() {
    try {
      const response = await fetch('/api/getDataMariadb'); // Adjust the API route accordingly
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  }
  