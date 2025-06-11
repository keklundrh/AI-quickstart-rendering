const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

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

async function generateStaticData() {
  try {
    const token = process.env.GH_TOKEN;
    if (!token) {
      throw new Error('GitHub token not found. Please check your environment variables.');
    }

    // Fetch repositories
    const reposResponse = await fetch(`${GITHUB_API}/orgs/${ORG_NAME}/repos?sort=updated&per_page=100`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!reposResponse.ok) {
      throw new Error(`GitHub API error: ${reposResponse.status}`);
    }

    const repos = await reposResponse.json();

    // Fetch README content for each repository
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
          readmeText = Buffer.from(readmeData.content, 'base64').toString();
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

    // Create the public/data directory if it doesn't exist
    const dataDir = path.join(__dirname, '../public/data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Write the data to public/data/kickstarts.json
    const data = {
      lastUpdated: new Date().toISOString(),
      kickstarts
    };

    fs.writeFileSync(
      path.join(dataDir, 'kickstarts.json'),
      JSON.stringify(data, null, 2)
    );

    console.log('Successfully generated static data at public/data/kickstarts.json');
  } catch (error) {
    console.error('Error generating static data:', error);
    process.exit(1);
  }
}

generateStaticData();