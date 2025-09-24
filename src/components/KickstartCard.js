import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BASE_PATH } from '../api/kickstarts';

// Function to get relevant icons/emojis with labels based on kickstart data
const getKickstartIcons = (kickstart) => {
  const iconData = [];
  
  // Category-based icons
  const categoryIcons = {
    'AI': { emoji: '🤖', label: 'AI' },
    'Python': { emoji: '🐍', label: 'Python' }, 
    'TypeScript': { emoji: '📘', label: 'TypeScript' },
    'JavaScript': { emoji: '📜', label: 'JavaScript' },
    'OpenShift': { emoji: '☁️', label: 'OpenShift' },
    'RHOAI': { emoji: '🔴', label: 'RHOAI' },
    'Smarty': { emoji: '💡', label: 'Smarty' }
  };
  
  // Add category icons
  kickstart.categories?.forEach(category => {
    if (categoryIcons[category]) {
      iconData.push(categoryIcons[category]);
    }
  });
  
  // Content-based icons (analyze title and description)
  const content = `${kickstart.title} ${kickstart.description}`.toLowerCase();
  
  if (content.includes('recommend') || content.includes('suggest')) {
    iconData.push({ emoji: '🎯', label: 'Recommendation' });
  }
  if (content.includes('chat') || content.includes('conversation')) {
    iconData.push({ emoji: '💬', label: 'Chat' });
  }
  if (content.includes('model') || content.includes('llm')) {
    iconData.push({ emoji: '🧠', label: 'LLM' });
  }
  if (content.includes('data') || content.includes('dataset')) {
    iconData.push({ emoji: '📊', label: 'Data' });
  }
  if (content.includes('security') || content.includes('secure')) {
    iconData.push({ emoji: '🔐', label: 'Security' });
  }
  if (content.includes('observability') || content.includes('monitoring')) {
    iconData.push({ emoji: '👁️', label: 'Observability' });
  }
  if (content.includes('tool') || content.includes('utility')) {
    iconData.push({ emoji: '🔧', label: 'Tool' });
  }
  if (content.includes('deploy') || content.includes('docker') || content.includes('container')) {
    iconData.push({ emoji: '📦', label: 'Container' });
  }
  if (content.includes('api') || content.includes('service')) {
    iconData.push({ emoji: '🌐', label: 'API' });
  }
  if (content.includes('virtual agent') || content.includes('agent')) {
    iconData.push({ emoji: '🤵', label: 'Agent' });
  }
  if (content.includes('architecture') || content.includes('chart')) {
    iconData.push({ emoji: '🏗️', label: 'Architecture' });
  }
  
  // Remove duplicates and limit to 6 icons max (for 2 rows of 3)
  const uniqueIcons = iconData.filter((item, index, self) => 
    index === self.findIndex(t => t.emoji === item.emoji)
  ).slice(0, 6);
  
  return uniqueIcons.length > 0 ? uniqueIcons : [{ emoji: '🚀', label: 'AI Quickstart' }];
};

