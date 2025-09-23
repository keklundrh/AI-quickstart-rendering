import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { fetchKickstarts, getAllCategories, getAllTopics, fetchAllTopics, forceRefreshKickstarts, fetchRepoStats } from './api/kickstarts';
import { BASE_PATH } from './api/kickstarts';
import MainView from './components/MainView';
import Details from './components/Details';
import './styles/patternfly-custom.css';

// Sort function to prioritize latest and most starred quickstarts
const sortKickstarts = (kickstarts) => {
  return kickstarts.sort((a, b) => {
    // Parse dates - handle different date formats
    const parseDate = (dateStr) => {
      if (!dateStr) return new Date(0); // Default to epoch if no date
      
      // Handle MM/DD/YYYY format
      if (dateStr.includes('/')) {
        return new Date(dateStr);
      }
      
      // Handle ISO format or other standard formats
      return new Date(dateStr);
    };
    
    const dateA = parseDate(a.lastUpdated);
    const dateB = parseDate(b.lastUpdated);
    
    // Normalize stars (handle undefined/null)
    const starsA = a.stars || 0;
    const starsB = b.stars || 0;
    
    // Calculate days since last update (more recent = lower number)
    const now = new Date();
    const daysAgo = (date) => Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    const daysAgoA = daysAgo(dateA);
    const daysAgoB = daysAgo(dateB);
    
    // Create composite score: 
    // - Stars contribute directly to score
    // - Recency contributes inversely (recent = higher score)
    // - Weight stars more heavily than recency
    const scoreA = (starsA * 10) + Math.max(0, 365 - daysAgoA);
    const scoreB = (starsB * 10) + Math.max(0, 365 - daysAgoB);
    
    // Sort in descending order (highest score first)
    return scoreB - scoreA;
  });
};

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

        // Sort kickstarts by combining stars and recency (latest and most starred first)
        const sortedKickstarts = sortKickstarts(kickstartsWithTopics);

        setKickstarts(sortedKickstarts);
        setFilteredKickstarts(sortedKickstarts);
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
  const handleBackgroundRefresh = async () => {
    try {
      setIsRefreshing(true);
      const data = await forceRefreshKickstarts();
      // Fetch topics for all kickstarts
      const kickstartsWithTopics = await fetchAllTopics(data.kickstarts);

      // Sort kickstarts by combining stars and recency (latest and most starred first)
      const sortedKickstarts = sortKickstarts(kickstartsWithTopics);

      // Completely replace the state with fresh data to avoid any accumulation
      setKickstarts(sortedKickstarts);
      setFilteredKickstarts(sortedKickstarts);
      setCategories(getAllCategories(kickstartsWithTopics));
      setTopics(getAllTopics(kickstartsWithTopics));
    } catch (err) {
      console.error('Background refresh failed:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    // Set up periodic refresh (every hour)
    const refreshInterval = setInterval(handleBackgroundRefresh, 60 * 60 * 1000);

    return () => {
      clearInterval(refreshInterval);
    };
  }, [handleBackgroundRefresh]);

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

    // Sort filtered results to maintain priority order
    const sortedFiltered = sortKickstarts(currentFiltered);
    setFilteredKickstarts(sortedFiltered);
  }, [searchTerm, selectedCategories, selectedTopics, kickstarts]);

  // Add effect to fetch repo stats
  useEffect(() => {
    const loadRepoStats = async () => {
      const stats = await fetchRepoStats();
      setRepoStats(stats);
    };
    loadRepoStats();
  }, []);

  return (
    <Router basename={BASE_PATH}>
      <Routes>
        <Route 
          path="/" 
          element={
            <MainView
              kickstarts={kickstarts}
              filteredKickstarts={filteredKickstarts}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              isCategorySelectOpen={isCategorySelectOpen}
              setIsCategorySelectOpen={setIsCategorySelectOpen}
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
              isTopicSelectOpen={isTopicSelectOpen}
              setIsTopicSelectOpen={setIsTopicSelectOpen}
              selectedTopics={selectedTopics}
              setSelectedTopics={setSelectedTopics}
              isLoading={isLoading}
              error={error}
              categories={categories}
              topics={topics}
              isRefreshing={isRefreshing}
              repoStats={repoStats}
              handleBackgroundRefresh={handleBackgroundRefresh}
            />
          } 
        />
        <Route 
          path="/details/:name" 
          element={<Details kickstarts={kickstarts} />} 
        />
      </Routes>
    </Router>
  );
};

export default App;