import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

const NewReceipt = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [warehouses, setWarehouses] = useState([]);
  const [products, setProducts] = useState([]);

  const [formData, setFormData] = useState({
    reference: '',
    warehouseId: '',
    defaultLocation: '',
    lines: [{ productId: '', qty: 1 }]
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Fetch Data on Mount
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [whRes, prodRes] = await Promise.all([
          fetch('/api/warehouses', { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch('/api/products', { headers: { 'Authorization': `Bearer ${token}` } })
        ]);

        if (whRes.ok) setWarehouses(await whRes.json());
        if (prodRes.ok) setProducts(await prodRes.json());
      } catch (err) {
        console.error("Failed to fetch data", err);
        setError("Failed to load form data");
      }
    };
    if (token) fetchData();
  }, [token]);

  const handleLineChange = (index, field, value) => {
    const newLines = [...formData.lines];
    newLines[index][field] = value;
    setFormData({ ...formData, lines: newLines });
  };

  const addLine = () => {
    setFormData({
      ...formData,
      lines: [...formData.lines, { productId: '', qty: 1 }]
    });
  };

  const removeLine = (index) => {
    if (formData.lines.length > 1) {
      const newLines = formData.lines.filter((_, i) => i !== index);
      setFormData({ ...formData, lines: newLines });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    // Validation
    if (!formData.warehouseId) {
      setError("Please select a warehouse");
      setSaving(false);
      return;
    }

    const validLines = formData.lines.filter(l => l.productId && l.qty > 0);
    if (validLines.length === 0) {
      setError("Please add at least one valid product line");
      setSaving(false);
      return;
    }

    const payload = {
      refNo: formData.reference,
      warehouseId: formData.warehouseId,
      lines: validLines.map(l => ({
        productId: l.productId,
        qty: parseInt(l.qty),
        locationTo: formData.defaultLocation || undefined // Use default location if set
      }))
    };

    try {
      const res = await fetch('/api/transactions/receipts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);

      navigate('/operations/receipt');
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  };

  // Get locations for selected warehouse
  const selectedWarehouse = warehouses.find(w => w._id === formData.warehouseId);
  const availableLocations = selectedWarehouse ? selectedWarehouse.locations : [];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <Navbar />

      <div className="container-main section-spacing">
        <div className="page-header">
          <button
            onClick={() => navigate('/operations/receipt')}
            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] mb-4 transition-colors duration-200"
          >
            ← Back to Receipts
          </button>
          <h1 className="page-title">Create New Receipt</h1>
          <p className="page-description">Add incoming stock to your warehouse inventory</p>
        </div>

        <div className="card card-padding max-w-4xl animate-fade-in">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Top Section: Reference & Warehouse */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                  Reference Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="input"
                  value={formData.reference}
                  onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                  placeholder="e.g., REC-2024-001"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                  Warehouse <span className="text-red-500">*</span>
                </label>
                <select
                  className="input"
                  value={formData.warehouseId}
                  onChange={(e) => setFormData({ ...formData, warehouseId: e.target.value, defaultLocation: '' })}
                  required
                >
                  <option value="">Select Warehouse</option>
                  {warehouses.map(w => (
                    <option key={w._id} value={w._id}>{w.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Default Location (Optional) */}
            {formData.warehouseId && (
              <div>
                <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                  Default Destination Location
                </label>
                <select
                  className="input"
                  value={formData.defaultLocation}
                  onChange={(e) => setFormData({ ...formData, defaultLocation: e.target.value })}
                >
                  <option value="">Select Location (Optional)</option>
                  {availableLocations.map(loc => (
                    <option key={loc.locationId} value={loc.locationId}>
                      {loc.name} ({loc.code})
                    </option>
                  ))}
                </select>
                <p className="text-xs text-[var(--text-tertiary)] mt-1">
                  Applied to all lines unless overridden (backend logic)
                </p>
              </div>
            )}

            <div className="border-t border-[var(--border-color)] my-6"></div>

            {/* Product Lines */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-[var(--text-primary)]">Product Lines</h3>
                <button type="button" onClick={addLine} className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                  + Add Line
                </button>
              </div>

              <div className="space-y-3">
                {formData.lines.map((line, index) => (
                  <div key={index} className="flex gap-4 items-start">
                    <div className="flex-1">
                      <select
                        className="input"
                        value={line.productId}
                        onChange={(e) => handleLineChange(index, 'productId', e.target.value)}
                        required
                      >
                        <option value="">Select Product</option>
                        {products.map(p => (
                          <option key={p._id} value={p._id}>{p.name} ({p.sku})</option>
                        ))}
                      </select>
                    </div>
                    <div className="w-32">
                      <input
                        type="number"
                        className="input"
                        value={line.qty}
                        onChange={(e) => handleLineChange(index, 'qty', e.target.value)}
                        min="1"
                        placeholder="Qty"
                        required
                      />
                    </div>
                    {formData.lines.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeLine(index)}
                        className="text-red-500 hover:text-red-700 p-2"
                        title="Remove line"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded">
                <div className="flex gap-3">
                  <span className="text-xl">⚠️</span>
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={saving}
                className="btn btn-primary flex-1"
              >
                {saving ? 'Creating...' : 'Create Receipt'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/operations/receipt')}
                disabled={saving}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewReceipt;