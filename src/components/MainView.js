import React from 'react';
import KickstartCard from './KickstartCard';
import SearchToolbar from './SearchToolbar';

const MainView = ({ 
  kickstarts,
  filteredKickstarts, 
  searchTerm, 
  setSearchTerm,
  isCategorySelectOpen,
  setIsCategorySelectOpen,
  selectedCategories,
  setSelectedCategories,
  isTopicSelectOpen,
  setIsTopicSelectOpen,
  selectedTopics,
  setSelectedTopics,
  isLoading,
  error,
  categories,
  topics,
  isRefreshing,
  repoStats,
  handleBackgroundRefresh
}) => {
  return (
    <div className="pf-v5-c-page">
      {/* Red Hat Top Navigation */}
      <div className="red-hat-top-nav" style={{
        backgroundColor: '#151515',
        borderBottom: '1px solid #393f44',
        fontSize: 'var(--pf-global--FontSize--sm)',
        minHeight: '36px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: 'var(--pf-global--spacer--sm) var(--pf-global--spacer--lg)'
      }}>
        <nav style={{ display: 'flex', alignItems: 'center', gap: 'var(--pf-global--spacer--md)' }}>
          <a href="https://access.redhat.com/support" target="_blank" rel="noopener noreferrer" style={{
            color: '#ffffff',
            textDecoration: 'none',
            padding: '6px 0',
            fontSize: '14px',
            ':hover': { textDecoration: 'underline' }
          }} className="top-nav-link">
            Support
          </a>
          <span style={{ color: '#6a6e73', fontSize: '14px' }}>|</span>
          <a href="https://console.redhat.com" target="_blank" rel="noopener noreferrer" style={{
            color: '#ffffff',
            textDecoration: 'none',
            padding: '6px 0',
            fontSize: '14px'
          }} className="top-nav-link">
            Console
          </a>
          <span style={{ color: '#6a6e73', fontSize: '14px' }}>|</span>
          <a href="https://developers.redhat.com" target="_blank" rel="noopener noreferrer" style={{
            color: '#ffffff',
            textDecoration: 'none',
            padding: '6px 0',
            fontSize: '14px'
          }} className="top-nav-link">
            Developers
          </a>
          <span style={{ color: '#6a6e73', fontSize: '14px' }}>|</span>
          <a href="https://console.redhat.com/trial" target="_blank" rel="noopener noreferrer" style={{
            color: '#ffffff',
            textDecoration: 'none',
            padding: '6px 0',
            fontSize: '14px'
          }} className="top-nav-link">
            Start a trial
          </a>
          <span style={{ color: '#6a6e73', fontSize: '14px' }}>|</span>
          <button style={{
            background: 'none',
            border: 'none',
            color: '#ffffff',
            fontSize: '14px',
            cursor: 'pointer',
            padding: '6px 0',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }} className="top-nav-dropdown">
            All Red Hat
            <span style={{ fontSize: '11px', marginLeft: '4px' }}>▼</span>
          </button>
        </nav>
      </div>
      
      {/* Masthead */}
      <header className="pf-v5-c-masthead">
        <div className="pf-v5-c-masthead__main">
          <div className="pf-v5-c-masthead__brand">
            <a className="pf-v5-c-brand" href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
              <img
                src={`${process.env.PUBLIC_URL || ''}/assets/logo.svg`}
                alt="Red Hat Fedora Logo"
                style={{
                  height: '32px',
                  width: 'auto',
                  marginRight: 'var(--pf-global--spacer--md)'
                }}
              />
              <div style={{
                height: '40px',
                width: '1px',
                backgroundColor: '#6a6e73',
                marginRight: 'var(--pf-global--spacer--md)'
              }}></div>
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column',
                lineHeight: '1.2'
              }}>
                <span style={{ 
                  color: 'white', 
                  fontSize: '17px',
                  fontWeight: '400'
                }}>Red Hat</span>
                <span style={{ 
                  color: 'white', 
                  fontSize: '18px',
                  fontWeight: '700',
                  marginTop: '0px'
                }}>AI quickstarts</span>
              </div>
            </a>
          </div>
        </div>
        <div className="pf-v5-c-masthead__content">
          {/* Additional header content can go here */}
        </div>
      </header>
      
      <main className="pf-v5-c-page__main">
        {/* Hero Section / Introduction */}
        <section className="pf-v5-c-page__main-section pf-m-light pf-v5-u-py-xl">
          <div className="pf-v5-u-text-align-center pf-v5-u-pb-lg">
            <h1 className="pf-v5-c-title" style={{ fontSize: '2.5rem', fontWeight: '600' }}>Explore Red Hat AI quickstarts</h1>
            <p className="pf-v5-u-mt-md">
              Discover ready-to-run AI examples designed for Red Hat AI.
              {isRefreshing && (
                <span style={{ marginLeft: 'var(--pf-global--spacer--sm)', fontSize: 'var(--pf-global--FontSize--sm)', color: 'var(--pf-global--Color--200)' }}>
                  (Refreshing data...)
                </span>
              )}
            </p>
          </div>

          {/* Search and Filter Toolbar */}
          <SearchToolbar 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            categories={categories}
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
            isCategorySelectOpen={isCategorySelectOpen}
            setIsCategorySelectOpen={setIsCategorySelectOpen}
            topics={topics}
            selectedTopics={selectedTopics}
            setSelectedTopics={setSelectedTopics}
            isTopicSelectOpen={isTopicSelectOpen}
            setIsTopicSelectOpen={setIsTopicSelectOpen}
          />
        </section>

        {/* Kickstarts Gallery */}
        <section className="pf-v5-c-page__main-section" style={{ backgroundColor: 'white' }}>
          {isLoading ? (
            <div className="pf-v5-c-empty-state">
              <div className="pf-v5-c-empty-state__icon">
                <div className="pf-v5-c-spinner"></div>
              </div>
              <h2 className="pf-v5-c-title">Loading quickstarts...</h2>
              <div className="pf-v5-c-empty-state__body">
                <p>Fetching the latest AI quickstart examples</p>
              </div>
            </div>
          ) : error ? (
            <div className="pf-v5-c-empty-state">
              <div className="pf-v5-c-empty-state__icon" style={{ fontSize: '3rem' }}>
                ❌
              </div>
              <h2 className="pf-v5-c-title">Error Loading Quickstarts</h2>
              <div className="pf-v5-c-empty-state__body">
                <p>{error}</p>
                <p>Please try refreshing the page or check your internet connection.</p>
              </div>
            </div>
          ) : filteredKickstarts.length === 0 ? (
            <div className="pf-v5-c-empty-state">
              <div className="pf-v5-c-empty-state__icon" style={{ fontSize: '3rem' }}>
                🔍
              </div>
              <h2 className="pf-v5-c-title">No quickstarts found</h2>
              <div className="pf-v5-c-empty-state__body">
                <p>Try adjusting your search terms or filters to find more quickstarts.</p>
              </div>
            </div>
          ) : (
            <div className="pf-v5-c-gallery">
              {filteredKickstarts.map((kickstart, index) => (
                <KickstartCard key={index} kickstart={kickstart} />
              ))}
            </div>
          )}
        </section>

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
                    <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25zm0 2.445L6.615 5.5a.75.75 0 0 1-.564.41l-3.097.45 2.24 2.184a.75.75 0 0 1 .216.664l-.528 3.084 2.769-1.456a.75.75 0 0 1 .698 0l2.77 1.456-.53-3.084a.75.75 0 0 1 .216-.664l2.24-2.183-3.096-.45a.75.75 0 0 1-.564-.41L8 2.694z"/>
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
      </main>
    </div>
  );
};

export default MainView;
