import React, { useState, useEffect } from 'react';
import { fetchKickstarts, getAllCategories, getAllTopics, fetchAllTopics, forceRefreshKickstarts, fetchRepoStats } from './api/kickstarts';
import { BASE_PATH } from './api/kickstarts';
import KickstartCard from './components/KickstartCard';
import SearchToolbar from './components/SearchToolbar';
import './styles/patternfly-custom.css';

const App = () => {
  const [kickstarts, setKickstarts] = useState([]);
  const [filteredKickstarts, setFilteredKickstarts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCategorySelectOpen, setIsCategorySelectOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isTopicSelectOpen, setIsTopicSelectOpen] = useState(false);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [topics, setTopics] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [repoStats, setRepoStats] = useState({ stars: 0, forks: 0, url: '' });

  // Fetch kickstarts data with caching
  useEffect(() => {
    const loadKickstarts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchKickstarts();

        // Fetch topics for all kickstarts
        const kickstartsWithTopics = await fetchAllTopics(data.kickstarts);

        setKickstarts(kickstartsWithTopics);
        setFilteredKickstarts(kickstartsWithTopics);
        setCategories(getAllCategories(kickstartsWithTopics));
        setTopics(getAllTopics(kickstartsWithTopics));
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
          // Fetch topics for all kickstarts
          const kickstartsWithTopics = await fetchAllTopics(data.kickstarts);

          setKickstarts(kickstartsWithTopics);
          setFilteredKickstarts(kickstartsWithTopics);
          setCategories(getAllCategories(kickstartsWithTopics));
          setTopics(getAllTopics(kickstartsWithTopics));
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
    // Apply filters whenever search term, categories, or topics change
    let currentFiltered = kickstarts;

    // Search term filter
    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      currentFiltered = currentFiltered.filter(kickstart =>
        kickstart.title.toLowerCase().includes(lowerCaseSearchTerm) ||
        kickstart.description.toLowerCase().includes(lowerCaseSearchTerm) ||
        kickstart.categories.some(cat => cat.toLowerCase().includes(lowerCaseSearchTerm)) ||
        (kickstart.topics && kickstart.topics.some(topic => topic.toLowerCase().includes(lowerCaseSearchTerm)))
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

    // Topic filter - supports multiple topics
    if (selectedTopics.length > 0) {
      currentFiltered = currentFiltered.filter(kickstart =>
        selectedTopics.some(selectedTopic =>
          kickstart.topics && kickstart.topics.includes(selectedTopic)
        )
      );
    }

    setFilteredKickstarts(currentFiltered);
  }, [searchTerm, selectedCategories, selectedTopics, kickstarts]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategories([]);
    setSelectedTopics([]);
  };

  // Add effect to fetch repo stats
  useEffect(() => {
    const loadRepoStats = async () => {
      const stats = await fetchRepoStats();
      setRepoStats(stats);
    };
    loadRepoStats();
  }, []);

  return (
    <div className="pf-v5-c-page">
        {/* Masthead */}
        <header className="pf-v5-c-masthead">
          <div className="pf-v5-c-masthead__main">
            <div className="pf-v5-c-masthead__brand">
              <a className="pf-v5-c-brand" href="/">
                <img
                  src={`${BASE_PATH}/assets/logo.svg`}
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
              <h1 className="pf-v5-c-title">Explore Red Hat AI Kickstarts - v02</h1>
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
            <SearchToolbar
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              isCategorySelectOpen={isCategorySelectOpen}
              setIsCategorySelectOpen={setIsCategorySelectOpen}
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
              categories={categories}
              isTopicSelectOpen={isTopicSelectOpen}
              setIsTopicSelectOpen={setIsTopicSelectOpen}
              selectedTopics={selectedTopics}
              setSelectedTopics={setSelectedTopics}
              topics={topics}
              clearFilters={clearFilters}
            />
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

        {/* Add Footer */}
        <footer className="pf-v5-c-footer">
          <div className="pf-v5-c-footer__content">
            <div className="pf-v5-c-footer__text">
              PoC App by <a href="https://red.ht/cai-team" className="pf-v5-c-footer__link" target="_blank" rel="noopener noreferrer">red.ht/cai-team</a>
            </div>
            <div className="pf-v5-c-footer__stats">
              <a href={repoStats.url} className="pf-v5-c-footer__link" target="_blank" rel="noopener noreferrer">
                <span className="pf-v5-c-footer__stat">
                  <svg className="pf-v5-c-footer__stat-icon" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M8 .25a.75.75 0 0 1 .673.418l3.058 6.197 6.839.994a.75.75 0 0 1 .415 1.279l-4.948 4.823 1.168 6.811a.75.75 0 0 1-1.088.791L8 13.347l-6.116 3.216a.75.75 0 0 1-1.088-.79l1.168-6.812-4.948-4.823a.75.75 0 0 1 .416-1.28l6.838-.993L7.327.668A.75.75 0 0 1 8 .25z"/>
                  </svg>
                  {repoStats.stars}
                </span>
                <span className="pf-v5-c-footer__stat">
                  <svg className="pf-v5-c-footer__stat-icon" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M5 3.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0zm0 2.122a2.25 2.25 0 1 0-1.5 0v.878A2.25 2.25 0 0 0 5.75 8.5h1.5v2.128a2.251 2.251 0 1 0 1.5 0V8.5h1.5a2.25 2.25 0 0 0 2.25-2.25v-.878a2.25 2.25 0 1 0-1.5 0v.878a.75.75 0 0 1-.75.75h-4.5A.75.75 0 0 1 5 6.25v-.878zm3.75 7.378a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0zm3-8.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5z"/>
                  </svg>
                  {repoStats.forks}
                </span>
              </a>
            </div>
          </div>
        </footer>
      </div>
  );
};

export default App;
