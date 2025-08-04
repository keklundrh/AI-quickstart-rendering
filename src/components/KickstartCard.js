import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

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
        <div className="markdown-preview">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              // Ensure headings have content and are accessible
              h1: ({node, children, ...props}) => <h3 {...props}>{children || 'Heading 1'}</h3>,
              h2: ({node, children, ...props}) => <h4 {...props}>{children || 'Heading 2'}</h4>,
              h3: ({node, children, ...props}) => <h5 {...props}>{children || 'Heading 3'}</h5>,
              // Disable images in preview
              img: () => null,
              // Ensure anchors have content and are accessible
              a: ({node, children, ...props}) => (
                <a {...props} target="_blank" rel="noopener noreferrer">
                  {children || props.href || 'Link'}
                </a>
              ),
            }}
          >
            {kickstart.readmePreview}
          </ReactMarkdown>
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
    <div className="pf-v5-c-card__footer">
      {kickstart.categories.map((category, index) => (
        <span
          key={`cat-${index}`}
          className="pf-v5-c-label pf-m-outline pf-m-blue"
        >
          {category}
        </span>
      ))}
      {kickstart.topics && kickstart.topics.map((topic, index) => (
        <span
          key={`topic-${index}`}
          className="pf-v5-c-label pf-m-outline pf-m-green"
        >
          {topic}
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

export default KickstartCard;