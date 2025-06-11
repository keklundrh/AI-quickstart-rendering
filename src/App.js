import React, { useState, useEffect } from 'react';

// NOTE: Direct imports of PatternFly React components like '@patternfly/react-core'
// and '@patternfly/react-icons' are causing resolution errors in this self-contained
// environment. To make this prototype runnable, we will implement the UI using standard
// HTML elements and apply custom CSS classes that mimic PatternFly's design system.
// Icons will be replaced with inline SVGs or unicode characters as needed.

// Inline CSS to mimic PatternFly's look and feel without direct imports.
// This provides the necessary styling for the HTML elements.
const customPatternFlyStyle = `
  :root {
    --pf-global--spacer--xs: 0.25rem;
    --pf-global--spacer--sm: 0.5rem;
    --pf-global--spacer--md: 1rem;
    --pf-global--spacer--lg: 1.5rem;
    --pf-global--spacer--xl: 2rem;
    --pf-global--spacer--2xl: 3rem;

    --pf-global--BorderWidth--sm: 1px;
    --pf-global--BorderRadius--lg: 0.25rem; /* Equivalent to --pf-global--BorderRadius--sm */
    --pf-global--BorderColor--100: #d2d2d2;
    --pf-global--BorderColor--200: #8a8d90;

    --pf-global--FontSize--sm: 0.875rem;
    --pf-global--FontSize--lg: 1.125rem;
    --pf-global--FontSize--xl: 1.25rem;
    --pf-global--FontSize--2xl: 1.5rem; /* Adjusted for h1 */

    --pf-global--FontWeight--normal: 400;
    --pf-global--FontWeight--bold: 700;

    --pf-global--BackgroundColor--100: #f0f0f0; /* Light gray for sections */
    --pf-global--BackgroundColor--200: #fafafa;
    --pf-global--BackgroundColor--300: #e0e0e0; /* Hover state for select items */

    --pf-global--primary-color--100: #0066cc; /* PatternFly primary blue */
    --pf-global--primary-color--200: #004080; /* Darker blue for hover */
    --pf-global--active-color--100: #0066cc; /* Blue for labels */

    --pf-global--BoxShadow--sm: 0 0.0625rem 0.125rem rgba(3,3,3,0.1), 0 0.125rem 0.25rem rgba(3,3,3,0.1);
    --pf-global--BoxShadow--md: 0 0.125rem 0.25rem rgba(3,3,3,0.1), 0 0.25rem 0.5rem rgba(3,3,3,0.1);
    --pf-global--BoxShadow--lg: 0 0.25rem 0.5rem rgba(3,3,3,0.1), 0 0.5rem 1rem rgba(3,3,3,0.1);

    font-family: 'Inter', sans-serif; /* Fallback to sans-serif */
  }

  body {
    margin: 0;
    background-color: #f0f0f0; /* Page background */
  }

  .pf-v5-c-page {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  /* Masthead Styles */
  .pf-v5-c-masthead {
    background-color: #be0000; /* Red Hat Red */
    color: white;
    padding: var(--pf-global--spacer--md) var(--pf-global--spacer--xl);
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: var(--pf-global--BoxShadow--sm);
  }
  .pf-v5-c-masthead__main {
    display: flex;
    align-items: center;
  }
  .pf-v5-c-masthead__brand {
    display: flex;
    align-items: center;
  }
  .pf-v5-c-brand {
    display: flex;
    align-items: center;
    text-decoration: none;
    color: white;
  }
  .pf-v5-c-brand img {
    height: 30px; /* Adjust as needed */
    margin-right: var(--pf-global--spacer--sm);
  }
  .pf-v5-c-brand span {
    color: white;
  }
  .pf-v5-u-font-weight-bold { font-weight: var(--pf-global--FontWeight--bold); }
  .pf-v5-u-font-size-2xl { font-size: var(--pf-global--FontSize--2xl); }
  .pf-v5-u-font-size-xl { font-size: var(--pf-global--FontSize--xl); }
  .pf-v5-u-ml-sm { margin-left: var(--pf-global--spacer--sm); }

  /* Page Section Styles */
  .pf-v5-c-page__main-section {
    padding: var(--pf-global--spacer--xl);
    background-color: white; /* Default light background */
  }
  .pf-v5-c-page__main-section.pf-m-light {
    background-color: var(--pf-global--BackgroundColor--100);
  }
  .pf-v5-u-py-xl { padding-top: var(--pf-global--spacer--xl); padding-bottom: var(--pf-global--spacer--xl); }
  .pf-v5-u-text-align-center { text-align: center; }
  .pf-v5-u-pb-lg { padding-bottom: var(--pf-global--spacer--lg); }
  .pf-v5-c-title {
    font-size: var(--pf-global--FontSize--2xl);
    font-weight: var(--pf-global--FontWeight--bold);
    color: #333;
    margin-top: 0;
    margin-bottom: var(--pf-global--spacer--md);
  }
  .pf-v5-u-mt-md { margin-top: var(--pf-global--spacer--md); }

  /* Toolbar Styles */
  .pf-v5-c-toolbar {
    display: flex;
    justify-content: center;
    margin-bottom: var(--pf-global--spacer--lg);
  }
  .pf-v5-c-toolbar__content {
    display: flex;
    gap: var(--pf-global--spacer--md);
    flex-wrap: wrap; /* Allow wrapping on smaller screens */
    align-items: center;
    max-width: 900px; /* Limit toolbar width */
    width: 100%;
  }
  .pf-v5-c-toolbar__item {
    flex-grow: 1; /* Allow items to grow */
    min-width: 200px; /* Minimum width for inputs/selects */
  }
  .pf-v5-c-text-input-group {
    display: flex;
    align-items: center;
    border: var(--pf-global--BorderWidth--sm) solid var(--pf-global--BorderColor--200);
    border-radius: var(--pf-global--BorderRadius--lg);
    padding: var(--pf-global--spacer--sm);
    background-color: white;
  }
  .pf-v5-c-text-input-group__text-input {
    border: none;
    outline: none;
    flex-grow: 1;
    padding: 0 var(--pf-global--spacer--sm);
    font-size: var(--pf-global--FontSize--sm);
  }
  .pf-v5-c-button.pf-m-control {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0 var(--pf-global--spacer--sm);
    color: var(--pf-global--BorderColor--200);
  }
  .pf-v5-c-button.pf-m-control:hover {
    color: #333;
  }

  /* Select/Dropdown Styles */
  .pf-v5-c-select {
    position: relative;
    width: 100%;
  }
  .pf-v5-c-select__toggle {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: var(--pf-global--spacer--sm);
    border: var(--pf-global--BorderWidth--sm) solid var(--pf-global--BorderColor--200);
    border-radius: var(--pf-global--BorderRadius--lg);
    background-color: white;
    cursor: pointer;
    font-size: var(--pf-global--FontSize--sm);
    text-align: left;
  }
  .pf-v5-c-select__toggle:hover {
    border-color: var(--pf-global--primary-color--100);
  }
  .pf-v5-c-select__toggle-arrow {
    margin-left: var(--pf-global--spacer--sm);
    transition: transform 0.2s ease-in-out;
  }
  .pf-v5-c-select__toggle[aria-expanded="true"] .pf-v5-c-select__toggle-arrow {
    transform: rotate(180deg);
  }
  .pf-v5-c-select__menu {
    position: absolute;
    width: 100%;
    background-color: white;
    border: var(--pf-global--BorderWidth--sm) solid var(--pf-global--BorderColor--100);
    border-radius: var(--pf-global--BorderRadius--lg);
    box-shadow: var(--pf-global--BoxShadow--sm);
    z-index: 10;
    margin-top: var(--pf-global--spacer--xs);
    max-height: 200px;
    overflow-y: auto;
    list-style: none; /* Remove default list bullets */
    padding: 0;
  }
  .pf-v5-c-select__menu-item {
    padding: var(--pf-global--spacer--sm) var(--pf-global--spacer--md);
    cursor: pointer;
    font-size: var(--pf-global--FontSize--sm);
  }
  .pf-v5-c-select__menu-item:hover {
    background-color: var(--pf-global--BackgroundColor--300);
  }

  /* Gallery/Card Layout */
  .pf-v5-c-gallery {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); /* Adjusted min-width for better spacing */
    gap: var(--pf-global--spacer--lg);
    padding-bottom: var(--pf-global--spacer--xl); /* Ensure space at bottom of page */
  }

  /* Card Styles */
  .pf-v5-c-card {
    background-color: white;
    border: var(--pf-global--BorderWidth--sm) solid var(--pf-global--BorderColor--100);
    border-radius: var(--pf-global--BorderRadius--lg);
    box-shadow: var(--pf-global--BoxShadow--sm);
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
    transition: box-shadow 0.2s ease-in-out;
  }
  .pf-v5-c-card.pf-m-hoverable:hover {
    box-shadow: var(--pf-global--BoxShadow--md);
  }
  .pf-v5-c-card__title {
    padding: var(--pf-global--spacer--lg);
    font-size: var(--pf-global--FontSize--lg);
    font-weight: var(--pf-global--FontWeight--bold);
    color: #333;
  }
  .pf-v5-c-card__title h3 { /* Ensure h3 inside title has correct styling */
    margin: 0;
    font-size: inherit;
    font-weight: inherit;
  }
  .pf-v5-c-card__body {
    padding: 0 var(--pf-global--spacer--lg) var(--pf-global--spacer--lg);
    flex-grow: 1;
    font-size: var(--pf-global--FontSize--sm);
    color: #6a6e73;
  }
  .pf-v5-c-card__footer {
    padding: var(--pf-global--spacer--lg);
    border-top: var(--pf-global--BorderWidth--sm) solid var(--pf-global--BorderColor--100);
    display: flex;
    flex-wrap: wrap;
    gap: var(--pf-global--spacer--sm);
    padding-top: var(--pf-global--spacer--md);
    align-items: flex-end; /* Align button to bottom */
  }
  .pf-v5-c-label {
    display: inline-flex;
    align-items: center;
    padding: var(--pf-global--spacer--xs) var(--pf-global--spacer--sm);
    border-radius: var(--pf-global--BorderRadius--lg);
    font-size: var(--pf-global--FontSize--sm);
  }
  .pf-v5-c-label.pf-m-outline.pf-m-blue {
    border: var(--pf-global--BorderWidth--sm) solid var(--pf-global--active-color--100);
    color: var(--pf-global--active-color--100);
    background-color: transparent;
  }
  .pf-v5-c-button {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    padding: var(--pf-global--spacer--sm) var(--pf-global--spacer--lg);
    border-radius: var(--pf-global--BorderRadius--lg);
    cursor: pointer;
    font-size: var(--pf-global--FontSize--sm);
    font-weight: var(--pf-global--FontWeight--bold);
    text-decoration: none; /* For <a> tags styled as buttons */
    transition: background-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  }
  .pf-v5-c-button.pf-m-primary {
    background-color: var(--pf-global--primary-color--100);
    color: white;
    border: none;
  }
  .pf-v5-c-button.pf-m-primary:hover {
    background-color: var(--pf-global--primary-color--200);
    box-shadow: var(--pf-global--BoxShadow--sm);
  }
  .w-full {
    width: 100%;
  }

  /* Empty State / Loading State */
  .pf-v5-c-empty-state {
    text-align: center;
    padding: var(--pf-global--spacer--2xl);
    background-color: white;
    border-radius: var(--pf-global--BorderRadius--lg);
    box-shadow: var(--pf-global--BoxShadow--sm);
    margin: var(--pf-global--spacer--xl) auto;
    max-width: 600px;
  }
  .pf-v5-c-empty-state__icon {
    margin-bottom: var(--pf-global--spacer--md);
    color: #6a6e73; /* Default icon color */
  }
  .pf-v5-c-empty-state__body {
    font-size: var(--pf-global--FontSize--sm);
    color: #6a6e73;
  }
  .pf-v5-c-spinner {
    --spinner-size: 50px;
    border: 5px solid rgba(0, 0, 0, 0.1);
    border-top: 5px solid var(--pf-global--primary-color--100);
    border-radius: 50%;
    width: var(--spinner-size);
    height: var(--spinner-size);
    animation: spin 1s linear infinite;
    display: inline-block;
  }
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  .pf-v5-c-cubes-icon { /* Custom style for CubesIcon if it doesn't resolve */
    font-size: 3rem; /* Adjust size for the icon */
  }
`;

