// src/components/YourComponent.js

'use client'

import React, { useEffect, useState } from 'react';
import { fetchData } from './GetDatabaseComponent';

const YourComponent = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchDataFromApi = async () => {
      try {
        const result = await fetchData();
        setData(result);

        // Log the result and updated data inside useEffect
        console.log('result:', result);
      } catch (error) {
        console.error('Error in component:', error);
      }
    };

    fetchDataFromApi();
  }, []);

  return (
    <div >
      {data ? (
        <pre> {data} </pre>
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
};

export default YourComponent;
