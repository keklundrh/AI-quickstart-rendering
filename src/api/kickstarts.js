// Configuration for the GitHub API
const GITHUB_API_BASE = 'https://api.github.com';
const ORG_NAME = 'rh-ai-kickstart';

// Function to fetch repository data from GitHub
export const fetchKickstarts = async () => {
  try {
    // Fetch all repositories from the organization
    const response = await fetch(`${GITHUB_API_BASE}/orgs/${ORG_NAME}/repos`);

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const repos = await response.json();

    // Transform the repository data into our kickstart format
    const kickstarts = repos.map(repo => ({
      id: repo.name,
      title: repo.name.split('-').map(word =>
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' '),
      description: repo.description || 'No description available',
      githubLink: repo.html_url,
      categories: extractCategories(repo),
      stars: repo.stargazers_count,
      lastUpdated: new Date(repo.updated_at).toLocaleDateString()
    }));

    return kickstarts;
  } catch (error) {
    console.error('Error fetching kickstarts:', error);
    throw error;
  }
};

// Helper function to extract categories from repository data
const extractCategories = (repo) => {
  const categories = new Set();

  // Add topics as categories if they exist
  if (repo.topics && Array.isArray(repo.topics)) {
    repo.topics.forEach(topic => categories.add(topic));
  }

  // Add language as a category if it exists
  if (repo.language) {
    categories.add(repo.language);
  }

  // If no categories were found, add a default one
  if (categories.size === 0) {
    categories.add('AI');
  }

  return Array.from(categories).sort();
};

// Function to get all unique categories from the kickstarts
export const getAllCategories = (kickstarts) => {
  const categories = new Set();
  kickstarts.forEach(kickstart => {
    kickstart.categories.forEach(cat => categories.add(cat));
  });
  return Array.from(categories).sort();
};