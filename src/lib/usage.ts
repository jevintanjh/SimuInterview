
'use client';

import { MAX_FREE_TRIES } from "./constants";

const USAGE_STORAGE_PREFIX = 'simu-interview-usage-';

export const getUsageCount = (userId: string): number => {
  if (typeof window === 'undefined') return MAX_FREE_TRIES;
  try {
    const item = window.localStorage.getItem(`${USAGE_STORAGE_PREFIX}${userId}`);
    if (item === null) {
      // Set initial count for new users
      window.localStorage.setItem(`${USAGE_STORAGE_PREFIX}${userId}`, String(MAX_FREE_TRIES));
      return MAX_FREE_TRIES;
    }
    return parseInt(item, 10);
  } catch (error) {
    console.error("Error reading from localStorage", error);
    return MAX_FREE_TRIES;
  }
};

export const decrementUsageCount = (userId: string): number => {
  if (typeof window === 'undefined') return MAX_FREE_TRIES;
  try {
    const currentCount = getUsageCount(userId);
    const newCount = Math.max(0, currentCount - 1);
    window.localStorage.setItem(`${USAGE_STORAGE_PREFIX}${userId}`, newCount.toString());
    return newCount;
  } catch (error) {
    console.error("Error writing to localStorage", error);
    return getUsageCount(userId);
  }
};

// This would be called by a Stripe webhook in a real app
export const addTries = (userId: string, amount: number) => {
    if (typeof window === 'undefined') return;
    try {
        const currentCount = getUsageCount(userId);
        const newCount = currentCount + amount;
        window.localStorage.setItem(`${USAGE_STORAGE_PREFIX}${userId}`, newCount.toString());
    } catch (error) {
        console.error("Error writing to localStorage", error);
    }
}
