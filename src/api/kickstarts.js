// Configuration
const GITHUB_GRAPHQL_API = 'https://api.github.com/graphql';
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
    const query = `
      query {
        organization(login: "${ORG_NAME}") {
          repositories(first: 100, orderBy: {field: UPDATED_AT, direction: DESC}) {
            nodes {
              name
              description
              url
              stargazerCount
              updatedAt
              primaryLanguage {
                name
              }
              repositoryTopics(first: 10) {
                nodes {
                  topic {
                    name
                  }
                }
              }
              object(expression: "HEAD:README.md") {
                ... on Blob {
                  text
                }
              }
            }
          }
        }
      }
    `;

    const response = await fetch(GITHUB_GRAPHQL_API, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.REACT_APP_GH_TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ query })
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data = await response.json();
    if (data.errors) {
      throw new Error('GraphQL errors: ' + data.errors[0].message);
    }

    // Transform the repository data
    const kickstarts = data.data.organization.repositories.nodes.map(repo => {
      const readmeCategories = repo.object?.text
        ? extractCategoriesFromReadme(repo.object.text)
        : [];

      const allCategories = new Set([
        ...readmeCategories,
        ...(repo.repositoryTopics.nodes.map(t => t.topic.name) || []),
        ...(repo.primaryLanguage?.name ? [repo.primaryLanguage.name] : [])
      ]);

      if (allCategories.size === 0) {
        allCategories.add('AI');
      }

      const readmePreview = repo.object?.text
        ? repo.object.text.substring(0, 150) + (repo.object.text.length > 150 ? '...' : '')
        : 'No README available';

      return {
        id: repo.name,
        title: repo.name.split('-').map(word =>
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' '),
        description: repo.description || 'No description available',
        readmePreview,
        githubLink: `${repo.url}#readme`,
        categories: Array.from(allCategories).sort(),
        stars: repo.stargazerCount,
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