const KickstartCard = ({ kickstart }) => {
  // Create URL-friendly name from title
  const detailsName = kickstart.title.toLowerCase();
  const navigate = useNavigate();
  
  const handleDetailsClick = () => {
    // Scroll to top when navigating to details
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  };
  
  const handleCardClick = (e) => {
    // Don't navigate if clicking on the GitHub button or other interactive elements
    if (e.target.closest('a') && e.target.closest('a').href.includes('github.com')) {
      return;
    }
    handleDetailsClick();
    // Navigate to details page using React Router
    navigate(`/details/${detailsName}`);
  };
  
  return (
    <div 
      className="pf-v5-c-card pf-m-hoverable" 
      onClick={handleCardClick}
      style={{ cursor: 'pointer' }}
    >
      <div className="pf-v5-c-card__title">
        <h3>
          <Link
            to={`/details/${detailsName}`}
            onClick={handleDetailsClick}
            style={{
              color: 'var(--pf-global--link--Color)',
              textDecoration: 'none',
              fontSize: '1.25rem',
              fontWeight: '600',
              transition: 'color 0.2s ease-in-out, text-decoration 0.2s ease-in-out'
            }}
            className="kickstart-title-link"
          >
            {kickstart.title}
          </Link>
        </h3>
      </div>
      <div className="pf-v5-c-card__body">
        {/* Generated Image - Below title, aligned left */}
        {kickstart.id && (
          <div className="kickstart-generated-image" style={{ 
            marginBottom: 'var(--pf-global--spacer--md)',
            display: 'flex',
            justifyContent: 'flex-start'
          }}>
            <img 
              src={`${BASE_PATH}/images/quickstarts/${kickstart.id}.svg`}
              alt={`AI generated illustration for ${kickstart.title}`}
              style={{
                width: '288px',
                height: '162px', // 16:9 aspect ratio (20% larger: 240px * 1.2 = 288px)
                objectFit: 'cover',
                borderRadius: 'var(--pf-global--BorderRadius--sm)',
                boxShadow: 'var(--pf-global--BoxShadow--md)',
                border: '1px solid var(--pf-global--BorderColor--light-200)'
              }}
              onError={(e) => {
                // Hide image if it fails to load
                e.target.style.display = 'none';
              }}
            />
          </div>
        )}
        
        {/* Description below image */}
        <div className="kickstart-description">
          <p style={{ marginBottom: 'var(--pf-global--spacer--md)' }}>
            {kickstart.description}
          </p>
        </div>

        {/* Tech stack icons section */}
        <div className="kickstart-icons">
          <h4 style={{
            fontSize: 'var(--pf-global--FontSize--sm)',
            color: 'var(--pf-global--Color--200)',
            marginBottom: 'var(--pf-global--spacer--xs)'
          }}>
            Technologies
          </h4>
          <div className="tech-icons" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 'var(--pf-global--spacer--xs)',
            alignItems: 'center',
            fontSize: 'var(--pf-global--FontSize--sm)',
            marginBottom: 'var(--pf-global--spacer--md)',
            maxWidth: '320px'
          }}>
            {getKickstartIcons(kickstart).length > 0 ? (
              getKickstartIcons(kickstart).map((iconData, index) => (
                <div 
                  key={index} 
                  style={{
                    padding: 'var(--pf-global--spacer--xs)',
                    backgroundColor: 'var(--pf-global--BackgroundColor--light-300)',
                    borderRadius: 'var(--pf-global--BorderRadius--sm)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: 'var(--pf-global--FontSize--sm)',
                    boxShadow: 'var(--pf-global--BoxShadow--sm)',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <span style={{ fontSize: '1.2em' }}>{iconData.emoji}</span>
                  <span style={{ 
                    fontStyle: 'italic', 
                    color: 'var(--pf-global--Color--200)',
                    fontSize: '0.9em'
                  }}>
                    {iconData.label}
                  </span>
                </div>
              ))
            ) : (
              <span style={{
                fontSize: 'var(--pf-global--FontSize--sm)',
                color: 'var(--pf-global--Color--400)',
                fontStyle: 'italic'
              }}>
                🚀 AI Kickstart
              </span>
            )}
          </div>
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
      <div className="pf-v5-c-card__footer" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: 'var(--pf-global--spacer--md)',
        backgroundColor: '#f5f5f5',
        padding: 'var(--pf-global--spacer--md)',
        borderTop: '1px solid var(--pf-global--BorderColor--light-200)',
        marginTop: 'var(--pf-global--spacer--md)'
      }}>
        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: 'var(--pf-global--spacer--xs)',
          alignItems: 'center',
          flex: '1',
          minWidth: '0'
        }}>
          {kickstart.categories.map((category, index) => (
            <span
              key={`cat-${index}`}
              className="pf-v5-c-label pf-m-outline"
              style={{
                color: '#c9190b !important',
                borderColor: '#c9190b !important',
                border: '1px solid #c9190b',
                backgroundColor: 'transparent !important'
              }}
            >
              {category}
            </span>
          ))}
          {kickstart.topics && kickstart.topics
            .filter(topic => topic && topic.trim()) // Filter out any falsy or empty topics
            .map((topic, index) => (
            <span
              key={`${kickstart.title}-topic-${topic}-${index}`}
              className="pf-v5-c-label pf-m-outline"
              style={{
                color: '#c9190b !important',
                borderColor: '#c9190b !important',
                border: '1px solid #c9190b',
                backgroundColor: 'transparent !important'
              }}
            >
              {topic}
            </span>
          ))}
        </div>
        <a
          href={kickstart.githubLink.replace('#readme', '')}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()} // Prevent card click when clicking GitHub link
          className="pf-v5-c-button pf-m-outline kickstart-github-button"
          role="button"
          style={{
            fontSize: 'var(--pf-global--FontSize--sm)',
            fontWeight: '400',
            padding: '4px var(--pf-global--spacer--sm)',
            height: '24px',
            minHeight: '24px',
            minWidth: '110px',
            borderRadius: '6px',
            color: '#151515',
            backgroundColor: 'transparent',
            border: '1px solid #d2d2d2',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'border-color 0.2s ease-in-out',
            lineHeight: '1',
            flexShrink: 0,
            whiteSpace: 'nowrap'
          }}
        >
          View on GitHub
        </a>
      </div>
    </div>
  );
};

export default KickstartCard;