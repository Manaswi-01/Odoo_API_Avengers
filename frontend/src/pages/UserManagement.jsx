import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { usersAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user: currentUser, isManager } = useAuth();

    useEffect(() => {
        if (!isManager) {
            setError('Access denied. Manager role required.');
            setLoading(false);
            return;
        }
        fetchUsers();
    }, [isManager]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const data = await usersAPI.getAll();
            setUsers(data);
            setError('');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        try {
            await usersAPI.updateRole(userId, newRole);
            fetchUsers();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleStatusToggle = async (userId, currentStatus) => {
        try {
            await usersAPI.updateStatus(userId, !currentStatus);
            fetchUsers();
        } catch (err) {
            setError(err.message);
        }
    };

    if (!isManager) {
        return (
            <div className="min-h-screen bg-[var(--bg-primary)]">
                <Navbar />
                <div className="container-main section-spacing">
                    <div className="empty-state">
                        <div className="empty-state-icon">🔒</div>
                        <div className="empty-state-title">Access Denied</div>
                        <div className="empty-state-description">
                            Manager role required to access user management
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--bg-primary)]">
            <Navbar />

            <div className="container-main section-spacing">
                {/* Header */}
                <div className="page-header">
                    <div>
                        <h1 className="page-title">User Management</h1>
                        <p className="page-description">
                            Manage user roles and account status (Manager only)
                        </p>
                    </div>
                </div>

                {error && (
                    <div className="card card-padding mb-6 border-l-4 border-red-500 bg-red-50 text-red-700">
                        <p className="font-medium">{error}</p>
                    </div>
                )}

                {/* Users Table */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="spinner"></div>
                    </div>
                ) : users.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon">👥</div>
                        <div className="empty-state-title">No users found</div>
                    </div>
                ) : (
                    <div className="card card-padding">
                        <div className="overflow-x-auto -mx-8">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                        <th>Status</th>
                                        <th>Created</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user) => (
                                        <tr key={user._id}>
                                            <td>
                                                <div className="font-medium">{user.name}</div>
                                                {user._id === currentUser._id && (
                                                    <span className="text-xs text-[var(--text-tertiary)]">(You)</span>
                                                )}
                                            </td>
                                            <td className="text-[var(--text-secondary)]">{user.email}</td>
                                            <td>
                                                <select
                                                    className="input py-1 px-2 text-sm"
                                                    value={user.role}
                                                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                                    disabled={user._id === currentUser._id}
                                                >
                                                    <option value="Manager">Manager</option>
                                                    <option value="Staff">Staff</option>
                                                </select>
                                            </td>
                                            <td>
                                                <button
                                                    onClick={() => handleStatusToggle(user._id, user.isActive)}
                                                    disabled={user._id === currentUser._id}
                                                    className={`px-3 py-1 rounded-full text-sm font-medium ${user.isActive
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-red-100 text-red-800'
                                                        } ${user._id === currentUser._id ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:opacity-80'}`}
                                                >
                                                    {user.isActive ? 'Active' : 'Inactive'}
                                                </button>
                                            </td>
                                            <td className="text-[var(--text-secondary)]">
                                                {new Date(user.createdAt).toLocaleDateString()}
                                            </td>
                                            <td>
                                                {user._id === currentUser._id ? (
                                                    <span className="text-xs text-[var(--text-tertiary)]">
                                                        Cannot modify self
                                                    </span>
                                                ) : (
                                                    <span className="text-xs text-[var(--text-tertiary)]">
                                                        Use dropdowns
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <p className="text-sm text-blue-800">
                                <strong>Note:</strong> You cannot change your own role or deactivate your own account.
                                Role changes take effect immediately. Inactive users cannot log in.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserManagement;