// Mock data for kickstarts
const mockKickstarts = [
  {
    id: 'vllm-cpu',
    title: 'vLLM CPU',
    description: 'Optimize large language model inference on CPUs for efficient, cost-effective deployments, leveraging open-source frameworks like OpenVINO and ONNX Runtime.',
    githubLink: 'https://github.com/rh-ai-kickstart/vllm-cpu',
    categories: ['LLM', 'Inference', 'Optimization', 'CPU']
  },
  {
    id: 'ai-observability-metric-summarizer',
    title: 'AI Observability Metric Summarizer',
    description: 'Summarize complex observability metrics using AI, providing quick insights into system health and performance anomalies.',
    githubLink: 'https://github.com/rh-ai-kickstart/AI-Observability-Metric-Summarizer',
    categories: ['Observability', 'AI', 'Metrics', 'Monitoring']
  },
  {
    id: 'rag',
    title: 'Retrieval Augmented Generation (RAG)',
    description: 'Implement a RAG pipeline for enhanced LLM responses by grounding them in external knowledge bases, improving accuracy and relevance.',
    githubLink: 'https://github.com/rh-ai-kickstart/RAG',
    categories: ['LLM', 'RAG', 'Knowledge Base', 'Information Retrieval']
  },
  {
    id: 'model-serving-fastapi',
    title: 'Model Serving with FastAPI',
    description: 'Deploy and serve machine learning models using FastAPI, providing high-performance APIs for inference in production environments.',
    githubLink: 'https://github.com/rh-ai-kickstart/model-serving-fastapi',
    categories: ['MLOps', 'Deployment', 'API', 'Python']
  },
  {
    id: 'ai-assistant-chatbot',
    title: 'AI Assistant Chatbot',
    description: 'Build an intelligent chatbot that leverages LLMs and knowledge bases to provide conversational AI support for various use cases.',
    githubLink: 'https://github.com/rh-ai-kickstart/ai-assistant-chatbot',
    categories: ['Chatbot', 'LLM', 'Conversational AI', 'Assistant']
  },
  {
    id: 'data-science-workbench',
    title: 'Data Science Workbench',
    description: 'A comprehensive environment for data scientists, featuring popular tools and libraries for data analysis, machine learning, and visualization.',
    githubLink: 'https://github.com/rh-ai-kickstart/data-science-workbench',
    categories: ['Data Science', 'Machine Learning', 'Analytics', 'Jupyter']
  }
];

