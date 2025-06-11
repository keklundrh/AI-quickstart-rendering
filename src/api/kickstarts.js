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

// Function to fetch kickstarts using our serverless function
export const fetchKickstarts = async () => {
  try {
    // Call our serverless function instead of GitHub API directly
    const response = await fetch('/.github/functions/github-data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ orgName: ORG_NAME })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API error details:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        body: errorText
      });
      throw new Error(`API error: ${response.status} - ${response.statusText}`);
    }

    const { repositories } = await response.json();

    // Transform the repositories into kickstarts
    const kickstarts = repositories.map(repo => {
      const readmeText = repo.readmeText || '';
      const readmeCategories = readmeText ? extractCategoriesFromReadme(readmeText) : [];
      const topics = repo.topics || [];
      const language = repo.language;

      const allCategories = new Set([
        ...readmeCategories,
        ...topics,
        ...(language ? [language] : [])
      ]);

      if (allCategories.size === 0) {
        allCategories.add('AI');
      }

      const readmePreview = readmeText
        ? readmeText.substring(0, 150) + (readmeText.length > 150 ? '...' : '')
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