// Configuration
const GITHUB_API = 'https://api.github.com';
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

// Function to fetch kickstarts directly from GitHub
export const fetchKickstarts = async () => {
  try {
    // Debug token status
    const token = process.env.REACT_APP_GH_TOKEN;
    console.log('Token status:', token ? 'Token exists' : 'No token found');
    if (!token) {
      throw new Error('GitHub token not found. Please check your .env file.');
    }

    // First, get the list of repositories
    const reposResponse = await fetch(`${GITHUB_API}/orgs/${ORG_NAME}/repos?sort=updated&per_page=100`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!reposResponse.ok) {
      const errorText = await reposResponse.text();
      console.error('GitHub API error details:', {
        status: reposResponse.status,
        statusText: reposResponse.statusText,
        headers: Object.fromEntries(reposResponse.headers.entries()),
        body: errorText
      });
      throw new Error(`GitHub API error: ${reposResponse.status} - ${reposResponse.statusText}`);
    }

    const repos = await reposResponse.json();

    // Then, fetch README content for each repository
    const kickstarts = await Promise.all(repos.map(async (repo) => {
      let readmeText = '';
      try {
        const readmeResponse = await fetch(`${GITHUB_API}/repos/${ORG_NAME}/${repo.name}/readme`, {
          headers: {
            'Accept': 'application/vnd.github.v3+json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (readmeResponse.ok) {
          const readmeData = await readmeResponse.json();
          readmeText = atob(readmeData.content);
        }
      } catch (error) {
        console.warn(`Could not fetch README for ${repo.name}:`, error);
      }

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
        githubLink: repo.html_url,
        categories: Array.from(allCategories).sort(),
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

// Function to get all unique categories from the kickstarts
export const getAllCategories = (kickstarts) => {
  const categories = new Set();
  kickstarts.forEach(kickstart => {
    kickstart.categories.forEach(cat => categories.add(cat));
  });
  return Array.from(categories).sort();
};