// Fetch kickstarts data from the static JSON file
export async function fetchKickstarts() {
  try {
    const response = await fetch('/data/kickstarts.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching kickstarts:', error);
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