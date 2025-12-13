// lib/licenseUtils.ts

import { intervalToDuration, formatDuration, isPast, isFuture } from 'date-fns';
import { License } from './types';

// Calculates the time remaining and returns it as a formatted string
export const calculateTimeRemaining = (expirationDate: string): string => {
    const now = new Date();
    const expiry = new Date(expirationDate);

    if (isPast(expiry)) {
        return 'EXPIRED';
    }

    const duration = intervalToDuration({ start: now, end: expiry });

    // Format the duration into the requested human-readable string
    // Only include units that are present (i.e., hide 0 years, 0 months etc.)
    return formatDuration(duration, {
        format: ['years', 'months', 'days', 'hours', 'minutes'],
        delimiter: ', ',
        zero: false, // Do not include zero values
    });
};

// Determines the status of a license
export const getLicenseStatus = (expirationDate: string): 'Active' | 'Expired' | 'Expiring Soon' => {
    const expiry = new Date(expirationDate);
    const now = new Date();
    const oneDay = 24 * 60 * 60 * 1000;

    if (isPast(expiry)) {
        return 'Expired';
    }

    // Check if less than 1 day is remaining
    if (expiry.getTime() - now.getTime() <= oneDay) {
        return 'Expiring Soon'; // To trigger the '1 day left' notification logic
    }

    return 'Active';
};