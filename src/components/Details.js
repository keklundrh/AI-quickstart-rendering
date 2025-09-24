import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { BASE_PATH } from '../api/kickstarts';

const Details = ({ kickstarts }) => {
  const { name } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  // Find the kickstart by name (case-insensitive matching)
  const kickstart = kickstarts?.find(k => {
    const titleLower = k.title.toLowerCase();
    const nameLower = name.toLowerCase();
    return titleLower === nameLower || 
           titleLower.replace(/\s+/g, '-') === nameLower ||
           titleLower.replace(/\s+/g, '') === nameLower;
  });

  useEffect(() => {
    // Set loading to false once we've determined if we found the kickstart
    setIsLoading(false);
  }, [kickstart]);

  // Scroll to top when component mounts or route changes
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, [name]);

  if (isLoading) {
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
        
        {/* Header with back button */}
        <header className="pf-v5-c-masthead">
          <div className="pf-v5-c-masthead__main">
            <div className="pf-v5-c-masthead__brand">
              <Link className="pf-v5-c-brand" to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
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
              </Link>
            </div>
          </div>
          <div className="pf-v5-c-masthead__content">
            <button 
              className="pf-v5-c-button pf-m-outline"
              onClick={() => navigate('/')}
              style={{
                color: 'white',
                backgroundColor: 'black',
                borderColor: 'white',
                boxShadow: 'none'
              }}
            >
              ← Back to Quickstarts
            </button>
          </div>
        </header>

        <main className="pf-v5-c-page__main" style={{ padding: 'var(--pf-global--spacer--xl)' }}>
          <div className="pf-v5-c-empty-state" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div className="pf-v5-c-empty-state__icon">
              <div className="pf-v5-c-spinner"></div>
            </div>
            <h2 className="pf-v5-c-title">Loading...</h2>
            <div className="pf-v5-c-empty-state__body">
              <p>Preparing quickstart details</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!kickstart || !kickstart.readmeContent) {
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
        
        {/* Header with back button */}
        <header className="pf-v5-c-masthead">
          <div className="pf-v5-c-masthead__main">
            <div className="pf-v5-c-masthead__brand">
              <Link className="pf-v5-c-brand" to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
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
              </Link>
            </div>
          </div>
          <div className="pf-v5-c-masthead__content">
            <button 
              className="pf-v5-c-button pf-m-outline"
              onClick={() => navigate('/')}
              style={{
                color: 'white',
                backgroundColor: 'black',
                borderColor: 'white',
                boxShadow: 'none'
              }}
            >
              ← Back to Quickstarts
            </button>
          </div>
        </header>

        <main className="pf-v5-c-page__main" style={{ padding: 'var(--pf-global--spacer--xl)' }}>
          <div className="pf-v5-c-empty-state" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div className="pf-v5-c-empty-state__icon" style={{ fontSize: '3rem' }}>
              ❌
            </div>
            <h2 className="pf-v5-c-title">Quickstart Not Found</h2>
            <div className="pf-v5-c-empty-state__body">
              <p>The requested quickstart "{name}" could not be found or does not have README content available.</p>
              <button 
                className="pf-v5-c-button pf-m-primary"
                onClick={() => navigate('/')}
                style={{ marginTop: 'var(--pf-global--spacer--md)' }}
              >
                Return to Quickstarts
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

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
      
      {/* Header with back button */}
      <header className="pf-v5-c-masthead">
        <div className="pf-v5-c-masthead__main">
          <div className="pf-v5-c-masthead__brand">
            <Link className="pf-v5-c-brand" to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
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
            </Link>
          </div>
        </div>
        <div className="pf-v5-c-masthead__content">
          <div style={{ display: 'flex', gap: 'var(--pf-global--spacer--sm)', alignItems: 'center' }}>
            <a
              href={kickstart.githubLink}
              target="_blank"
              rel="noopener noreferrer"
              className="pf-v5-c-button pf-m-outline"
              style={{
                color: 'white',
                backgroundColor: 'black',
                borderColor: 'white',
                boxShadow: 'none'
              }}
            >
              View on GitHub
            </a>
            <button 
              className="pf-v5-c-button pf-m-outline"
              onClick={() => navigate('/')}
              style={{
                color: 'white',
                backgroundColor: 'black',
                borderColor: 'white',
                boxShadow: 'none'
              }}
            >
              ← Back to Quickstarts
            </button>
          </div>
        </div>
      </header>

      <main className="pf-v5-c-page__main" style={{ 
        padding: 'var(--pf-global--spacer--xl)',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Quickstart header */}
        <div style={{ 
          marginBottom: 'var(--pf-global--spacer--xl)',
          borderBottom: '1px solid var(--pf-global--BorderColor--100)',
          paddingBottom: 'var(--pf-global--spacer--lg)'
        }}>
          {/* Content layout: title and content on left, image on right */}
          <div style={{ 
            display: 'flex',
            gap: 'var(--pf-global--spacer--xl)',
            alignItems: 'flex-start',
            flexWrap: 'wrap'
          }}>
            {/* Left side: Title, description, tags, and metadata */}
            <div style={{ 
              flex: '1',
              minWidth: '300px',
              display: 'flex',
              flexDirection: 'column',
              height: kickstart.generatedImage ? '225px' : 'auto', // Match image height when image exists
              justifyContent: 'space-between'
            }}>
              {/* Top section: Title, updated date, and description */}
              <div>
                <h1 className="pf-v5-c-title" style={{ 
                  fontSize: '2rem',
                  marginBottom: 'var(--pf-global--spacer--xs)',
                  marginTop: 0
                }}>
                  {kickstart.title}
                </h1>
                
                <div style={{
                  fontSize: 'var(--pf-global--FontSize--sm)',
                  color: 'var(--pf-global--Color--200)',
                  marginBottom: 'var(--pf-global--spacer--md)'
                }}>
                  Updated: {kickstart.lastUpdated}
                </div>
                
                <p style={{ 
                  fontSize: 'var(--pf-global--FontSize--lg)',
                  color: 'var(--pf-global--Color--200)',
                  marginBottom: 'var(--pf-global--spacer--md)',
                  lineHeight: '1.5'
                }}>
                  {kickstart.description}
                </p>
              </div>
              
              {/* Bottom section: Tags and stars */}
              <div style={{ 
                display: 'flex', 
                gap: 'var(--pf-global--spacer--sm)', 
                alignItems: 'center',
                flexWrap: 'wrap'
              }}>
                {/* Tags */}
                {kickstart.categories?.map((category, index) => (
                  <span
                    key={index}
                    className="pf-v5-c-label pf-m-outline"
                    style={{
                      color: '#EE0000 !important',
                      borderColor: '#EE0000 !important',
                      border: '1px solid #EE0000',
                      backgroundColor: 'transparent !important'
                    }}
                  >
                    {category}
                  </span>
                ))}
                {kickstart.topics && kickstart.topics
                  .filter(topic => topic && topic.trim())
                  .slice(0, 2) // Limit to first 2 topics to fit on one line
                  .map((topic, index) => (
                  <span
                    key={`topic-${index}`}
                    className="pf-v5-c-label pf-m-outline"
                    style={{
                      color: '#EE0000 !important',
                      borderColor: '#EE0000 !important',
                      border: '1px solid #EE0000',
                      backgroundColor: 'transparent !important'
                    }}
                  >
                    {topic}
                  </span>
                ))}
                
                {/* Stars */}
                {kickstart.stars > 0 && (
                  <span style={{ 
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: 'var(--pf-global--FontSize--sm)',
                    color: 'var(--pf-global--Color--200)'
                  }}>
                    ⭐ {kickstart.stars} stars
                  </span>
                )}
              </div>
            </div>
            
            {/* Right side: Generated Image */}
            {kickstart.id && (
              <div className="kickstart-details-image" style={{ 
                flexShrink: 0
              }}>
                <img 
                  src={`${BASE_PATH}/images/quickstarts/${kickstart.id}.svg`}
                  alt={`AI generated illustration for ${kickstart.title}`}
                  style={{
                    width: '400px',
                    height: '225px', // 16:9 aspect ratio
                    objectFit: 'cover',
                    borderRadius: 'var(--pf-global--BorderRadius--lg)',
                    boxShadow: 'var(--pf-global--BoxShadow--lg)',
                    border: '1px solid var(--pf-global--BorderColor--light-200)'
                  }}
                  onError={(e) => {
                    // Hide image if it fails to load
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* README content */}
        <div className="markdown-preview" style={{ 
          backgroundColor: 'white',
          padding: 'var(--pf-global--spacer--xl)',
          borderRadius: 'var(--pf-global--BorderRadius--lg)',
          boxShadow: 'var(--pf-global--BoxShadow--sm)'
        }}>
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            components={{
              // Handle images - they should already be pointing to local cached versions
              img: ({ src, alt, ...props }) => (
                <img 
                  src={src?.startsWith('http') ? src : `${process.env.PUBLIC_URL || ''}/${src}`} 
                  alt={alt} 
                  {...props} 
                  style={{ 
                    maxWidth: '100%', 
                    height: 'auto',
                    borderRadius: '4px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                  }} 
                />
              ),
              // Handle links - open external links in new tab
              a: ({ href, children, ...props }) => {
                if (href?.startsWith('http')) {
                  return <a href={href} target="_blank" rel="noopener noreferrer" {...props}>{children}</a>;
                }
                return <a href={href} {...props}>{children}</a>;
              },
              // Style code blocks
              pre: ({ children, ...props }) => (
                <pre 
                  {...props} 
                  style={{ 
                    backgroundColor: '#f8f9fa',
                    padding: 'var(--pf-global--spacer--md)',
                    borderRadius: '4px',
                    overflow: 'auto',
                    border: '1px solid var(--pf-global--BorderColor--100)'
                  }}
                >
                  {children}
                </pre>
              ),
              // Style inline code
              code: ({ children, ...props }) => (
                <code 
                  {...props}
                  style={{
                    backgroundColor: '#f8f9fa',
                    padding: '2px 4px',
                    borderRadius: '3px',
                    fontSize: '0.9em'
                  }}
                >
                  {children}
                </code>
              ),
              // Style tables
              table: ({ children, ...props }) => (
                <div style={{ overflowX: 'auto', marginBottom: 'var(--pf-global--spacer--md)' }}>
                  <table 
                    {...props}
                    style={{
                      width: '100%',
                      borderCollapse: 'collapse',
                      border: '1px solid var(--pf-global--BorderColor--100)'
                    }}
                  >
                    {children}
                  </table>
                </div>
              ),
              th: ({ children, ...props }) => (
                <th 
                  {...props}
                  style={{
                    padding: 'var(--pf-global--spacer--sm)',
                    backgroundColor: 'var(--pf-global--BackgroundColor--200)',
                    border: '1px solid var(--pf-global--BorderColor--100)',
                    textAlign: 'left',
                    fontWeight: 'var(--pf-global--FontWeight--bold)'
                  }}
                >
                  {children}
                </th>
              ),
              td: ({ children, ...props }) => (
                <td 
                  {...props}
                  style={{
                    padding: 'var(--pf-global--spacer--sm)',
                    border: '1px solid var(--pf-global--BorderColor--100)'
                  }}
                >
                  {children}
                </td>
              )
            }}
          >
            {kickstart.readmeContent}
          </ReactMarkdown>
        </div>
      </main>
    </div>
  );
};

export default Details;
