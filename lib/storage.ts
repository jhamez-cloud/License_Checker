// lib/storage.ts
import { License, Role, User } from './types';
import { v4 as uuidv4 } from 'uuid'; // We need a UUID generator

// You will need to install this package:
// npm install uuid @types/uuid
// or yarn add uuid @types/uuid

const LICENSE_STORAGE_KEY = 'licenses';
const USER_STORAGE_KEY = 'users';
const CURRENT_USER_KEY = 'currentUser';

// --- License Management ---

export const getLicenses = (): License[] => {
    if (typeof window === 'undefined') return [];
    const licenses = localStorage.getItem(LICENSE_STORAGE_KEY);
    return licenses ? JSON.parse(licenses) : [];
};

export const saveLicense = (newLicense: Omit<License, 'id'>): License => {
    if (typeof window === 'undefined') throw new Error("Cannot access storage server-side.");

    const existingLicenses = getLicenses();
    const licenseWithId: License = {
        ...newLicense,
        id: uuidv4(), // Generate a unique ID
    };

    const updatedLicenses = [...existingLicenses, licenseWithId];
    localStorage.setItem(LICENSE_STORAGE_KEY, JSON.stringify(updatedLicenses));
    return licenseWithId;
};

// --- User/Auth Management ---

export const getCurrentUser = (): { email: string, role: Role } | null => {
    if (typeof window === 'undefined') return null;
    const user = localStorage.getItem(CURRENT_USER_KEY);
    return user ? JSON.parse(user) : null;
};

export const getStoredUsers = () => {
    if (typeof window === 'undefined') return {};
    const users = localStorage.getItem(USER_STORAGE_KEY);
    return users ? JSON.parse(users) : {};
}

export const addNewUser = (email: string, password: string, role: Role) => {
    if (typeof window === 'undefined') return;
    const users = getStoredUsers();
    users[email] = { password, role };
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(users));
}