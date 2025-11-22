// Use relative URL in development (Vite proxy) or absolute URL in production
const API_BASE_URL = import.meta.env.DEV ? '/api' : 'http://localhost:5000/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

// Auth API
export const authAPI = {
  login: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    return response.json();
  },

  signup: async (name, email, password, role = 'Staff') => {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Signup failed');
    }

    return response.json();
  },

  forgotPassword: async (email) => {
    const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to send OTP');
    }

    return response.json();
  },

  resetPassword: async (email, otp, newPassword) => {
    const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp, newPassword })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Password reset failed');
    }

    return response.json();
  },

  getMe: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user data');
    }

    return response.json();
  }
};

// Dashboard API
export const dashboardAPI = {
  getStats: async () => {
    const response = await fetch(`${API_BASE_URL}/dashboard/stats`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to fetch dashboard stats');
    }

    return response.json();
  }
};

// Products API
export const productsAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/products`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }

    return response.json();
  },

  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to fetch product');
    }

    return response.json();
  },

  create: async (productData) => {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(productData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create product');
    }

    return response.json();
  },

  update: async (id, productData) => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(productData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update product');
    }

    return response.json();
  },

  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to delete product');
    }

    return response.json();
  }
};

// Warehouses API
export const warehousesAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/warehouses`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to fetch warehouses');
    }

    return response.json();
  },

  create: async (warehouseData) => {
    const response = await fetch(`${API_BASE_URL}/warehouses`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(warehouseData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create warehouse');
    }

    return response.json();
  },

  update: async (id, warehouseData) => {
    const response = await fetch(`${API_BASE_URL}/warehouses/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(warehouseData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update warehouse');
    }

    return response.json();
  },

  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/warehouses/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to delete warehouse');
    }

    return response.json();
  }
};

// Transactions API
export const transactionsAPI = {
  getAll: async (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    const url = queryParams ? `${API_BASE_URL}/transactions?${queryParams}` : `${API_BASE_URL}/transactions`;

    const response = await fetch(url, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to fetch transactions');
    }

    return response.json();
  },

  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/transactions/${id}`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to fetch transaction');
    }

    return response.json();
  },

  update: async (id, transactionData) => {
    const response = await fetch(`${API_BASE_URL}/transactions/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(transactionData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update transaction');
    }

    return response.json();
  },

  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/transactions/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to delete transaction');
    }

    return response.json();
  }
};

// Receipt Workflow API
export const receiptsAPI = {
  create: async (receiptData) => {
    const response = await fetch(`${API_BASE_URL}/transactions/receipts`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(receiptData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create receipt');
    }

    return response.json();
  },

  updateCount: async (id, lines) => {
    const response = await fetch(`${API_BASE_URL}/transactions/receipts/${id}/count`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ lines })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update receipt count');
    }

    return response.json();
  },

  validate: async (id) => {
    const response = await fetch(`${API_BASE_URL}/transactions/receipts/${id}/validate`, {
      method: 'POST',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to validate receipt');
    }

    return response.json();
  }
};

// Delivery Workflow API
export const deliveriesAPI = {
  create: async (deliveryData) => {
    const response = await fetch(`${API_BASE_URL}/transactions/deliveries`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(deliveryData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create delivery');
    }

    return response.json();
  },

  checkAvailability: async (id) => {
    const response = await fetch(`${API_BASE_URL}/transactions/deliveries/${id}/check`, {
      method: 'POST',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to check availability');
    }

    return response.json();
  },

  markAsPacked: async (id) => {
    const response = await fetch(`${API_BASE_URL}/transactions/deliveries/${id}/pack`, {
      method: 'POST',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to mark as packed');
    }

    return response.json();
  },

  validate: async (id) => {
    const response = await fetch(`${API_BASE_URL}/transactions/deliveries/${id}/validate`, {
      method: 'POST',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to validate delivery');
    }

    return response.json();
  }
};

// Transfer Workflow API
export const transfersAPI = {
  create: async (transferData) => {
    const response = await fetch(`${API_BASE_URL}/transactions/transfers`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(transferData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create transfer');
    }

    return response.json();
  },

  validate: async (id) => {
    const response = await fetch(`${API_BASE_URL}/transactions/transfers/${id}/validate`, {
      method: 'POST',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to validate transfer');
    }

    return response.json();
  }
};

// Adjustment Workflow API
export const adjustmentsAPI = {
  create: async (adjustmentData) => {
    const response = await fetch(`${API_BASE_URL}/transactions/adjustments`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(adjustmentData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create adjustment');
    }

    return response.json();
  },

  approve: async (id, notes) => {
    const response = await fetch(`${API_BASE_URL}/transactions/adjustments/${id}/approve`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ notes })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to approve adjustment');
    }

    return response.json();
  }
};

// Partners API
export const partnersAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/partners`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to fetch partners');
    }

    return response.json();
  }
};

// Stock API
export const stockAPI = {
  getStockItems: async () => {
    const response = await fetch(`${API_BASE_URL}/stock/items`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to fetch stock items');
    }

    return response.json();
  },

  getStockByProduct: async (productId) => {
    const response = await fetch(`${API_BASE_URL}/stock/items/product/${productId}`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to fetch stock for product');
    }

    return response.json();
  },

  getStockLedger: async (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    const response = await fetch(`${API_BASE_URL}/stock/ledger?${queryParams}`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to fetch stock ledger');
    }

    return response.json();
  }
};

// User Management API
export const usersAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/users`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }

    return response.json();
  },

  updateRole: async (id, role) => {
    const response = await fetch(`${API_BASE_URL}/users/${id}/role`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ role })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update user role');
    }

    return response.json();
  },

  updateStatus: async (id, isActive) => {
    const response = await fetch(`${API_BASE_URL}/users/${id}/status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ isActive })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update user status');
    }

    return response.json();
  }
};
