import React, { useState, useContext } from 'react';
import { Lock, Settings, LogOut, Save, Plus, Users, Trash2 } from 'lucide-react';
import { AppContext } from '../context/AppContext';

const Admin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [roleInfo, setRoleInfo] = useState(''); // 본인 접속 등급 메모용
  const { siteData, updateData } = useContext(AppContext);
  
  // 로그인 입력 상태
  const [loginForm, setLoginForm] = useState({ id: '', password: '' });

  // 정보수정 폼 상태
  const [formData, setFormData] = useState({
    heroTitle: siteData.heroTitle,
    heroSubtitle: siteData.heroSubtitle,
    youtube: siteData.snsLinks.youtube,
    twitter: siteData.snsLinks.twitter,
    companyInfo: siteData.companyInfo
  });

  const [newFeed, setNewFeed] = useState({ date: '', title: '', content: '', imageUrl: '' });
  const [newAdmin, setNewAdmin] = useState({ role: '', username: '', password: '' });

  const handleLogin = (e) => {
    e.preventDefault();
    const { id, password } = loginForm;
    
    // 1. 최고 관리자 전용 하드코딩 계정
    if (id === 'video' && password === 'Cksnrl!004') {
      setIsLoggedIn(true);
      setRoleInfo('최고 관리자');
      return;
    }

    // 2. 서브 관리자 계정 체크 (등록된 데이터 기반 매칭)
    const subAdminMatched = siteData.subAdmins.find(admin => admin.username === id && admin.password === password);
    if (subAdminMatched) {
      setIsLoggedIn(true);
      setRoleInfo(`서브 관리자 (${subAdminMatched.role})`);
      return;
    }
    
    alert("아이디 또는 비밀번호가 틀렸습니다.");
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSaveGeneral = (e) => {
    e.preventDefault();
    updateData({
      heroTitle: formData.heroTitle,
      heroSubtitle: formData.heroSubtitle,
      companyInfo: formData.companyInfo,
      snsLinks: { youtube: formData.youtube, twitter: formData.twitter }
    });
    alert("기본 정보가 저장되었습니다.");
  };

  const handleAddFeed = (e) => {
    e.preventDefault();
    if (!newFeed.title || !newFeed.content) return;
    const feedObj = { ...newFeed, id: Date.now() };
    updateData({ newsFeeds: [feedObj, ...(siteData.newsFeeds || [])] });
    setNewFeed({ date: '', title: '', content: '', imageUrl: '' });
    alert("새로운 피드가 등록/배포되었습니다!");
  };

  const handleDeleteFeed = (id) => {
    updateData({ newsFeeds: (siteData.newsFeeds || []).filter(f => f.id !== id) });
  };

  const handleAddAdmin = (e) => {
    e.preventDefault();
    if (!newAdmin.role || !newAdmin.username || !newAdmin.password) return;
    const adminObj = { ...newAdmin, id: Date.now() };
    updateData({ subAdmins: [...(siteData.subAdmins || []), adminObj] });
    setNewAdmin({ role: '', username: '', password: '' });
    alert("서브 관리자 계정이 신규 생성되었습니다.");
  };

  const handleDeleteAdmin = (id) => {
    updateData({ subAdmins: (siteData.subAdmins || []).filter(a => a.id !== id) });
  };

  if (!isLoggedIn) {
    return (
      <div className="container flex-center" style={{ minHeight: '80vh' }}>
        <div className="glass-panel fade-in" style={{ width: '100%', maxWidth: '400px', padding: '3rem 2rem', textAlign: 'center' }}>
          <div style={{ width: '60px', height: '60px', background: 'rgba(157, 78, 221, 0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
            <Lock size={30} color="#c77dff" />
          </div>
          <h2 style={{ marginBottom: '0.5rem' }}>사이트 관리자 로그인</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.95rem' }}>메인 관리자 또는 발급받은 계정으로 접속</p>
          
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input type="text" placeholder="아이디" value={loginForm.id} onChange={e => setLoginForm({...loginForm, id: e.target.value})} style={{ padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.3)', color: '#fff' }} required />
            <input type="password" placeholder="비밀번호" value={loginForm.password} onChange={e => setLoginForm({...loginForm, password: e.target.value})} style={{ padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.3)', color: '#fff' }} required />
            <button type="submit" className="btn" style={{ marginTop: '0.5rem' }}>접속하기</button>
          </form>
          <div style={{ marginTop: '1.5rem', fontSize: '0.8rem', color: '#666' }}>
            서브 테스트 계정: manager01 / 123
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div>
          <h2><span className="title-display" style={{ fontSize: '1.5rem', marginRight: '10px' }}>ShortsGame</span> 사이트 관리</h2>
          <span style={{ fontSize: '0.9rem', color: '#c77dff', fontWeight: 'bold' }}>현재 접속 권한: {roleInfo}</span>
        </div>
        <button onClick={() => setIsLoggedIn(false)} className="btn" style={{ background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <LogOut size={16} /> 로그아웃
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '2rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem', height: 'fit-content' }}>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <li onClick={() => setActiveTab('general')} style={{ padding: '1rem', background: activeTab === 'general' ? 'var(--accent-glow)' : 'transparent', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}><Settings size={18} /> 기본 정보 관리</li>
            <li onClick={() => setActiveTab('feeds')} style={{ padding: '1rem', background: activeTab === 'feeds' ? 'var(--accent-glow)' : 'transparent', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}><Plus size={18} /> 피드(뉴스) 관리</li>
            <li onClick={() => setActiveTab('admins')} style={{ padding: '1rem', background: activeTab === 'admins' ? 'var(--accent-glow)' : 'transparent', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}><Users size={18} /> 서브 관리자 구역</li>
          </ul>
        </div>

        <div className="glass-panel" style={{ padding: '2rem' }}>
          {/* 하위 탭 렌더링 코드는 이전과 거의 동일 묶음 최적화 */}
          {activeTab === 'general' && (
            <form onSubmit={handleSaveGeneral} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="fade-in">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Settings color="#c77dff" /> 메인 문구 및 푸터 수정</h3>
              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '8px' }}>
                <textarea name="heroTitle" value={formData.heroTitle} onChange={handleChange} rows="2" style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.3)', color: '#fff', marginBottom: '1rem' }} />
                <textarea name="heroSubtitle" value={formData.heroSubtitle} onChange={handleChange} rows="3" style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.3)', color: '#fff' }} />
              </div>
              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '8px' }}>
                <input type="text" name="companyInfo" value={formData.companyInfo} onChange={handleChange} placeholder="Footer Company Info" style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.3)', color: '#fff', marginBottom: '1rem' }} />
                <input type="text" name="youtube" value={formData.youtube} onChange={handleChange} placeholder="Youtube Link" style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.3)', color: '#fff', marginBottom: '1rem' }} />
                <input type="text" name="twitter" value={formData.twitter} onChange={handleChange} placeholder="Twitter Link" style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.3)', color: '#fff' }} />
              </div>
              <button type="submit" className="btn" style={{ alignSelf: 'flex-start', padding: '1rem 3rem' }}><Save size={18} style={{display:'inline'}} /> 저장 및 배포</button>
            </form>
          )}

          {activeTab === 'feeds' && (
            <div className="fade-in">
              <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Plus color="#c77dff" /> 피드 등록(추가)</h3>
              <form onSubmit={handleAddFeed} style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem' }}>
                <input type="text" placeholder="날짜" value={newFeed.date} onChange={e => setNewFeed({...newFeed, date: e.target.value})} style={{ width: '100%', padding: '1rem', marginBottom: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.3)', color: '#fff' }} required />
                <input type="text" placeholder="제목" value={newFeed.title} onChange={e => setNewFeed({...newFeed, title: e.target.value})} style={{ width: '100%', padding: '1rem', marginBottom: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.3)', color: '#fff' }} required />
                <input type="text" placeholder="썸네일 이미지 주소 (URL - 옵션)" value={newFeed.imageUrl} onChange={e => setNewFeed({...newFeed, imageUrl: e.target.value})} style={{ width: '100%', padding: '1rem', marginBottom: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.3)', color: '#fff' }} />
                <textarea placeholder="내용" value={newFeed.content} onChange={e => setNewFeed({...newFeed, content: e.target.value})} rows="3" style={{ width: '100%', padding: '1rem', marginBottom: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.3)', color: '#fff' }} required />
                <button type="submit" className="btn">배포하기</button>
              </form>
              <h4 style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>가져온 피드 목록 </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {(siteData.newsFeeds || []).map(feed => (
                  <div key={feed.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px' }}>
                    <div><span style={{ fontSize: '0.8rem', color: '#c77dff' }}>{feed.date}</span><div style={{ fontWeight: 'bold' }}>{feed.title}</div></div>
                    <button onClick={() => handleDeleteFeed(feed.id)} style={{ background: 'none', border: 'none', color: '#ff4d4d', cursor: 'pointer' }}><Trash2 size={18} /></button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'admins' && (
            <div className="fade-in">
              <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Users color="#c77dff" /> 서브 관리자 생성</h3>
              <form onSubmit={handleAddAdmin} style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem', display: 'flex', gap: '0.5rem' }}>
                <input type="text" placeholder="직급" value={newAdmin.role} onChange={e => setNewAdmin({...newAdmin, role: e.target.value})} style={{ flex: 1, padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.3)', color: '#fff' }} required />
                <input type="text" placeholder="ID" value={newAdmin.username} onChange={e => setNewAdmin({...newAdmin, username: e.target.value})} style={{ flex: 1, padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.3)', color: '#fff' }} required />
                <input type="text" placeholder="PW (암호)" value={newAdmin.password} onChange={e => setNewAdmin({...newAdmin, password: e.target.value})} style={{ flex: 1, padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.3)', color: '#fff' }} required />
                <button type="submit" className="btn">생성</button>
              </form>

              <h4 style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>현재 생성된 계정 목록 (삭제만 가능)</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', borderRadius: '8px', border: '1px solid #9d4edd', background: 'rgba(157, 78, 221, 0.2)' }}>
                  <div><b>[최고 관리자]</b> video</div><span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>삭제 불가 / 비밀번호 고정</span>
                </div>
                {(siteData.subAdmins || []).map(admin => (
                  <div key={admin.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px' }}>
                    <div><span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>[{admin.role}]</span> <b style={{ margin: '0 10px' }}>ID: {admin.username}</b> <span style={{ fontSize:'0.85rem', color: '#ffb703' }}>PW: {admin.password}</span></div>
                    <button onClick={() => handleDeleteAdmin(admin.id)} style={{ background: 'none', border: 'none', color: '#ff4d4d', cursor: 'pointer' }}><Trash2 size={18} /></button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
