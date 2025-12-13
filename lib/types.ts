// lib/types.ts

export type Role = 'legal_officer' | 'developer' | 'manager';

export interface User {
    password: string;
    role: Role;
}

export interface License {
    id: string;
    name: string;
    startDate: string; // ISO Date String
    expirationDate: string; // ISO Date String
    addedBy: string; // User email
}

export interface UsersStore {
    [email: string]: User;
}