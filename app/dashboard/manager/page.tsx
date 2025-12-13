// app/dashboard/manager/page.tsx
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { getLicenses, getStoredUsers, addNewUser } from '@/lib/storage';
import { getLicenseStatus, calculateTimeRemaining } from '@/lib/licenseUtils';
import {User, Users, FileText, Plus, Briefcase, Code, Clock} from 'lucide-react';
import { License, Role, UsersStore } from '@/lib/types';

export default function ManagerDashboard() {
    const [licenses, setLicenses] = useState<License[]>([]);
    const [users, setUsers] = useState<UsersStore>({});

    // State for adding new user
    const [newEmail, setNewEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newRole, setNewRole] = useState<Role>('developer');

    const fetchData = useCallback(() => {
        setLicenses(getLicenses());
        setUsers(getStoredUsers());
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleAddNewUser = (e: React.FormEvent) => {
        e.preventDefault();
        if (users[newEmail]) {
            alert('User with this email already exists!');
            return;
        }

        addNewUser(newEmail, newPassword, newRole);
        fetchData(); // Refresh user list
        alert(`New ${newRole} user "${newEmail}" added successfully.`);
        setNewEmail('');
        setNewPassword('');
    };

    const getUserRoleIcon = (role: Role) => {
        switch (role) {
            case 'legal_officer': return <Briefcase className="w-4 h-4 mr-1 text-blue-500" />;
            case 'developer': return <Code className="w-4 h-4 mr-1 text-green-500" />;
            case 'manager': return <User className="w-4 h-4 mr-1 text-purple-500" />;
        }
    }

    // Uses the same license table logic as the developer, but without the "Request Update" button.
    const getStatusStyle = (status: 'Active' | 'Expired' | 'Expiring Soon') => {
        // ... (Use the same logic from DeveloperDashboard)
        switch (status) {
            case 'Active': return 'bg-green-100 text-green-800 border-green-400';
            case 'Expiring Soon': return 'bg-yellow-100 text-yellow-800 border-yellow-400';
            case 'Expired': return 'bg-red-100 text-red-800 border-red-400';
        }
    };

    return (
        <div className="space-y-10">
            <h2 className="text-3xl font-extrabold text-gray-900 flex items-center">
                <User className="w-8 h-8 mr-3 text-purple-600" />
                Manager: Administration Panel
            </h2>

            {/* License Status Overview Section */}
            <section>
                <h3 className="text-xl font-semibold text-gray-800 flex items-center mb-4 border-b pb-2">
                    <FileText className="w-5 h-5 mr-2" /> License Status & Expiry Time
                </h3>
                <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        {/* ... (Table Headers: Name, Status, Time Left) */}
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">License Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time Left</th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {licenses.map((license) => {
                            const status = getLicenseStatus(license.expirationDate);
                            const timeRemaining = calculateTimeRemaining(license.expirationDate);
                            return (
                                <tr key={license.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{license.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStatusStyle(status)}`}>
                        {status}
                      </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <div className="flex items-center">
                                            <Clock className="w-4 h-4 mr-2" />
                                            {status === 'Expired' ? '0y, 0m, 0d, 0hrs, 0mins' : timeRemaining}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* User Management Section */}
            <section>
                <h3 className="text-xl font-semibold text-gray-800 flex items-center mb-4 border-b pb-2">
                    <Users className="w-5 h-5 mr-2" /> User Management
                </h3>

                {/* Add New Authenticated User Form */}
                <div className="bg-white p-6 rounded-xl shadow-lg mb-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center"><Plus className="w-4 h-4 mr-2" /> Add New User</h4>
                    <form onSubmit={handleAddNewUser} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label htmlFor="user-email" className="block text-sm font-medium text-gray-700">Email</label>
                                <input
                                    type="email"
                                    id="user-email"
                                    required
                                    value={newEmail}
                                    onChange={(e) => setNewEmail(e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-purple-500 focus:border-purple-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="user-password" className="block text-sm font-medium text-gray-700">Password</label>
                                <input
                                    type="text"
                                    id="user-password"
                                    required
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-purple-500 focus:border-purple-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="user-role" className="block text-sm font-medium text-gray-700">Role</label>
                                <select
                                    id="user-role"
                                    required
                                    value={newRole}
                                    onChange={(e) => setNewRole(e.target.value as Role)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-purple-500 focus:border-purple-500"
                                >
                                    <option value="developer">Developer</option>
                                    <option value="legal_officer">Legal Officer</option>
                                    <option value="manager">Manager</option>
                                </select>
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                        >
                            <Plus className="w-5 h-5 mr-2" /> Create User
                        </button>
                    </form>
                </div>

                {/* Current Authenticated Users List */}
                <h4 className="text-lg font-medium text-gray-900 mb-4 mt-6">Current System Users</h4>
                <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {Object.entries(users).map(([email, user]) => (
                            <tr key={email}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{email}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex items-center">
                                    {getUserRoleIcon(user.role)}
                                    {user.role.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}