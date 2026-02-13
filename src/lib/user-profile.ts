import type { Timestamp } from 'firebase/firestore';

export type UserProfile = {
    uid: string;
    displayName: string;
    email: string;
    photoURL?: string;
    badges?: string[];
    momoNumber?: string;
    consecutiveWeeksPlayed?: number;
    lastPlayTimestamp?: Timestamp;
    hasCompletedOnboarding?: boolean;
    coins?: number;
    lastDailyPlayTimestamp?: Timestamp;
    isSuspended?: boolean;
}
