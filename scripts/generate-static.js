const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const GITHUB_API = 'https://api.github.com';
const ORG_NAME = 'rh-ai-quickstart';

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

// Function to extract image URLs from README content
function extractImageUrls(readmeText, repoName) {
  const imageUrls = [];
  const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
  let match;

  while ((match = imageRegex.exec(readmeText)) !== null) {
    const imageUrl = match[2];
    
    // Convert relative URLs to absolute GitHub URLs
    if (!imageUrl.startsWith('http')) {
      const absoluteUrl = `https://raw.githubusercontent.com/${ORG_NAME}/${repoName}/main/${imageUrl}`;
      imageUrls.push({
        original: imageUrl,
        absolute: absoluteUrl,
        alt: match[1]
      });
    } else {
      imageUrls.push({
        original: imageUrl,
        absolute: imageUrl,
        alt: match[1]
      });
    }
  }

  return imageUrls;
}

// Function to download an image
async function downloadImage(url, filePath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https:') ? https : http;
    const file = fs.createWriteStream(filePath);
    
    protocol.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve();
        });
      } else {
        file.close();
        fs.unlink(filePath, () => {}); // Delete the file on error
        reject(new Error(`HTTP ${response.statusCode}: ${url}`));
      }
    }).on('error', (err) => {
      file.close();
      fs.unlink(filePath, () => {}); // Delete the file on error
      reject(err);
    });
  });
}

// Function to create safe filename from URL
function createSafeFilename(url, repoName) {
  const urlObj = new URL(url);
  const pathParts = urlObj.pathname.split('/');
  const filename = pathParts[pathParts.length - 1];
  const extension = path.extname(filename) || '.png';
  const baseName = path.basename(filename, extension);
  return `${repoName}_${baseName}${extension}`;
}

async function generateStaticData() {
  try {
    // Repositories to exclude from the quickstarts list
    const EXCLUDED_REPOS = [
      '.github',
      'ai-quickstart-contrib',
      'ai-quickstart-template', 
      'ai-quickstart-pub',
      'rhdh-kickstart-templates'
    ];

    // Fetch repositories with anonymous access
    const reposResponse = await fetch(`${GITHUB_API}/orgs/${ORG_NAME}/repos?sort=updated&per_page=100`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (!reposResponse.ok) {
      throw new Error(`GitHub API error: ${reposResponse.status} - ${await reposResponse.text()}`);
    }

    const allRepos = await reposResponse.json();
    
    // Filter out excluded repositories
    const repos = allRepos.filter(repo => !EXCLUDED_REPOS.includes(repo.name));

    // Create images directory
    const imagesDir = path.join(__dirname, '../public/images');
    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir, { recursive: true });
    }

    // Fetch README content and images for each repository
    const kickstarts = await Promise.all(repos.map(async (repo) => {
      let readmeText = '';
      let readmeFilename = '';
      let downloadedImages = [];
      
      try {
        const readmeResponse = await fetch(`${GITHUB_API}/repos/${ORG_NAME}/${repo.name}/readme`, {
          headers: {
            'Accept': 'application/vnd.github.v3+json'
          }
        });

        if (readmeResponse.ok) {
          const readmeData = await readmeResponse.json();
          readmeText = Buffer.from(readmeData.content, 'base64').toString();
          readmeFilename = readmeData.name;
          
          console.log(`Fetched README for ${repo.name}`);
          
          // Extract and download images
          const imageUrls = extractImageUrls(readmeText, repo.name);
          
          for (const imageInfo of imageUrls) {
            try {
              const safeFilename = createSafeFilename(imageInfo.absolute, repo.name);
              const localPath = path.join(imagesDir, safeFilename);
              const relativePath = `images/${safeFilename}`;
              
              await downloadImage(imageInfo.absolute, localPath);
              
              downloadedImages.push({
                original: imageInfo.original,
                absolute: imageInfo.absolute,
                local: relativePath,
                alt: imageInfo.alt
              });
              
              console.log(`  Downloaded image: ${safeFilename}`);
            } catch (error) {
              console.warn(`  Failed to download image ${imageInfo.absolute}:`, error.message);
              // Still keep the image info even if download failed
              downloadedImages.push({
                original: imageInfo.original,
                absolute: imageInfo.absolute,
                local: null, // indicates download failed
                alt: imageInfo.alt
              });
            }
          }
        }
      } catch (error) {
        console.warn(`Could not fetch README for ${repo.name}:`, error.message);
      }

      const readmeCategories = readmeText ? extractCategoriesFromReadme(readmeText) : [];
      const language = repo.language;

      // Don't include GitHub topics in categories since they're fetched separately at runtime
      const allCategories = new Set([
        ...readmeCategories,
        ...(language ? [language] : [])
      ]);

      if (allCategories.size === 0) {
        allCategories.add('AI');
      }

      const readmePreview = readmeText
        ? readmeText.substring(0, 150) + (readmeText.length > 150 ? '...' : '')
        : 'No README available';

      // Update README content to use local images
      let processedReadme = readmeText;
      for (const imageInfo of downloadedImages) {
        if (imageInfo.local) {
          // Replace the original image path with the local one
          processedReadme = processedReadme.replace(
            new RegExp(`!\\[([^\\]]*)\\]\\(${imageInfo.original.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\)`, 'g'),
            `![${imageInfo.alt}](${imageInfo.local})`
          );
        }
      }

      return {
        id: repo.name,
        title: repo.name.split('-').map(word =>
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' '),
        description: repo.description || 'No description available',
        readmePreview,
        readmeContent: processedReadme,
        readmeFilename,
        images: downloadedImages,
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

    // Calculate statistics
    const totalImages = kickstarts.reduce((sum, ks) => sum + ks.images.length, 0);
    const successfulImages = kickstarts.reduce((sum, ks) => sum + ks.images.filter(img => img.local).length, 0);
    const failedImages = totalImages - successfulImages;

    // Write the data to public/data/kickstarts.json
    const data = {
      lastUpdated: new Date().toISOString(),
      stats: {
        totalQuickstarts: kickstarts.length,
        totalImages: totalImages,
        successfulImageDownloads: successfulImages,
        failedImageDownloads: failedImages
      },
      kickstarts
    };

    fs.writeFileSync(
      path.join(dataDir, 'kickstarts.json'),
      JSON.stringify(data, null, 2)
    );

    console.log('✅ Successfully generated static data at public/data/kickstarts.json');
    console.log(`📊 Statistics:`);
    console.log(`   - ${kickstarts.length} quickstarts processed`);
    console.log(`   - ${successfulImages}/${totalImages} images downloaded successfully`);
    if (failedImages > 0) {
      console.log(`   - ${failedImages} image downloads failed`);
    }
  } catch (error) {
    console.error('Error generating static data:', error);
    process.exit(1);
  }
}

generateStaticData();