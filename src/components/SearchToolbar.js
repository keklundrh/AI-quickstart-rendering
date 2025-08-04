import React from 'react';

const SearchToolbar = ({
  searchTerm,
  setSearchTerm,
  isCategorySelectOpen,
  setIsCategorySelectOpen,
  selectedCategories,
  setSelectedCategories,
  categories,
  isTopicSelectOpen,
  setIsTopicSelectOpen,
  selectedTopics,
  setSelectedTopics,
  topics,
  clearFilters
}) => {
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

  const onTopicSelectToggle = (isOpen) => {
    setIsTopicSelectOpen(isOpen);
  };

  const onTopicSelect = (topic) => {
    setSelectedTopics(prev => {
      if (topic === 'All Topics') {
        return [];
      }
      if (prev.includes(topic)) {
        return prev.filter(t => t !== topic);
      }
      return [...prev, topic];
    });
  };

  return (
    <div className="pf-v5-c-toolbar pf-v5-u-mb-lg">
      <div className="pf-v5-c-toolbar__content">
        <div className="pf-v5-c-toolbar__item">
          <div className="pf-v5-c-text-input-group">
            <input
              className="pf-v5-c-text-input-group__text-input"
              type="search"
              aria-label="Search kickstarts"
              placeholder="Search by title, description, categories, or topics..."
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
        <div className="pf-v5-c-toolbar__item">
          <div className="pf-v5-c-select">
            <button
              className="pf-v5-c-select__toggle"
              onClick={() => onTopicSelectToggle(!isTopicSelectOpen)}
              aria-expanded={isTopicSelectOpen}
            >
              <span>
                {selectedTopics.length > 0
                  ? `${selectedTopics.length} topics selected`
                  : 'Filter by Topic'}
              </span>
              <span className="pf-v5-c-select__toggle-arrow">
                &#9660;
              </span>
            </button>
            {isTopicSelectOpen && (
              <ul className="pf-v5-c-select__menu">
                <li
                  className="pf-v5-c-select__menu-item"
                  onClick={() => {
                    setSelectedTopics([]);
                    setIsTopicSelectOpen(false);
                  }}
                >
                  Clear Topics
                </li>
                {topics.map((topic, index) => (
                  <li
                    key={index}
                    className={`pf-v5-c-select__menu-item ${selectedTopics.includes(topic) ? 'pf-m-selected' : ''}`}
                    onClick={() => onTopicSelect(topic)}
                  >
                    {topic}
                    {selectedTopics.includes(topic) && (
                      <span style={{ marginLeft: 'var(--pf-global--spacer--sm)' }}>✓</span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        {(searchTerm || selectedCategories.length > 0 || selectedTopics.length > 0) && (
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
      {/* Selected Categories and Topics Display */}
      {(selectedCategories.length > 0 || selectedTopics.length > 0) && (
        <div style={{
          marginTop: 'var(--pf-global--spacer--md)',
          display: 'flex',
          flexWrap: 'wrap',
          gap: 'var(--pf-global--spacer--sm)'
        }}>
          {selectedCategories.map((category, index) => (
            <span
              key={`cat-${index}`}
              className="pf-v5-c-label pf-m-outline pf-m-blue"
              style={{ cursor: 'pointer' }}
              onClick={() => onCategorySelect(category)}
            >
              Category: {category} ×
            </span>
          ))}
          {selectedTopics.map((topic, index) => (
            <span
              key={`topic-${index}`}
              className="pf-v5-c-label pf-m-outline pf-m-green"
              style={{ cursor: 'pointer' }}
              onClick={() => onTopicSelect(topic)}
            >
              Topic: {topic} ×
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchToolbar;