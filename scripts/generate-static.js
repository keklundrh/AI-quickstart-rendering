const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const GITHUB_GRAPHQL_API = 'https://api.github.com/graphql';
const ORG_NAME = 'rh-ai-kickstart';
const OUTPUT_DIR = path.join(__dirname, '../public/data');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'kickstarts.json');

// Get GitHub token from environment
const GITHUB_TOKEN = process.env.GH_TOKEN;
if (!GITHUB_TOKEN) {
  console.error('Error: GH_TOKEN environment variable is required');
  process.exit(1);
}

// Function to fetch data from GitHub
async function fetchKickstarts() {
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
      'Authorization': `Bearer ${GITHUB_TOKEN}`,
      'Content-Type': 'application/json',
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

  return data.data.organization.repositories.nodes;
}

// Function to extract categories from README content
function extractCategoriesFromReadme(readmeHtml) {
  const categories = new Set();
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = readmeHtml;

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
}

// Main function to generate static data
async function generateStaticData() {
  try {
    console.log('Fetching data from GitHub...');
    const repos = await fetchKickstarts();

    // Transform the repository data
    const kickstarts = repos.map(repo => {
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

    // Ensure output directory exists
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    // Write the data to a JSON file
    fs.writeFileSync(
      OUTPUT_FILE,
      JSON.stringify({
        lastUpdated: new Date().toISOString(),
        kickstarts
      }, null, 2)
    );

    console.log(`Successfully generated static data at ${OUTPUT_FILE}`);
  } catch (error) {
    console.error('Error generating static data:', error);
    process.exit(1);
  }
}

// Run the generation
generateStaticData();