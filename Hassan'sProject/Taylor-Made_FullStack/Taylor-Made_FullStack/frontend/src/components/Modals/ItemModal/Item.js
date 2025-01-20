import React, { useState, useEffect } from 'react';
import Api from '../../../utils/Api';

function Item() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Api.getItems()
      .then((data) => {
        setItems(data);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className='items-list'>
      {items.map((item) => (
        <div key={item._id} className='item-card'>
          <h3>{item.name}</h3>
          <p>{item.description}</p>
          <p>Price: ${item.price}</p>
          {/* Add more item details as needed */}
        </div>
      ))}
    </div>
  );
}

export default Item;
