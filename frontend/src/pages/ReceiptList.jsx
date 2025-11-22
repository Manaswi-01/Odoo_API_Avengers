import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const ReceiptList = () => {
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const fetchReceipts = async () => {
      try {
        const res = await fetch('/api/receipts'); // adjust endpoint as needed
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (mounted) {
          setReceipts(data);
          setLoading(false);
        }
      } catch (err) {
        if (mounted) {
          setError(err.message);
          setLoading(false);
        }
      }
    };

    fetchReceipts();
    const interval = setInterval(fetchReceipts, 5000); // live update every 5s

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  if (loading) return <div>Loading receipts...</div>;
  if (error) return <div>Error loading receipts: {error}</div>;

  return (
    <div>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <h2>Receipts</h2>
        <Link to="/operations/receipt/new">
          <button>New Receipt</button>
        </Link>
      </div>

      {receipts.length === 0 ? (
        <div>No receipts found.</div>
      ) : (
        <ul>
          {receipts.map(r => (
            <li key={r.id}>
              <Link to={`/operations/receipt/${r.id}`}>
                {r.reference || `Receipt #${r.id}`} — {r.state || 'N/A'}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ReceiptList;