import React, { useContext } from 'react';
import { Sparkles, Terminal } from 'lucide-react';
import { AppContext } from '../context/AppContext';

const Home = () => {
  const { siteData } = useContext(AppContext);

  return (
    <>
      <div className="container" style={{ minHeight: '80vh' }}>
        <section className="hero fade-in" style={{ textAlign: 'center', marginBottom: '5rem', paddingTop: '2rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(157, 78, 221, 0.2)', padding: '0.5rem 1rem', borderRadius: '20px', marginBottom: '1.5rem' }}>
            <Sparkles size={16} color="#c77dff" />
            <span style={{ fontSize: '0.9rem', color: '#e0c3fc', fontWeight: '600' }}>최신 게임 소식</span>
          </div>
          
          <h1 style={{ fontSize: '3.5rem', marginBottom: '1.5rem', lineHeight: '1.2' }} dangerouslySetInnerHTML={{ __html: siteData.heroTitle }}></h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 2.5rem auto' }}>
            {siteData.heroSubtitle}
          </p>
        </section>

        {/* 텍스트 위주로 개편된 개발자 노트 영역 */}
        <section>
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
                  <div style={{ height: '100px', background: `linear-gradient(45deg, #${Math.floor(Math.random()*16777215).toString(16)}, #6441A5)` }}></div>
                )}                
                <div style={{ padding: '1.5rem 2rem' }}>
                  <span style={{ fontSize: '0.85rem', color: '#c77dff', fontWeight: 'bold' }}>{feed.date}</span>
                  <h4 style={{ fontSize: '1.5rem', margin: '0.5rem 0' }}>{feed.title}</h4>
                  <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>{feed.content}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <footer style={{ background: 'rgba(0,0,0,0.5)', padding: '3rem 5%', borderTop: '1px solid var(--border-color)', marginTop: '4rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '2rem' }}>
          <div>
            <span className="title-display" style={{ fontSize: '1.5rem', display: 'block', marginBottom: '1rem' }}>ShortsGame</span>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{siteData.companyInfo}</p>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            {siteData.snsLinks.youtube && (
              <a href={siteData.snsLinks.youtube} target="_blank" rel="noreferrer" style={{ color: '#fff', opacity: 0.7, padding: '10px', textDecoration: 'none' }}>▶️ YouTube</a>
            )}
            {siteData.snsLinks.twitter && (
              <a href={siteData.snsLinks.twitter} target="_blank" rel="noreferrer" style={{ color: '#fff', opacity: 0.7, padding: '10px', textDecoration: 'none' }}>🐦 Twitter</a>
            )}
          </div>
        </div>
      </footer>
    </>
  );
};

export default Home;
