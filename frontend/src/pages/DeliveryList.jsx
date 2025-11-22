import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const DeliveryList = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const fetchDeliveries = async () => {
      try {
        const res = await fetch('/api/deliveries'); // adjust endpoint as needed
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (mounted) {
          setDeliveries(data);
          setLoading(false);
        }
      } catch (err) {
        if (mounted) {
          setError(err.message);
          setLoading(false);
        }
      }
    };

    fetchDeliveries();
    const interval = setInterval(fetchDeliveries, 5000); // live update every 5s

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  if (loading) return <div>Loading deliveries...</div>;
  if (error) return <div>Error loading deliveries: {error}</div>;

  return (
    <div>
      <h2>Deliveries</h2>
      {deliveries.length === 0 ? (
        <div>No deliveries found.</div>
      ) : (
        <ul>
          {deliveries.map(d => (
            <li key={d.id}>
              <Link to={`/operations/delivery/${d.id}`}>
                {d.reference || `Delivery #${d.id}`} — {d.state || 'N/A'}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DeliveryList;