import { UsersStore } from './types';

// Initial users for easy testing (in a real app, this would be a database)
export const initialUsers: UsersStore = {
    'legal@corp.com': { password: 'password', role: 'legal_officer' },
    'dev@corp.com': { password: 'password', role: 'developer' },
    'manager@corp.com': { password: 'password', role: 'manager' },
};

// You should call this once on app load to seed the local storage if empty
export const initializeLocalStorage = () => {
    if (typeof window !== 'undefined' && !localStorage.getItem('users')) {
        localStorage.setItem('users', JSON.stringify(initialUsers));
    }
    if (typeof window !== 'undefined' && !localStorage.getItem('licenses')) {
        localStorage.setItem('licenses', JSON.stringify([]));
    }
};