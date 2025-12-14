// app/page.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogIn, Send, Briefcase, User, Code, XCircle, CheckCircle, Loader2, Eye, EyeOff } from 'lucide-react';
import { initialUsers } from '@/lib/data';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isRequesting, setIsRequesting] = useState(false);
    const [requestName, setRequestName] = useState('');
    const [requestEmail, setRequestEmail] = useState('');
    const [requestStatus, setRequestStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const router = useRouter();

    // --- Core Login Function ---
    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();

        // 1. Check if user exists in the initial set (simulating a database check)
        const storedUsers = JSON.parse(localStorage.getItem('users') || JSON.stringify(initialUsers));
        const user = storedUsers[email];

        if (user && user.password === password) {
            // 2. Store the current user/role in local storage
            localStorage.setItem('currentUser', JSON.stringify({ email, role: user.role }));

            // 3. Redirect based on role
            router.push(`/dashboard/${user.role}`);
        } else {
            alert('Invalid credentials or user not found.');
        }
    };

    // --- Developer Request Function (Calls API) ---
    const handleRequestSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setRequestStatus('loading');

        try {
            const response = await fetch('/api/request-developer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: requestName,
                    email: requestEmail
                }),
            });

            if (response.ok) {
                setRequestStatus('success');
                // Auto-close modal after success message
                setTimeout(() => {
                    setIsRequesting(false);
                    setRequestName('');
                    setRequestEmail('');
                    setRequestStatus('idle');
                }, 3000);

            } else {
                // Handle API errors (e.g., failed to send email)
                console.error('API Error:', await response.json());
                setRequestStatus('error');
            }

        } catch (error) {
            console.error('Network Error:', error);
            setRequestStatus('error');
        }
    };

    const closeModal = () => {
        setIsRequesting(false);
        setRequestStatus('idle'); // Reset status on close
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const getRoleIcon = (role: string) => {
        switch (role) {
            case 'legal_officer': return <Briefcase className="w-5 h-5 mr-2 text-blue-500" />;
            case 'developer': return <Code className="w-5 h-5 mr-2 text-green-500" />;
            case 'manager': return <User className="w-5 h-5 mr-2 text-purple-500" />;
            default: return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    License Checker Portal
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Sign in to access your role-specific dashboard.
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    {/* LOGIN FORM */}
                    <form className="space-y-6" onSubmit={handleLogin}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email address
                            </label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <div className="mt-1 relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black pr-10"
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5" aria-hidden="true" />
                                    ) : (
                                        <Eye className="h-5 w-5" aria-hidden="true" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                <LogIn className="w-5 h-5 mr-2" />
                                Sign in
                            </button>
                        </div>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">Or if you are a new developer</span>
                            </div>
                        </div>

                        {/* DEVELOPER REQUEST BUTTON */}
                        <div className="mt-6">
                            <button
                                onClick={() => setIsRequesting(true)}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                            >
                                <Code className="w-5 h-5 mr-2" />
                                Request to be a Developer
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* MODAL FOR DEVELOPER REQUEST */}
            {isRequesting && (
                <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">

                            {/* Display Status or Form */}
                            {requestStatus === 'success' ? (
                                <div className="bg-green-50 p-6 text-center">
                                    <CheckCircle className="w-10 h-10 mx-auto text-green-600" />
                                    <h3 className="text-xl font-semibold text-green-800 mt-3">Request Sent Successfully!</h3>
                                    <p className="text-sm text-green-700 mt-2">The manager has been notified at jameskekeli12@gmail.com.</p>
                                </div>
                            ) : requestStatus === 'error' ? (
                                <div className="bg-red-50 p-6 text-center">
                                    <XCircle className="w-10 h-10 mx-auto text-red-600" />
                                    <h3 className="text-xl font-semibold text-red-800 mt-3">Request Failed</h3>
                                    <p className="text-sm text-red-700 mt-2">There was an error sending the email. Please check your network or try again.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleRequestSubmit}>
                                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                            Developer Access Request
                                        </h3>
                                        <div className="mt-2 space-y-4">
                                            <p className="text-sm text-gray-500">
                                                Your request will be sent to the Manager for approval and credential creation.
                                            </p>
                                            <div>
                                                <label htmlFor="request-name" className="block text-sm font-medium text-gray-700">Name</label>
                                                <input
                                                    id="request-name"
                                                    type="text"
                                                    required
                                                    value={requestName}
                                                    onChange={(e) => setRequestName(e.target.value)}
                                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-teal-500 focus:border-teal-500 text-black"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="request-email" className="block text-sm font-medium text-gray-700">Email</label>
                                                <input
                                                    id="request-email"
                                                    type="email"
                                                    required
                                                    value={requestEmail}
                                                    onChange={(e) => setRequestEmail(e.target.value)}
                                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-teal-500 focus:border-teal-500 text-black"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                        <button
                                            type="submit"
                                            disabled={requestStatus === 'loading'}
                                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-teal-600 text-base font-medium text-white hover:bg-teal-700 disabled:bg-teal-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 sm:ml-3 sm:w-auto sm:text-sm"
                                        >
                                            {requestStatus === 'loading' ? (
                                                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                                            ) : (
                                                <Send className="w-4 h-4 mr-1"/>
                                            )}
                                            {requestStatus === 'loading' ? 'Sending...' : 'Send Request'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={closeModal}
                                            disabled={requestStatus === 'loading'}
                                            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 disabled:text-gray-400 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
