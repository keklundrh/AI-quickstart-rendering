// Configuration
const API_ENDPOINT = '/functions/github-data';  // Updated to match GitHub Pages Functions URL structure
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

// Function to fetch kickstarts through our serverless function
export const fetchKickstarts = async () => {
  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ orgName: ORG_NAME })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    if (data.errors) {
      throw new Error('API errors: ' + data.errors[0].message);
    }

    // Transform the repository data
    const kickstarts = data.repositories.map(repo => {
      const readmeCategories = repo.readmeText
        ? extractCategoriesFromReadme(repo.readmeText)
        : [];

      const allCategories = new Set([
        ...readmeCategories,
        ...(repo.topics || []),
        ...(repo.language ? [repo.language] : [])
      ]);

      if (allCategories.size === 0) {
        allCategories.add('AI');
      }

      const readmePreview = repo.readmeText
        ? repo.readmeText.substring(0, 150) + (repo.readmeText.length > 150 ? '...' : '')
        : 'No README available';

      return {
        id: repo.name,
        title: repo.name.split('-').map(word =>
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' '),
        description: repo.description || 'No description available',
        readmePreview,
        githubLink: repo.url,
        categories: Array.from(allCategories).sort(),
        stars: repo.stars,
        lastUpdated: new Date(repo.updatedAt).toLocaleDateString()
      };
    });

    return kickstarts;
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