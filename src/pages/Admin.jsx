import React, { useState } from 'react';
import { Lock, Plus, Settings, Users, LogOut } from 'lucide-react';

const Admin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Login UI 데모
  if (!isLoggedIn) {
    return (
      <div className="container flex-center" style={{ minHeight: '80vh' }}>
        <div className="glass-panel fade-in" style={{ width: '100%', maxWidth: '400px', padding: '3rem 2rem', textAlign: 'center' }}>
          <div style={{ width: '60px', height: '60px', background: 'rgba(157, 78, 221, 0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
            <Lock size={30} color="#c77dff" />
          </div>
          <h2 style={{ marginBottom: '0.5rem' }}>관리자 접속</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.95rem' }}>게임을 관리하려면 로그인하세요.</p>
          
          <form onSubmit={(e) => { e.preventDefault(); setIsLoggedIn(true); }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input 
              type="text" 
              placeholder="Admin ID" 
              style={{ padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.3)', color: '#fff', outline: 'none' }}
              required 
            />
            <input 
              type="password" 
              placeholder="Password" 
              style={{ padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.3)', color: '#fff', outline: 'none' }}
              required 
            />
            <button type="submit" className="btn" style={{ marginTop: '1rem' }}>로그인 (데모클릭)</button>
          </form>
        </div>
      </div>
    );
  }

  // Dashboard UI 데모
  return (
    <div className="container fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <h2><span className="title-display" style={{ fontSize: '1.5rem', marginRight: '10px' }}>ShortsGame</span> 대시보드</h2>
        <button onClick={() => setIsLoggedIn(false)} className="btn" style={{ background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <LogOut size={16} /> 로그아웃
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '2rem' }}>
        {/* Sidebar */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <li style={{ padding: '1rem', background: 'var(--accent-glow)', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Plus size={18} /> 새 게임 등록
            </li>
            <li style={{ padding: '1rem', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)' }}>
              <Users size={18} /> 사전예약자 관리
            </li>
            <li style={{ padding: '1rem', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)' }}>
              <Settings size={18} /> 시스템 설정
            </li>
          </ul>
        </div>

        {/* Contents Area */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus color="#c77dff" /> 게임 컨텐츠 추가
          </h3>
          
          <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>게임 타이틀</label>
              <input type="text" placeholder="예: Dopamine Smith" style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.3)', color: '#fff', outline: 'none' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>장르 및 테마</label>
              <input type="text" placeholder="예: 방치형 RPG" style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.3)', color: '#fff', outline: 'none' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>출시 예정일</label>
              <input type="date" style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.3)', color: '#fff', outline: 'none' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>게임 설명</label>
              <textarea rows="5" placeholder="게임에 대한 상세 설명을 입력하세요" style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.3)', color: '#fff', outline: 'none', resize: 'vertical' }}></textarea>
            </div>
            
            <button type="button" className="btn" style={{ alignSelf: 'flex-start', padding: '1rem 3rem' }}>
              등록하기 (데모)
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Admin;
