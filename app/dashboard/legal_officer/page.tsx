// app/dashboard/legal_officer/page.tsx
'use client';

import { useState, useMemo } from 'react';
import { saveLicense, getCurrentUser } from '@/lib/storage';
import { calculateTimeRemaining } from '@/lib/licenseUtils';
import { Briefcase, Clock, CheckCircle } from 'lucide-react';
import { License } from '@/lib/types';

export default function LegalOfficerDashboard() {
    const [licenseName, setLicenseName] = useState('');
    const [startDate, setStartDate] = useState('');
    const [expirationDate, setExpirationDate] = useState('');
    const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

    const currentUser = useMemo(() => getCurrentUser(), []);

    // Real-time calculation using useMemo for performance
    const timeRemaining = useMemo(() => {
        if (!expirationDate) return 'Enter an expiration date to calculate.';
        return calculateTimeRemaining(expirationDate);
    }, [expirationDate]);

    const handleSaveLicense = (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUser) return;

        try {
            const newLicense: Omit<License, 'id'> = {
                name: licenseName,
                startDate: new Date(startDate).toISOString(),
                expirationDate: new Date(expirationDate).toISOString(),
                addedBy: currentUser.email,
            };

            saveLicense(newLicense);
            setMessage({ text: `License "${licenseName}" successfully added!`, type: 'success' });

            // Reset form
            setLicenseName('');
            setStartDate('');
            setExpirationDate('');
        } catch (error) {
            console.error(error);
            setMessage({ text: 'Error saving license. Please check dates.', type: 'error' });
        }
    };

    return (
        <div className="space-y-8 max-w-4xl">
            <h2 className="text-3xl font-extrabold text-gray-900 flex items-center">
                <Briefcase className="w-8 h-8 mr-3 text-indigo-600" />
                Legal Officer: New License Entry
            </h2>

            {message && (
                <div className={`p-4 rounded-lg shadow-sm ${message.type === 'success' ? 'bg-green-100 border-l-4 border-green-500 text-green-700' : 'bg-red-100 border-l-4 border-red-500 text-red-700'}`}>
                    <p className="font-medium">{message.text}</p>
                </div>
            )}

            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg border border-gray-200">
                <form onSubmit={handleSaveLicense} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        {/* License Name */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">License Name</label>
                            <input
                                type="text"
                                id="name"
                                required
                                value={licenseName}
                                onChange={(e) => setLicenseName(e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>

                        {/* Start Date */}
                        <div>
                            <label htmlFor="start_date" className="block text-sm font-medium text-gray-700">Start Date</label>
                            <input
                                type="date"
                                id="start_date"
                                required
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>

                        {/* Expiration Date */}
                        <div>
                            <label htmlFor="expiry_date" className="block text-sm font-medium text-gray-700">Expiration Date</label>
                            <input
                                type="date"
                                id="expiry_date"
                                required
                                value={expirationDate}
                                onChange={(e) => setExpirationDate(e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>

                        {/* Expiration Time Calculation */}
                        <div className="sm:col-span-2 p-3 sm:p-4 bg-yellow-50 rounded-lg border-2 border-yellow-200">
                            <h3 className="text-base sm:text-lg font-semibold text-yellow-800 flex items-center mb-2">
                                <Clock className="w-5 h-5 mr-2 flex-shrink-0" /> Expiry Time Remaining
                            </h3>
                            <p className="text-lg sm:text-xl font-mono text-yellow-900 break-words">
                                {timeRemaining}
                            </p>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full flex justify-center py-2 sm:py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0" /> Save License
                    </button>
                </form>
            </div>
        </div>
    );
}
