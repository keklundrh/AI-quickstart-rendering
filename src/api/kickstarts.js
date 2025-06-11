// Configuration for the GitHub API
const GITHUB_API_BASE = 'https://api.github.com';
const ORG_NAME = 'rh-ai-kickstart';

// Function to fetch README content for a repository
const fetchReadme = async (repoName) => {
  try {
    const response = await fetch(`${GITHUB_API_BASE}/repos/${ORG_NAME}/${repoName}/readme`, {
      headers: {
        'Accept': 'application/vnd.github.html+json' // Get README as HTML
      }
    });

    if (!response.ok) {
      if (response.status === 404) {
        return 'No README available';
      }
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const readmeHtml = await response.text();
    // Convert HTML to plain text and get first 200 characters
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = readmeHtml;
    const plainText = tempDiv.textContent || tempDiv.innerText || '';
    return plainText.substring(0, 200) + (plainText.length > 200 ? '...' : '');
  } catch (error) {
    console.error(`Error fetching README for ${repoName}:`, error);
    return 'Error loading README';
  }
};

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
    const kickstarts = await Promise.all(repos.map(async repo => {
      const readmePreview = await fetchReadme(repo.name);
      return {
        id: repo.name,
        title: repo.name.split('-').map(word =>
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' '),
        description: repo.description || 'No description available',
        readmePreview,
        githubLink: `${repo.html_url}#readme`,
        categories: extractCategories(repo),
        stars: repo.stargazers_count,
        lastUpdated: new Date(repo.updated_at).toLocaleDateString()
      };
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