import React, { useContext } from 'react';
import { ArrowRight, Sparkles, Terminal, Share2 } from 'lucide-react';
import { AppContext } from '../context/AppContext';

const Home = () => {
  const { siteData, isLoading } = useContext(AppContext);

  if (isLoading) return <div className="container flex-center" style={{ minHeight: '80vh' }}><h3>데이터 로딩 중...</h3></div>;

  return (
    <div className="container">
      {/* Hero Section */}
      <section className="hero fade-in" style={{ textAlign: 'center', marginBottom: '5rem', paddingTop: '2rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(157, 78, 221, 0.2)', padding: '0.5rem 1rem', borderRadius: '20px', marginBottom: '1.5rem' }}>
          <Sparkles size={16} color="#c77dff" />
          <span style={{ fontSize: '0.9rem', color: '#e0c3fc', fontWeight: '600' }}>최신 게임 소식</span>
        </div>
        <h1 style={{ fontSize: '4rem', marginBottom: '1.5rem', lineHeight: '1.1' }}>
          {siteData.heroTitle.split(',').map((text, i) => (
            <React.Fragment key={i}>
              {i === 1 ? <span className="title-display">{text}</span> : text}
              {i === 0 && <br/>}
            </React.Fragment>
          ))}
        </h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 2.5rem auto' }}>
          {siteData.heroSubtitle}
        </p>
      </section>

      {/* News Feed Section */}
      <section style={{ marginBottom: '5rem' }}>
        <h3 style={{ fontSize: '2rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Terminal size={24} color="#9d4edd" />
          개발자 노트
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          {(siteData.newsFeeds || []).map((feed) => (
            <div key={feed.id} className="glass-panel" style={{ overflow: 'hidden', transition: 'transform 0.3s ease', cursor: 'pointer' }}
                 onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-10px)'}
                 onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
              
              {feed.imageUrl ? (
                <div style={{ height: '100px', backgroundImage: `url(${feed.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
              ) : (
                <div style={{ height: '100px', background: `linear-gradient(45deg, #2a0845, #6441A5)` }}></div>
              )}                
              
              <div style={{ padding: '1.2rem 1.5rem' }}>
                <span style={{ fontSize: '0.8rem', color: '#c77dff', fontWeight: 'bold' }}>{feed.date}</span>
                <h4 style={{ fontSize: '1.3rem', margin: '0.5rem 0' }}>{feed.title}</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>{feed.content}</p>
                {/* 더 읽어보기 삭제 */}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer Section */}
      <footer className="glass-panel" style={{ padding: '3rem', marginTop: '5rem', marginBottom: '3rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '2rem' }}>
          <div style={{ flex: '1', minWidth: '300px' }}>
            <h4 className="title-display" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>ShortsGame</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>{siteData.companyInfo}</p>
          </div>
          
          <div style={{ flex: '1', minWidth: '300px' }}>
            <h5 style={{ marginBottom: '1.2rem', color: '#c77dff', fontSize: '1.1rem' }}>Connect with Us</h5>
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              {(siteData.snsLinks || []).map(sns => (
                <a key={sns.id} href={sns.url} target="_blank" rel="noopener noreferrer" 
                   style={{ color: '#fff', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.95rem', transition: 'all 0.3s' }}
                   className="sns-link-hover">
                  {sns.iconUrl ? (
                    <img src={sns.iconUrl} style={{ width: '24px', height: '24px', borderRadius: '6px', objectFit: 'cover' }} alt="" />
                  ) : (
                    <Share2 size={20} color="#c77dff" />
                  )}
                  <span>{sns.name}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
        <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.05)', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          © 2026 ShortsGame. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Home;
