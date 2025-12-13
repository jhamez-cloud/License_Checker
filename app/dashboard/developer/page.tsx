// app/dashboard/developer/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { getLicenses } from '@/lib/storage';
import { getLicenseStatus, calculateTimeRemaining } from '@/lib/licenseUtils';
import { Code, Clock, AlertTriangle, RefreshCw, XCircle, CheckCircle } from 'lucide-react';
import { License } from '@/lib/types';

export default function DeveloperDashboard() {
    const [licenses, setLicenses] = useState<License[]>([]);

    const fetchLicenses = useCallback(() => {
        setLicenses(getLicenses());
    }, []);

    useEffect(() => {
        fetchLicenses();
    }, [fetchLicenses]);

    const handleRequestUpdate = (licenseName: string) => {
        // Client-side simulation of sending a request to the manager
        const managerEmail = process.env.NEXT_PUBLIC_MANAGER_EMAIL || "manager@corp.com";
        alert(`Update request for license "${licenseName}" sent to the manager at ${managerEmail}!`);
        // In a real app, you would send this to an API endpoint.
    };

    const getStatusStyle = (status: 'Active' | 'Expired' | 'Expiring Soon') => {
        switch (status) {
            case 'Active':
                return 'bg-green-100 text-green-800 border-green-400';
            case 'Expiring Soon':
                return 'bg-yellow-100 text-yellow-800 border-yellow-400';
            case 'Expired':
                return 'bg-red-100 text-red-800 border-red-400';
        }
    };

    const getStatusIcon = (status: 'Active' | 'Expired' | 'Expiring Soon') => {
        switch (status) {
            case 'Active':
                return <CheckCircle className="w-4 h-4 mr-1" />;
            case 'Expiring Soon':
                return <AlertTriangle className="w-4 h-4 mr-1" />;
            case 'Expired':
                return <XCircle className="w-4 h-4 mr-1" />;
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-extrabold text-gray-900 flex items-center">
                <Code className="w-8 h-8 mr-3 text-green-600" />
                Developer: License Viewer
            </h2>

            {licenses.length === 0 ? (
                <div className="p-10 text-center bg-white rounded-lg shadow">
                    <p className="text-lg text-gray-500">No licenses found. Please ask your Legal Officer to add some.</p>
                </div>
            ) : (
                <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">License Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time Left</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {licenses.map((license) => {
                            const status = getLicenseStatus(license.expirationDate);
                            const timeRemaining = calculateTimeRemaining(license.expirationDate);
                            return (
                                <tr key={license.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {license.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStatusStyle(status)}`}>
                        {getStatusIcon(status)}
                          {status}
                      </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <div className="flex items-center">
                                            <Clock className="w-4 h-4 mr-2" />
                                            {status === 'Expired' ? '0y, 0m, 0d, 0hrs, 0mins' : timeRemaining}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button
                                            onClick={() => handleRequestUpdate(license.name)}
                                            disabled={status === 'Active'}
                                            className={`text-indigo-600 hover:text-indigo-900 disabled:text-gray-400 disabled:cursor-not-allowed flex items-center`}
                                        >
                                            <RefreshCw className="w-4 h-4 mr-1" />
                                            Request Update
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}