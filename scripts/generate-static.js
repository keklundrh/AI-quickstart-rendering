const fs = require('fs');
const path = require('path');

// Static data for kickstarts
const staticKickstarts = [
  {
    id: "ai-kickstarts-app",
    title: "AI Kickstarts App",
    description: "A web application to browse and discover AI kickstarts",
    readmePreview: "A modern web application built with React to help users discover and explore AI kickstarts...",
    githubLink: "https://github.com/rh-ai-kickstart/ai-kickstarts-app",
    categories: ["AI", "Web", "React", "JavaScript"],
    stars: 0,
    lastUpdated: new Date().toLocaleDateString()
  }
  // Add more static kickstarts as needed
];

async function generateStaticData() {
  try {
    // Create the public/data directory if it doesn't exist
    const dataDir = path.join(__dirname, '../public/data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Write the static data to public/data/kickstarts.json
    const data = {
      lastUpdated: new Date().toISOString(),
      kickstarts: staticKickstarts
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