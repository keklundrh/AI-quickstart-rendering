// Configuration
const ORG_NAME = 'rh-ai-kickstart';

// Function to extract categories from README content
function extractCategoriesFromReadme(readmeText) {
  const categories = new Set();
  const lines = readmeText.split('\n');
  let inCategoriesSection = false;

  for (const line of lines) {
    if (line.toLowerCase().includes('## categories')) {
      inCategoriesSection = true;
      continue;
    }
    if (inCategoriesSection && line.startsWith('##')) {
      inCategoriesSection = false;
      continue;
    }
    if (inCategoriesSection && line.trim().startsWith('-')) {
      const category = line.trim()
        .replace(/^-\s*/, '')
        .trim();
      if (category) {
        categories.add(category);
      }
    }
  }

  return Array.from(categories);
}

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
export const getAllCategories = (kickstarts) => {
  const categories = new Set();
  kickstarts.forEach(kickstart => {
    kickstart.categories.forEach(cat => categories.add(cat));
  });
  return Array.from(categories).sort();
};