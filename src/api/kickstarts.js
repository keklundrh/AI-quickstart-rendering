// Function to fetch kickstarts from static JSON file
export const fetchKickstarts = async () => {
  try {
    const response = await fetch('/data/kickstarts.json');
    if (!response.ok) {
      throw new Error('Failed to fetch kickstarts data');
    }
    const data = await response.json();
    return data.kickstarts;
  } catch (error) {
    console.error('Error fetching kickstarts:', error);
    throw error;
  }
};

// Function to get all unique categories from the kickstarts
export const getAllCategories = (kickstarts) => {
  const categories = new Set();
  kickstarts.forEach(kickstart => {
    kickstart.categories.forEach(cat => categories.add(cat));
  });
  return Array.from(categories).sort();
};