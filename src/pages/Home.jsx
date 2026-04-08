import React from 'react';
import { ArrowRight, Sparkles, Terminal } from 'lucide-react';

const Home = () => {
  return (
    <div className="container">
      {/* Hero Section */}
      <section className="hero fade-in" style={{ textAlign: 'center', marginBottom: '5rem', paddingTop: '2rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(157, 78, 221, 0.2)', padding: '0.5rem 1rem', borderRadius: '20px', marginBottom: '1.5rem' }}>
          <Sparkles size={16} color="#c77dff" />
          <span style={{ fontSize: '0.9rem', color: '#e0c3fc', fontWeight: '600' }}>최신 게임 소식</span>
        </div>
        <h1 style={{ fontSize: '4rem', marginBottom: '1.5rem', lineHeight: '1.1' }}>
          차원이 다른 도파민 퍼즐,<br/>
          <span className="title-display">Dopamine Smith</span>
        </h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 2.5rem auto' }}>
          ShortsGame이 선보이는 첫 번째 마스터피스. 대장장이 키우기와 퍼즐의 완벽한 조화. 지금 바로 사전예약하고 특별한 보상을 받아보세요.
        </p>
        <button className="btn" style={{ fontSize: '1.2rem', padding: '1rem 2.5rem', borderRadius: '30px' }}>
          사전예약 하기 <ArrowRight size={20} style={{ display: 'inline', verticalAlign: 'middle', marginLeft: '8px' }} />
        </button>
      </section>

      {/* News Feed Section */}
      <section>
        <h3 style={{ fontSize: '2rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Terminal size={24} color="#9d4edd" />
          개발자 노트
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          {/* Card 1 */}
          <div className="glass-panel" style={{ padding: '2rem', transition: 'transform 0.3s ease', cursor: 'pointer' }}
               onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-10px)'}
               onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{ height: '200px', background: 'linear-gradient(45deg, #2a0845, #6441A5)', borderRadius: '12px', marginBottom: '1.5rem' }}></div>
            <span style={{ fontSize: '0.85rem', color: '#c77dff', fontWeight: 'bold' }}>2026. 04. 08</span>
            <h4 style={{ fontSize: '1.5rem', margin: '0.5rem 0' }}>도파민 스미스, 전투 시스템 개편!</h4>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>타격감을 극대화하기 위해 코어 엔진을 재설계했습니다. 짜릿한 손맛을 위해 어떤 변화가 있었을까요?</p>
            <div style={{ marginTop: '1.5rem', color: '#fff', fontSize: '0.9rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '5px' }}>
              더 읽어보기 <ArrowRight size={16} />
            </div>
          </div>

          {/* Card 2 */}
          <div className="glass-panel" style={{ padding: '2rem', transition: 'transform 0.3s ease', cursor: 'pointer' }}
               onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-10px)'}
               onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{ height: '200px', background: 'linear-gradient(45deg, #0f2027, #203a43, #2c5364)', borderRadius: '12px', marginBottom: '1.5rem' }}></div>
            <span style={{ fontSize: '0.85rem', color: '#c77dff', fontWeight: 'bold' }}>2026. 03. 25</span>
            <h4 style={{ fontSize: '1.5rem', margin: '0.5rem 0' }}>새로운 무기 디자인 공개</h4>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>에픽 등급의 새로운 무기들의 실루엣을 전격 공개합니다! 디자인 팀의 땀방울이 녹아든 무기들을 확인하세요.</p>
            <div style={{ marginTop: '1.5rem', color: '#fff', fontSize: '0.9rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '5px' }}>
              더 읽어보기 <ArrowRight size={16} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
