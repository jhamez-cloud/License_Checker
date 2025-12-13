// app/dashboard/layout.tsx
'use client';

import {useState, useEffect, JSX} from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Briefcase, Code, User, LogOut, FileText } from 'lucide-react';
import { getCurrentUser } from '@/lib/storage';
import { Role } from '@/lib/types';

interface NavItem {
    role: Role;
    label: string;
    href: string;
    icon: JSX.Element;
}

const navItems: NavItem[] = [
    { role: 'legal_officer', label: 'License Manager', href: '/dashboard/legal_officer', icon: <Briefcase className="w-5 h-5" /> },
    { role: 'developer', label: 'License Viewer', href: '/dashboard/developer', icon: <Code className="w-5 h-5" /> },
    { role: 'manager', label: 'User & Status', href: '/dashboard/manager', icon: <User className="w-5 h-5" /> },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [currentUser, setCurrentUser] = useState<{ email: string, role: Role } | null>(null);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const user = getCurrentUser();
        if (!user) {
            router.push('/'); // Redirect unauthenticated users to login
            return;
        }
        setCurrentUser(user);

        // Simple authorization check based on URL
        const requiredRole = pathname.split('/').pop() as Role;
        if (requiredRole && requiredRole !== user.role) {
            // Redirect to the correct dashboard if role doesn't match URL
            router.push(`/dashboard/${user.role}`);
        }
    }, [router, pathname]);

    const handleLogout = () => {
        localStorage.removeItem('currentUser');
        router.push('/');
    };

    if (!currentUser) {
        return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;
    }

    const currentNavItem = navItems.find(item => item.role === currentUser.role);

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar */}
            <div className="w-64 bg-white shadow-md flex flex-col">
                <div className="p-4 border-b">
                    <h1 className="text-xl font-bold text-indigo-600 flex items-center">
                        <FileText className="w-6 h-6 mr-2" />
                        Checker App
                    </h1>
                </div>
                <nav className="flex-grow p-4 space-y-2">
                    {navItems.filter(item => item.role === currentUser.role).map((item) => (
                        <div
                            key={item.role}
                            className="flex items-center p-3 text-sm font-medium rounded-lg text-white bg-indigo-600 shadow-lg"
                        >
                            {item.icon}
                            <span className="ml-3">{item.label}</span>
                        </div>
                    ))}
                </nav>
                <div className="p-4 border-t">
                    <p className="text-sm text-gray-500 truncate mb-2">Signed in as: <span className="font-semibold text-gray-800">{currentUser.email}</span></p>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center p-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition duration-150"
                    >
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}