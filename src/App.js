import React, { useState, useEffect } from 'react';
import { fetchKickstarts, getAllCategories, forceRefreshKickstarts } from './api/kickstarts';

// NOTE: Direct imports of PatternFly React components like '@patternfly/react-core'
// and '@patternfly/react-icons' are causing resolution errors in this self-contained
// environment. To make this prototype runnable, we will implement the UI using standard
// HTML elements and apply custom CSS classes that mimic PatternFly's design system.
// Icons will be replaced with inline SVGs or unicode characters as needed.

// Red Hat's official color palette
const customPatternFlyStyle = `
  :root {
    /* Red Hat Official Colors */
    --rh-red: #EE0000;
    --rh-red-dark: #CC0000;
    --rh-black: #000000;
    --rh-gray-100: #F5F5F5;
    --rh-gray-200: #E5E5E5;
    --rh-gray-300: #D1D1D1;
    --rh-gray-400: #BBBBBB;
    --rh-gray-500: #8A8D90;
    --rh-gray-600: #6A6E73;
    --rh-gray-700: #4A4D50;
    --rh-gray-800: #2A2D30;
    --rh-gray-900: #1A1D20;

    /* Spacing */
    --pf-global--spacer--xs: 0.25rem;
    --pf-global--spacer--sm: 0.5rem;
    --pf-global--spacer--md: 1rem;
    --pf-global--spacer--lg: 1.5rem;
    --pf-global--spacer--xl: 2rem;
    --pf-global--spacer--2xl: 3rem;

    /* Typography */
    --pf-global--FontSize--sm: 0.875rem;
    --pf-global--FontSize--md: 1rem;
    --pf-global--FontSize--lg: 1.125rem;
    --pf-global--FontSize--xl: 1.25rem;
    --pf-global--FontSize--2xl: 1.5rem;

    /* Font Weights */
    --pf-global--FontWeight--normal: 400;
    --pf-global--FontWeight--medium: 500;
    --pf-global--FontWeight--bold: 700;

    /* Borders */
    --pf-global--BorderWidth--sm: 1px;
    --pf-global--BorderRadius--sm: 0.25rem;
    --pf-global--BorderRadius--md: 0.375rem;
    --pf-global--BorderRadius--lg: 0.5rem;

    /* Shadows */
    --pf-global--BoxShadow--sm: 0 0.0625rem 0.125rem rgba(3,3,3,0.1);
    --pf-global--BoxShadow--md: 0 0.125rem 0.25rem rgba(3,3,3,0.1);
    --pf-global--BoxShadow--lg: 0 0.25rem 0.5rem rgba(3,3,3,0.1);

    /* Transitions */
    --pf-global--Transition: all 0.2s ease-in-out;
  }

  body {
    margin: 0;
    background-color: var(--rh-gray-100);
    font-family: 'Red Hat Text', 'Overpass', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    color: var(--rh-gray-800);
    line-height: 1.5;
  }

  .pf-v5-c-page {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  /* Masthead Styles */
  .pf-v5-c-masthead {
    background: linear-gradient(90deg, var(--rh-black) 0%, var(--rh-red-dark) 100%);
    color: white;
    padding: var(--pf-global--spacer--md) var(--pf-global--spacer--xl);
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: var(--pf-global--BoxShadow--md);
  }

  .pf-v5-c-masthead__brand {
    display: flex;
    align-items: center;
    gap: var(--pf-global--spacer--md);
  }

  .pf-v5-c-brand {
    display: flex;
    align-items: center;
    text-decoration: none;
    color: white;
    transition: var(--pf-global--Transition);
  }

  .pf-v5-c-brand:hover {
    opacity: 0.9;
  }

  .pf-v5-c-brand img {
    height: 40px;
    width: auto;
  }

  .pf-v5-c-brand span {
    color: white;
    font-weight: var(--pf-global--FontWeight--bold);
  }

  /* Page Section Styles */
  .pf-v5-c-page__main-section {
    padding: var(--pf-global--spacer--xl);
    background-color: white;
  }

  .pf-v5-c-page__main-section.pf-m-light {
    background-color: var(--rh-gray-100);
  }

  .pf-v5-c-title {
    color: var(--rh-black);
    font-weight: var(--pf-global--FontWeight--bold);
    margin: 0 0 var(--pf-global--spacer--md);
  }

  /* Toolbar Styles */
  .pf-v5-c-toolbar {
    background-color: white;
    border-radius: var(--pf-global--BorderRadius--lg);
    padding: var(--pf-global--spacer--lg);
    box-shadow: var(--pf-global--BoxShadow--sm);
    margin-bottom: var(--pf-global--spacer--xl);
  }

  .pf-v5-c-text-input-group {
    border: var(--pf-global--BorderWidth--sm) solid var(--rh-gray-300);
    border-radius: var(--pf-global--BorderRadius--lg);
    transition: var(--pf-global--Transition);
  }

  .pf-v5-c-text-input-group:focus-within {
    border-color: var(--rh-red);
    box-shadow: 0 0 0 2px rgba(238, 0, 0, 0.1);
  }

  .pf-v5-c-text-input-group__text-input {
    font-size: var(--pf-global--FontSize--md);
    padding: var(--pf-global--spacer--sm) var(--pf-global--spacer--md);
  }

  /* Card Styles */
  .pf-v5-c-card {
    background-color: white;
    border: var(--pf-global--BorderWidth--sm) solid var(--rh-gray-200);
    border-radius: var(--pf-global--BorderRadius--lg);
    box-shadow: var(--pf-global--BoxShadow--sm);
    transition: var(--pf-global--Transition);
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .pf-v5-c-card.pf-m-hoverable:hover {
    transform: translateY(-2px);
    box-shadow: var(--pf-global--BoxShadow--md);
    border-color: var(--rh-gray-300);
  }

  .pf-v5-c-card__title {
    padding: var(--pf-global--spacer--lg);
    border-bottom: var(--pf-global--BorderWidth--sm) solid var(--rh-gray-200);
  }

  .pf-v5-c-card__title h3 {
    margin: 0;
    font-size: var(--pf-global--FontSize--lg);
    font-weight: var(--pf-global--FontWeight--bold);
  }

  .pf-v5-c-card__body {
    padding: var(--pf-global--spacer--lg);
    flex-grow: 1;
  }

  .pf-v5-c-card__footer {
    padding: var(--pf-global--spacer--lg);
    border-top: var(--pf-global--BorderWidth--sm) solid var(--rh-gray-200);
    background-color: var(--rh-gray-100);
  }

  /* Label Styles */
  .pf-v5-c-label {
    background-color: var(--rh-gray-100);
    border: var(--pf-global--BorderWidth--sm) solid var(--rh-gray-300);
    color: var(--rh-gray-700);
    font-size: var(--pf-global--FontSize--sm);
    padding: var(--pf-global--spacer--xs) var(--pf-global--spacer--sm);
    border-radius: var(--pf-global--BorderRadius--sm);
    transition: var(--pf-global--Transition);
  }

  .pf-v5-c-label.pf-m-outline.pf-m-blue {
    background-color: rgba(238, 0, 0, 0.1);
    border-color: var(--rh-red);
    color: var(--rh-red);
  }

  /* Button Styles */
  .pf-v5-c-button {
    font-weight: var(--pf-global--FontWeight--medium);
    padding: var(--pf-global--spacer--sm) var(--pf-global--spacer--lg);
    border-radius: var(--pf-global--BorderRadius--lg);
    transition: var(--pf-global--Transition);
  }

  .pf-v5-c-button.pf-m-primary {
    background-color: var(--rh-red);
    border: none;
    color: white;
  }

  .pf-v5-c-button.pf-m-primary:hover {
    background-color: var(--rh-red-dark);
    box-shadow: var(--pf-global--BoxShadow--sm);
  }

  .pf-v5-c-button.pf-m-secondary {
    background-color: white;
    border: var(--pf-global--BorderWidth--sm) solid var(--rh-red);
    color: var(--rh-red);
  }

  .pf-v5-c-button.pf-m-secondary:hover {
    background-color: var(--rh-gray-100);
  }

  /* Empty State Styles */
  .pf-v5-c-empty-state {
    background-color: white;
    border-radius: var(--pf-global--BorderRadius--lg);
    box-shadow: var(--pf-global--BoxShadow--sm);
    padding: var(--pf-global--spacer--2xl);
    text-align: center;
  }

  .pf-v5-c-empty-state__icon {
    color: var(--rh-gray-500);
    margin-bottom: var(--pf-global--spacer--lg);
  }

  .pf-v5-c-empty-state__body {
    color: var(--rh-gray-600);
    max-width: 600px;
    margin: 0 auto;
  }

  /* Spinner Styles */
  .pf-v5-c-spinner {
    --spinner-size: 50px;
    border: 4px solid rgba(238, 0, 0, 0.1);
    border-top: 4px solid var(--rh-red);
    border-radius: 50%;
    width: var(--spinner-size);
    height: var(--spinner-size);
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  /* Gallery Layout */
  .pf-v5-c-gallery {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: var(--pf-global--spacer--xl);
    padding: var(--pf-global--spacer--xl) 0;
  }

  /* Link Styles */
  .kickstart-title-link {
    color: var(--rh-red);
    text-decoration: none;
    transition: var(--pf-global--Transition);
  }

  .kickstart-title-link:hover {
    color: var(--rh-red-dark);
    text-decoration: underline;
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    .pf-v5-c-gallery {
      grid-template-columns: 1fr;
    }

    .pf-v5-c-toolbar__content {
      flex-direction: column;
    }

    .pf-v5-c-toolbar__item {
      width: 100%;
    }
  }
`;

