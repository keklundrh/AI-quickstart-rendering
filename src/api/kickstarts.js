// Configuration for the GitHub API
const GITHUB_GRAPHQL_API = 'https://api.github.com/graphql';
const ORG_NAME = 'rh-ai-kickstart';

// Get GitHub token from environment variable
const GITHUB_TOKEN = process.env.REACT_APP_GITHUB_TOKEN;

// Common headers for GitHub API requests
const getGitHubHeaders = () => ({
  'Accept': 'application/json',
  'Content-Type': 'application/json',
  ...(GITHUB_TOKEN ? { 'Authorization': `Bearer ${GITHUB_TOKEN}` } : {})
});

// Cache configuration
const CACHE_KEY = 'github_kickstarts_cache';
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

// Function to get cached data
const getCachedData = () => {
  const cached = localStorage.getItem(CACHE_KEY);
  if (!cached) return null;

  const { data, timestamp } = JSON.parse(cached);
  const now = Date.now();

  // Return null if cache is expired
  if (now - timestamp > CACHE_DURATION) {
    localStorage.removeItem(CACHE_KEY);
    return null;
  }

  return data;
};

// Function to set cached data
const setCachedData = (data) => {
  const cacheData = {
    data,
    timestamp: Date.now()
  };
  localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
};

// Function to extract categories from README content
const extractCategoriesFromReadme = (readmeHtml) => {
  const categories = new Set();

  // Create a temporary div to parse the HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = readmeHtml;

  // Look for the categories section
  const allSections = tempDiv.querySelectorAll('h2');
  let categoriesSection = null;

  for (const section of allSections) {
    if (section.textContent.toLowerCase().includes('categories') ||
        section.textContent.toLowerCase().includes('category')) {
      categoriesSection = section;
      break;
    }
  }

  if (categoriesSection) {
    let currentElement = categoriesSection.nextElementSibling;
    while (currentElement && currentElement.tagName !== 'H2') {
      if (currentElement.tagName === 'UL' || currentElement.tagName === 'OL') {
        const listItems = currentElement.querySelectorAll('li');
        listItems.forEach(item => {
          const category = item.textContent.trim()
            .replace(/^[-*]\s*/, '')
            .replace(/^\d+\.\s*/, '')
            .trim();
          if (category) {
            categories.add(category);
          }
        });
      }
      currentElement = currentElement.nextElementSibling;
    }
  }

  return Array.from(categories);
};

// Function to handle GitHub API errors
const handleGitHubError = async (response, context) => {
  if (response.status === 403) {
    const responseData = await response.json().catch(() => ({}));
    const message = responseData.message || 'Unknown error';

    if (message.includes('rate limit')) {
      console.error('GitHub API rate limit exceeded. Please set REACT_APP_GITHUB_TOKEN environment variable.');
      throw new Error('GitHub API rate limit exceeded. Please check the console for more information.');
    } else if (message.includes('Not Found')) {
      console.error(`GitHub organization '${ORG_NAME}' not found or not accessible.`);
      throw new Error(`GitHub organization '${ORG_NAME}' not found or not accessible.`);
    } else if (message.includes('Bad credentials')) {
      console.error('Invalid GitHub token. Please check your REACT_APP_GITHUB_TOKEN.');
      throw new Error('Invalid GitHub token. Please check your REACT_APP_GITHUB_TOKEN.');
    } else {
      console.error(`GitHub API error (${context}):`, message);
      throw new Error(`GitHub API error: ${message}`);
    }
  }
  throw new Error(`GitHub API error (${context}): ${response.status}`);
};

// Function to fetch repository data from GitHub using GraphQL
export const fetchKickstarts = async () => {
  try {
    // Check cache first
    const cachedData = getCachedData();
    if (cachedData) {
      console.log('Using cached kickstarts data');
      return cachedData;
    }

    // Optimized GraphQL query to fetch only necessary fields
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
            pageInfo {
              hasNextPage
              endCursor
            }
          }
        }
      }
    `;

    const response = await fetch(GITHUB_GRAPHQL_API, {
      method: 'POST',
      headers: getGitHubHeaders(),
      body: JSON.stringify({ query })
    });

    if (!response.ok) {
      await handleGitHubError(response, 'fetching repositories via GraphQL');
    }

    const data = await response.json();

    if (data.errors) {
      console.error('GraphQL errors:', data.errors);
      throw new Error('Error fetching data from GitHub: ' + data.errors[0].message);
    }

    const repos = data.data.organization.repositories.nodes;

    // Transform the repository data into our kickstart format
    const kickstarts = repos.map(repo => {
      // Extract categories from README if available
      const readmeCategories = repo.object?.text
        ? extractCategoriesFromReadme(repo.object.text)
        : [];

      // Combine categories from README with GitHub topics and language
      const allCategories = new Set([
        ...readmeCategories,
        ...(repo.repositoryTopics.nodes.map(t => t.topic.name) || []),
        ...(repo.primaryLanguage?.name ? [repo.primaryLanguage.name] : [])
      ]);

      // If no categories were found, add a default one
      if (allCategories.size === 0) {
        allCategories.add('AI');
      }

      // Get README preview (limit to first 150 characters to reduce data size)
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

    // Cache the transformed data
    setCachedData(kickstarts);

    return kickstarts;
  } catch (error) {
    console.error('Error fetching kickstarts:', error);

    // If there's an error, try to return cached data even if expired
    const cachedData = getCachedData();
    if (cachedData) {
      console.log('Using expired cache due to error');
      return cachedData;
    }

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