// Helper to get all unique categories from mock data
const getAllCategories = () => {
  const categories = new Set();
  mockKickstarts.forEach(kickstart => {
    kickstart.categories.forEach(cat => categories.add(cat));
  });
  return Array.from(categories).sort();
};

const allCategories = getAllCategories();

// Replaced PatternFly React components with HTML elements and custom CSS classes
const KickstartCard = ({ kickstart }) => (
  <div className="pf-v5-c-card pf-m-hoverable">
    <div className="pf-v5-c-card__title">
      <h3>{kickstart.title}</h3>
    </div>
    <div className="pf-v5-c-card__body">
      {kickstart.description}
    </div>
    <div className="pf-v5-c-card__footer">
      {kickstart.categories.map((category, index) => (
        <span
          key={index}
          className="pf-v5-c-label pf-m-outline pf-m-blue"
        >
          {category}
        </span>
      ))}
      <a
        href={kickstart.githubLink}
        target="_blank"
        rel="noopener noreferrer" // Security best practice for target="_blank"
        className="pf-v5-c-button pf-m-primary w-full"
        role="button" // Indicates it's a button for accessibility
      >
        View on GitHub
      </a>
    </div>
  </div>
);

const App = () => {
  const [kickstarts, setKickstarts] = useState([]);
  const [filteredKickstarts, setFilteredKickstarts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCategorySelectOpen, setIsCategorySelectOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate data loading
  useEffect(() => {
    setIsLoading(true);
    // In a real application, this would be a fetch call to your backend
    setTimeout(() => {
      setKickstarts(mockKickstarts);
      setFilteredKickstarts(mockKickstarts);
      setIsLoading(false);
    }, 1000); // Simulate network delay
  }, []);

  useEffect(() => {
    // Apply filters whenever search term or category changes
    let currentFiltered = kickstarts;

    // Search term filter
    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      currentFiltered = currentFiltered.filter(kickstart =>
        kickstart.title.toLowerCase().includes(lowerCaseSearchTerm) ||
        kickstart.description.toLowerCase().includes(lowerCaseSearchTerm)
      );
    }

    // Category filter
    if (selectedCategory) {
      currentFiltered = currentFiltered.filter(kickstart =>
        kickstart.categories.includes(selectedCategory)
      );
    }

    setFilteredKickstarts(currentFiltered);
  }, [searchTerm, selectedCategory, kickstarts]);

  const onCategorySelectToggle = (isOpen) => {
    setIsCategorySelectOpen(isOpen);
  };

  // The 'selection' parameter directly receives the value from the clicked list item.
  const onCategorySelect = (selection) => {
    setSelectedCategory(selection === 'All Categories' ? null : selection);
    setIsCategorySelectOpen(false);
  };

  return (
    <>
      {/* Inject custom CSS for PatternFly look-alike */}
      <style>{customPatternFlyStyle}</style>

      {/* Main Page Layout using div elements */}
      <div className="pf-v5-c-page">
        {/* Masthead */}
        <header className="pf-v5-c-masthead">
          <div className="pf-v5-c-masthead__main">
            <div className="pf-v5-c-masthead__brand">
              {/* Corrected href from '#' to '/' for accessibility */}
              <a className="pf-v5-c-brand" href="/">
                <img src="https://placehold.co/100x30/FFFFFF/EE0000?text=Red%20Hat" alt="Red Hat Logo" />
                <span className="pf-v5-u-font-weight-bold pf-v5-u-font-size-2xl">Red Hat</span>
                <span className="pf-v5-u-font-size-xl pf-v5-u-ml-sm">AI Kickstarts</span>
              </a>
            </div>
          </div>
          <div className="pf-v5-c-masthead__content">
            {/* Additional header content can go here */}
          </div>
        </header>

        {/* Main Content Area */}
        <main className="pf-v5-c-page__main">
          {/* Hero Section / Introduction */}
          <section className="pf-v5-c-page__main-section pf-m-light pf-v5-u-py-xl">
            <div className="pf-v5-u-text-align-center pf-v5-u-pb-lg">
              <h1 className="pf-v5-c-title">Explore Red Hat AI Kickstarts</h1>
              <p className="pf-v5-u-mt-md">Discover ready-to-run AI examples designed for OpenShift.</p>
            </div>

            {/* Toolbar for Search and Filter */}
            <div className="pf-v5-c-toolbar pf-v5-u-mb-lg">
              <div className="pf-v5-c-toolbar__content">
                <div className="pf-v5-c-toolbar__item">
                  <div className="pf-v5-c-text-input-group">
                    <input
                      className="pf-v5-c-text-input-group__text-input"
                      type="search"
                      aria-label="Search kickstarts"
                      placeholder="Search by title or description..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button className="pf-v5-c-button pf-m-control" aria-label="Search button">
                      {/* Search Icon (inline SVG or simple character) */}
                      <svg fill="currentColor" height="1em" width="1em" viewBox="0 0 512 512" aria-hidden="true" role="img" style={{ verticalAlign: '-0.125em' }}>
                        <path d="M416 208c0 45.9-14.9 88.3-40 122.7L476 438.7c3.1 3.1 4.7 7.2 4.7 11.3 0 4.1-1.6 8.2-4.7 11.3l-22.6 22.6c-3.1 3.1-7.2 4.7-11.3 4.7-4.1 0-8.2-1.6-11.3-4.7L339.3 360c-34.4 25.1-76.8 40-122.7 40C93.1 400 0 306.9 0 208S93.1 16 208 16s208 93.1 208 192zM208 64c-77.9 0-141 63.1-141 141s63.1 141 141 141 141-63.1 141-141-63.1-141-141-141z"></path>
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="pf-v5-c-toolbar__item">
                  <div className="pf-v5-c-select">
                    <button
                      className="pf-v5-c-select__toggle"
                      onClick={() => onCategorySelectToggle(!isCategorySelectOpen)}
                      aria-expanded={isCategorySelectOpen}
                    >
                      <span>{selectedCategory || 'Filter by Category'}</span>
                      <span className="pf-v5-c-select__toggle-arrow">
                        &#9660; {/* Unicode for down arrow */}
                      </span>
                    </button>
                    {isCategorySelectOpen && (
                      <ul className="pf-v5-c-select__menu">
                        <li className="pf-v5-c-select__menu-item" onClick={() => onCategorySelect('All Categories')}>All Categories</li>
                        {allCategories.map((category, index) => (
                          <li key={index} className="pf-v5-c-select__menu-item" onClick={() => onCategorySelect(category)}>{category}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Kickstarts Gallery */}
          <section className="pf-v5-c-page__main-section">
            {isLoading ? (
              <div className="pf-v5-c-empty-state">
                <div className="pf-v5-c-empty-state__icon">
                  <div className="pf-v5-c-spinner" role="progressbar" aria-label="Loading..."></div>
                </div>
                <h2 className="pf-v5-c-title pf-m-xl">Loading Kickstarts...</h2>
                <div className="pf-v5-c-empty-state__body">
                  Fetching the latest AI kickstart projects.
                </div>
              </div>
            ) : (
              filteredKickstarts.length > 0 ? (
                <div className="pf-v5-c-gallery">
                  {filteredKickstarts.map(kickstart => (
                    <KickstartCard key={kickstart.id} kickstart={kickstart} />
                  ))}
                </div>
              ) : (
                <div className="pf-v5-c-empty-state">
                  <div className="pf-v5-c-empty-state__icon">
                    {/* Cubes Icon (inline SVG or simple character) */}
                    <svg fill="currentColor" height="3em" width="3em" viewBox="0 0 512 512" aria-hidden="true" role="img" style={{ verticalAlign: '-0.125em' }}>
                      <path d="M472 0H40C17.9 0 0 17.9 0 40v304c0 22.1 17.9 40 40 40h128l48 96 48-96h128c22.1 0 40-17.9 40-40V40c0-22.1-17.9-40-40-40zm-80 304h-96V208h96v96zM128 104c0-22.1 17.9-40 40-40h176c22.1 0 40 17.9 40 40v96H128v-96zm256 128h-96v96h96v-96zM128 304v-96h96v96h-96z"></path>
                    </svg>
                  </div>
                  <h2 className="pf-v5-c-title pf-m-xl">No Kickstarts Found</h2>
                  <div className="pf-v5-c-empty-state__body">
                    Adjust your search or filter criteria to find more kickstarts.
                  </div>
                </div>
              )
            )}
          </section>
        </main>
      </div>
    </>
  );
};

export default App;