// Replaced PatternFly React components with HTML elements and custom CSS classes
const KickstartCard = ({ kickstart }) => (
  <div className="pf-v5-c-card pf-m-hoverable">
    <div className="pf-v5-c-card__title">
      <h3>
        <a
          href={`${kickstart.githubLink}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: 'var(--pf-global--link--Color)',
            textDecoration: 'underline',
            transition: 'color 0.2s ease-in-out',
            ':hover': {
              color: 'var(--pf-global--link--Color--hover)',
              textDecoration: 'none'
            }
          }}
          className="kickstart-title-link"
        >
          {kickstart.title}
        </a>
      </h3>
    </div>
    <div className="pf-v5-c-card__body">
      {/* Description section */}
      <div className="kickstart-description">
        <h4 style={{
          fontSize: 'var(--pf-global--FontSize--sm)',
          color: 'var(--pf-global--Color--200)',
          marginBottom: 'var(--pf-global--spacer--xs)'
        }}>
          Description
        </h4>
        <p style={{ marginBottom: 'var(--pf-global--spacer--md)' }}>
          {kickstart.description}
        </p>
      </div>

      {/* README preview section */}
      <div className="kickstart-readme">
        <h4 style={{
          fontSize: 'var(--pf-global--FontSize--sm)',
          color: 'var(--pf-global--Color--200)',
          marginBottom: 'var(--pf-global--spacer--xs)'
        }}>
          README Preview
        </h4>
        <p style={{
          fontSize: 'var(--pf-global--FontSize--sm)',
          color: 'var(--pf-global--Color--100)',
          fontStyle: 'italic',
          marginBottom: 'var(--pf-global--spacer--md)'
        }}>
          {kickstart.readmePreview}
        </p>
      </div>

      {/* Metadata section */}
      <div style={{
        marginTop: 'var(--pf-global--spacer--md)',
        fontSize: 'var(--pf-global--FontSize--sm)',
        color: 'var(--pf-global--Color--200)'
      }}>
        <small>Last updated: {kickstart.lastUpdated}</small>
        {kickstart.stars > 0 && (
          <span style={{ marginLeft: 'var(--pf-global--spacer--md)' }}>
            ⭐ {kickstart.stars} stars
          </span>
        )}
      </div>
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
        href={kickstart.githubLink.replace('#readme', '')}
        target="_blank"
        rel="noopener noreferrer"
        className="pf-v5-c-button pf-m-primary pf-m-sm"
        role="button"
        style={{
          fontSize: 'var(--pf-global--FontSize--sm)',
          padding: 'var(--pf-global--spacer--xs) var(--pf-global--spacer--sm)',
          marginTop: 'var(--pf-global--spacer--sm)'
        }}
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
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch kickstarts data with caching
  useEffect(() => {
    const loadKickstarts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchKickstarts();
        setKickstarts(data.kickstarts);
        setFilteredKickstarts(data.kickstarts);
        setCategories(getAllCategories(data.kickstarts));
      } catch (err) {
        setError(err.message);
        console.error('Failed to load kickstarts:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadKickstarts();
  }, []);

  // Handle background refresh
  useEffect(() => {
    let mounted = true;

    const handleBackgroundRefresh = async () => {
      try {
        setIsRefreshing(true);
        const data = await forceRefreshKickstarts();
        if (mounted) {
          setKickstarts(data.kickstarts);
          setFilteredKickstarts(data.kickstarts);
          setCategories(getAllCategories(data.kickstarts));
        }
      } catch (err) {
        console.error('Background refresh failed:', err);
      } finally {
        if (mounted) {
          setIsRefreshing(false);
        }
      }
    };

    // Set up periodic refresh (every hour)
    const refreshInterval = setInterval(handleBackgroundRefresh, 60 * 60 * 1000);

    return () => {
      mounted = false;
      clearInterval(refreshInterval);
    };
  }, []);

  useEffect(() => {
    // Apply filters whenever search term or categories change
    let currentFiltered = kickstarts;

    // Search term filter
    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      currentFiltered = currentFiltered.filter(kickstart =>
        kickstart.title.toLowerCase().includes(lowerCaseSearchTerm) ||
        kickstart.description.toLowerCase().includes(lowerCaseSearchTerm) ||
        kickstart.categories.some(cat => cat.toLowerCase().includes(lowerCaseSearchTerm))
      );
    }

    // Category filter - now supports multiple categories
    if (selectedCategories.length > 0) {
      currentFiltered = currentFiltered.filter(kickstart =>
        selectedCategories.some(selectedCat =>
          kickstart.categories.includes(selectedCat)
        )
      );
    }

    setFilteredKickstarts(currentFiltered);
  }, [searchTerm, selectedCategories, kickstarts]);

  const onCategorySelectToggle = (isOpen) => {
    setIsCategorySelectOpen(isOpen);
  };

  const onCategorySelect = (category) => {
    setSelectedCategories(prev => {
      if (category === 'All Categories') {
        return [];
      }
      if (prev.includes(category)) {
        return prev.filter(cat => cat !== category);
      }
      return [...prev, category];
    });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategories([]);
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
              <a className="pf-v5-c-brand" href="/">
                <img
                  src="/assets/logo.svg"
                  alt="Red Hat Fedora Logo"
                  style={{
                    height: '40px',
                    width: 'auto',
                    marginRight: 'var(--pf-global--spacer--md)'
                  }}
                />
                <span className="pf-v5-u-font-weight-bold pf-v5-u-font-size-2xl" style={{ color: 'white' }}>Red Hat</span>
                <span className="pf-v5-u-font-size-xl pf-v5-u-ml-sm" style={{ color: 'white' }}>AI Kickstarts</span>
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
              <h1 className="pf-v5-c-title">Explore Red Hat AI Kickstarts - v01</h1>
              <p className="pf-v5-u-mt-md">
                Discover ready-to-run AI examples designed for Red Hat OpenShift AI.
                {isRefreshing && (
                  <span style={{ marginLeft: 'var(--pf-global--spacer--sm)', fontSize: 'var(--pf-global--FontSize--sm)', color: 'var(--pf-global--Color--200)' }}>
                    (Refreshing data...)
                  </span>
                )}
              </p>
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
                      <span>
                        {selectedCategories.length > 0
                          ? `${selectedCategories.length} categories selected`
                          : 'Filter by Category'}
                      </span>
                      <span className="pf-v5-c-select__toggle-arrow">
                        &#9660;
                      </span>
                    </button>
                    {isCategorySelectOpen && (
                      <ul className="pf-v5-c-select__menu">
                        <li
                          className="pf-v5-c-select__menu-item"
                          onClick={() => {
                            setSelectedCategories([]);
                            setIsCategorySelectOpen(false);
                          }}
                        >
                          Clear Categories
                        </li>
                        {categories.map((category, index) => (
                          <li
                            key={index}
                            className={`pf-v5-c-select__menu-item ${selectedCategories.includes(category) ? 'pf-m-selected' : ''}`}
                            onClick={() => onCategorySelect(category)}
                          >
                            {category}
                            {selectedCategories.includes(category) && (
                              <span style={{ marginLeft: 'var(--pf-global--spacer--sm)' }}>✓</span>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
                {(searchTerm || selectedCategories.length > 0) && (
                  <div className="pf-v5-c-toolbar__item">
                    <button
                      className="pf-v5-c-button pf-m-secondary"
                      onClick={clearFilters}
                    >
                      Clear Filters
                    </button>
                  </div>
                )}
              </div>
              {/* Selected Categories Display */}
              {selectedCategories.length > 0 && (
                <div style={{
                  marginTop: 'var(--pf-global--spacer--md)',
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 'var(--pf-global--spacer--sm)'
                }}>
                  {selectedCategories.map((category, index) => (
                    <span
                      key={index}
                      className="pf-v5-c-label pf-m-outline pf-m-blue"
                      style={{ cursor: 'pointer' }}
                      onClick={() => onCategorySelect(category)}
                    >
                      {category} ×
                    </span>
                  ))}
                </div>
              )}
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
                  Fetching the latest AI kickstart projects from GitHub.
                </div>
              </div>
            ) : error ? (
              <div className="pf-v5-c-empty-state">
                <div className="pf-v5-c-empty-state__icon">
                  <svg fill="currentColor" height="3em" width="3em" viewBox="0 0 512 512" aria-hidden="true" role="img">
                    <path d="M256 32c14.2 0 27.3 7.5 34.5 19.8l216 368c7.3 12.4 7.3 27.7 .2 40.1S486.3 480 472 480H40c-14.3 0-27.6-7.7-34.7-20.1s-7-27.8 .2-40.1l216-368C228.7 39.5 241.8 32 256 32zm0 128c-13.3 0-24 10.7-24 24V296c0 13.3 10.7 24 24 24s24-10.7 24-24V184c0-13.3-10.7-24-24-24zm32 224a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z"/>
                  </svg>
                </div>
                <h2 className="pf-v5-c-title pf-m-xl">Error Loading Kickstarts</h2>
                <div className="pf-v5-c-empty-state__body">
                  {error}
                </div>
                <button
                  className="pf-v5-c-button pf-m-primary"
                  onClick={() => window.location.reload()}
                >
                  Try Again
                </button>
              </div>
            ) : filteredKickstarts.length > 0 ? (
              <div className="pf-v5-c-gallery">
                {filteredKickstarts.map(kickstart => (
                  <KickstartCard key={kickstart.id} kickstart={kickstart} />
                ))}
              </div>
            ) : (
              <div className="pf-v5-c-empty-state">
                <div className="pf-v5-c-empty-state__icon">
                  <svg fill="currentColor" height="3em" width="3em" viewBox="0 0 512 512" aria-hidden="true" role="img">
                    <path d="M472 0H40C17.9 0 0 17.9 0 40v304c0 22.1 17.9 40 40 40h128l48 96 48-96h128c22.1 0 40-17.9 40-40V40c0-22.1-17.9-40-40-40zm-80 304h-96V208h96v96zM128 104c0-22.1 17.9-40 40-40h176c22.1 0 40 17.9 40 40v96H128v-96zm256 128h-96v96h96v-96zM128 304v-96h96v96h-96z"/>
                  </svg>
                </div>
                <h2 className="pf-v5-c-title pf-m-xl">No Kickstarts Found</h2>
                <div className="pf-v5-c-empty-state__body">
                  Adjust your search or filter criteria to find more kickstarts.
                </div>
              </div>
            )}
          </section>
        </main>
      </div>
    </>
  );
};

export default App;
