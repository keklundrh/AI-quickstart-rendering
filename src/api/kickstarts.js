// Cache duration in milliseconds (1 hour)
const CACHE_DURATION = 60 * 60 * 1000;

// Cache key for localStorage
const CACHE_KEY = 'kickstarts_cache';

// Function to get cached data
function getCachedData() {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;

    const { data, timestamp } = JSON.parse(cached);
    const now = Date.now();

    // Return cached data if it's still fresh
    if (now - timestamp < CACHE_DURATION) {
      return data;
    }
  } catch (error) {
    console.warn('Error reading from cache:', error);
  }
  return null;
}

// Function to set cached data
function setCachedData(data) {
  try {
    const cache = {
      data,
      timestamp: Date.now()
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch (error) {
    console.warn('Error writing to cache:', error);
  }
}

// Fetch kickstarts data from the static JSON file with caching
export async function fetchKickstarts() {
  try {
    // Try to get cached data first
    const cachedData = getCachedData();
    if (cachedData) {
      // Start a background refresh
      refreshKickstartsData();
      return cachedData;
    }

    // If no cache, fetch fresh data
    return await refreshKickstartsData();
  } catch (error) {
    console.error('Error fetching kickstarts:', error);
    throw error;
  }
}

// Function to fetch fresh data
async function refreshKickstartsData() {
  try {
    const response = await fetch('/data/kickstarts.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    setCachedData(data);
    return data;
  } catch (error) {
    console.error('Error refreshing kickstarts data:', error);
    throw error;
  }
}

// Function to get all unique categories from the kickstarts
export function getAllCategories(kickstarts) {
  const categories = new Set();
  kickstarts.forEach(kickstart => {
    if (kickstart.categories) {
      kickstart.categories.forEach(category => categories.add(category));
    }
  });
  return Array.from(categories).sort();
}

// Function to force a refresh of the data
export async function forceRefreshKickstarts() {
  try {
    const data = await refreshKickstartsData();
    return data;
  } catch (error) {
    console.error('Error forcing refresh of kickstarts:', error);
    throw error;
  }
}