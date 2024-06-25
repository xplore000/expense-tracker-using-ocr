// YourComponent.js
import React, { useState } from 'react';
import Spinner from './Spinner';

const YourComponent = () => {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      // Simulate an asynchronous operation, e.g., fetching data
      await new Promise((resolve) => setTimeout(resolve, 2000));
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleClick}>Execute Function</button>
      {loading && <Spinner />}
    </div>
  );
};

export default YourComponent;
