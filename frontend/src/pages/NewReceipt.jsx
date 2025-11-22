import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const NewReceipt = () => {
  const navigate = useNavigate();
  const [reference, setReference] = useState('');
  const [location, setLocation] = useState('');
  const [lines, setLines] = useState(''); // simple textarea for items
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      reference,
      location,
      lines, // backend should parse lines or adapt payload shape
    };

    try {
      const res = await fetch('/api/receipts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      // optionally read created receipt
      // const created = await res.json();
      navigate('/operations/receipt');
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  };

  return (
    <div>
      <h2>New Receipt</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Reference</label><br />
          <input value={reference} onChange={e => setReference(e.target.value)} required />
        </div>
        <div>
          <label>Location</label><br />
          <input value={location} onChange={e => setLocation(e.target.value)} />
        </div>
        <div>
          <label>Lines (one per line: product qty)</label><br />
          <textarea value={lines} onChange={e => setLines(e.target.value)} rows={6} />
        </div>

        {error && <div style={{color: 'red'}}>Error: {error}</div>}

        <div style={{marginTop: 10}}>
          <button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Create Receipt'}</button>
          <button type="button" onClick={() => navigate('/operations/receipt')} style={{marginLeft: 8}}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default NewReceipt;