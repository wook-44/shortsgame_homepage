import React, { useState, useContext, useEffect } from 'react';
import { Lock, Settings, LogOut, Save, Plus, Users, Trash2, CloudSync, ShieldCheck, RefreshCw } from 'lucide-react';
import { AppContext } from '../context/AppContext';

const Admin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [roleInfo, setRoleInfo] = useState('');
  const { siteData, updateData, isLoading } = useContext(AppContext);
  
  // 상태 관리
  const [isSaving, setIsSaving] = useState(false);
  const [githubToken, setGithubToken] = useState(() => localStorage.getItem('github_token') || '');
  
  // 로그인 입력 상태
  const [loginForm, setLoginForm] = useState({ id: '', password: '' });

  // 정보수정 폼 상태
  const [formData, setFormData] = useState({
    heroTitle: '',
    heroSubtitle: '',
    youtube: '',
    twitter: '',
    companyInfo: ''
  });

  // 초기 폼 데이터 바인딩
  useEffect(() => {
    if (siteData) {
      setFormData({
        heroTitle: siteData.heroTitle || '',
        heroSubtitle: siteData.heroSubtitle || '',
        youtube: siteData.snsLinks?.youtube || '',
        twitter: siteData.snsLinks?.twitter || '',
        companyInfo: siteData.companyInfo || ''
      });
    }
  }, [siteData]);

  const [newFeed, setNewFeed] = useState({ date: '', title: '', content: '', imageUrl: '' });
  const [newAdmin, setNewAdmin] = useState({ role: '', username: '', password: '' });

  const handleLogin = (e) => {
    e.preventDefault();
    const { id, password } = loginForm;
    if (id === 'video' && password === 'Cksnrl!004') {
      setIsLoggedIn(true);
      setRoleInfo('최고 관리자');
      return;
    }
    const subAdminMatched = siteData.subAdmins?.find(admin => admin.username === id && admin.password === password);
    if (subAdminMatched) {
      setIsLoggedIn(true);
      setRoleInfo(`서브 관리자 (${subAdminMatched.role})`);
      return;
    }
    alert("아이디 또는 비밀번호가 틀렸습니다.");
  };

  const handleSaveToken = () => {
    localStorage.setItem('github_token', githubToken);
    alert("출입증(토큰)이 브라우저에 안전하게 저장되었습니다.");
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleCommonUpdate = async (updatePkg, successMsg) => {
    setIsSaving(true);
    const result = await updateData(updatePkg, githubToken);
    setIsSaving(false);
    
    if (result.success) {
      if (result.localOnly) {
        alert(`${successMsg} (로컬에만 저장됨. 실시간 동기화를 위해선 토큰을 입력하세요!)`);
      } else {
        alert(`${successMsg} 및 깃허브 서버 전송 완료! 약 1분 뒤 전 세계 기기에 반영됩니다.`);
      }
    } else {
      alert(`오류 발생: ${result.message}\n토큰이 정확한지 확인해 주세요.`);
    }
  };

  const handleSaveGeneral = (e) => {
    e.preventDefault();
    handleCommonUpdate({
      heroTitle: formData.heroTitle,
      heroSubtitle: formData.heroSubtitle,
      companyInfo: formData.companyInfo,
      snsLinks: { youtube: formData.youtube, twitter: formData.twitter }
    }, "기본 정보가 수정되었습니다.");
  };

  const handleAddFeed = (e) => {
    e.preventDefault();
    if (!newFeed.title || !newFeed.content) return;
    const feedObj = { ...newFeed, id: Date.now() };
    handleCommonUpdate({ newsFeeds: [feedObj, ...(siteData.newsFeeds || [])] }, "새로운 피드가 등록되었습니다.");
    setNewFeed({ date: '', title: '', content: '', imageUrl: '' });
  };

  const handleDeleteFeed = (id) => {
    if (window.confirm("정말 이 피드를 삭제하시겠습니까?")) {
      handleCommonUpdate({ newsFeeds: (siteData.newsFeeds || []).filter(f => f.id !== id) }, "피드가 삭제되었습니다.");
    }
  };

  const handleAddAdmin = (e) => {
    e.preventDefault();
    if (!newAdmin.role || !newAdmin.username || !newAdmin.password) return;
    const adminObj = { ...newAdmin, id: Date.now() };
    handleCommonUpdate({ subAdmins: [...(siteData.subAdmins || []), adminObj] }, "서브 관리자가 추가되었습니다.");
    setNewAdmin({ role: '', username: '', password: '' });
  };

  const handleDeleteAdmin = (id) => {
    if (window.confirm("이 계정을 삭제하시겠습니까?")) {
      handleCommonUpdate({ subAdmins: (siteData.subAdmins || []).filter(a => a.id !== id) }, "관리자 계정이 삭제되었습니다.");
    }
  };

  if (isLoading) return <div className="container flex-center"><h3>서버 데이터 불러오는 중...</h3></div>;

  if (!isLoggedIn) {
    return (
      <div className="container flex-center" style={{ minHeight: '80vh' }}>
        <div className="glass-panel fade-in" style={{ width: '100%', maxWidth: '400px', padding: '3rem 2rem', textAlign: 'center' }}>
          <div style={{ width: '60px', height: '60px', background: 'rgba(157, 78, 221, 0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
            <Lock size={30} color="#c77dff" />
          </div>
          <h2 style={{ marginBottom: '0.5rem' }}>사이트 관리자 로그인</h2>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input type="text" placeholder="아이디" value={loginForm.id} onChange={e => setLoginForm({...loginForm, id: e.target.value})} style={{ padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.3)', color: '#fff' }} required />
            <input type="password" placeholder="비밀번호" value={loginForm.password} onChange={e => setLoginForm({...loginForm, password: e.target.value})} style={{ padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.3)', color: '#fff' }} required />
            <button type="submit" className="btn" style={{ marginTop: '0.5rem' }}>접속하기</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="container fade-in">
       {isSaving && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.7)', zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <RefreshCw size={50} color="#c77dff" className="spin" />
          <h3 style={{ marginTop: '1.5rem' }}>깃허브 서버로 데이터 전송 중...</h3>
          <p style={{ color: 'var(--text-muted)' }}>잠시만 기다려 주세요. 페이지를 닫지 마세요.</p>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div>
          <h2><span className="title-display" style={{ fontSize: '1.5rem', marginRight: '10px' }}>ShortsGame</span> 통합 관리센터</h2>
          <span style={{ fontSize: '0.9rem', color: '#c77dff', fontWeight: 'bold' }}>권한: {roleInfo}</span>
        </div>
        <button onClick={() => setIsLoggedIn(false)} className="btn" style={{ background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <LogOut size={16} /> 로그아웃
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '2rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem', height: 'fit-content' }}>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <li onClick={() => setActiveTab('general')} style={{ padding: '1rem', background: activeTab === 'general' ? 'var(--accent-glow)' : 'transparent', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}><Settings size={18} /> 홈페이지 기본 정보</li>
            <li onClick={() => setActiveTab('feeds')} style={{ padding: '1rem', background: activeTab === 'feeds' ? 'var(--accent-glow)' : 'transparent', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}><Plus size={18} /> 뉴스 피드 발행</li>
            <li onClick={() => setActiveTab('admins')} style={{ padding: '1rem', background: activeTab === 'admins' ? 'var(--accent-glow)' : 'transparent', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}><Users size={18} /> 서브 관리자 설정</li>
            <li onClick={() => setActiveTab('sync')} style={{ padding: '1rem', background: activeTab === 'sync' ? 'var(--accent-glow)' : 'transparent', borderRadius: '8px', border: '1px solid #c77dff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', marginTop: '1rem' }}><ShieldCheck size={18} color="#c77dff" /> 서버 동기화 설정</li>
          </ul>
        </div>

        <div className="glass-panel" style={{ padding: '2rem' }}>
          {activeTab === 'sync' && (
            <div className="fade-in">
              <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><ShieldCheck color="#c77dff" /> 실시간 동기화 출입증(토큰)</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                휴대폰 등 다른 기기에서도 데이터가 똑같이 보이게 하려면 깃허브 토큰이 필요합니다.<br/>
                입력하신 토큰은 서버에 저장되지 않고, 대표님의 **현재 브라우저에만** 안전하게 저장됩니다.
              </p>
              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '8px' }}>
                <input type="password" placeholder="ghp_로 시작하는 토큰 입력" value={githubToken} onChange={e => setGithubToken(e.target.value)} style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.3)', color: '#fff', marginBottom: '1rem' }} />
                <button onClick={handleSaveToken} className="btn" style={{ width: '100%', background: '#9d4edd' }}>토큰 브라우저에 저장하기</button>
              </div>
            </div>
          )}

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
              <button type="submit" className="btn" style={{ alignSelf: 'flex-start', padding: '1rem 3rem' }}><Save size={18} style={{display:'inline'}} /> 서버에 저장 및 배포</button>
            </form>
          )}

          {activeTab === 'feeds' && (
            <div className="fade-in">
              <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Plus color="#c77dff" /> 피드 등록(추가)</h3>
              <form onSubmit={handleAddFeed} style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem' }}>
                <input type="text" placeholder="날짜 (예: 2026. 04. 08)" maxLength={20} value={newFeed.date} onChange={e => setNewFeed({...newFeed, date: e.target.value})} style={{ width: '100%', padding: '1rem', marginBottom: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.3)', color: '#fff' }} required />
                <input type="text" placeholder="제목 (20자 이내)" maxLength={20} value={newFeed.title} onChange={e => setNewFeed({...newFeed, title: e.target.value})} style={{ width: '100%', padding: '1rem', marginBottom: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.3)', color: '#fff' }} required />
                <input type="text" placeholder="썸네일 주소 (권장: 가로 800px × 세로 200px)" value={newFeed.imageUrl} onChange={e => setNewFeed({...newFeed, imageUrl: e.target.value})} style={{ width: '100%', padding: '1rem', marginBottom: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.3)', color: '#fff' }} />
                <textarea placeholder="내용 (줄바꿈 가능)" value={newFeed.content} onChange={e => setNewFeed({...newFeed, content: e.target.value})} rows="5" style={{ width: '100%', padding: '1rem', marginBottom: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.3)', color: '#fff' }} required />
                <button type="submit" className="btn">서버에 피드 발행</button>
              </form>
              <h4 style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>현재 서버에 등록된 피드</h4>
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
                <input type="text" placeholder="PW" value={newAdmin.password} onChange={e => setNewAdmin({...newAdmin, password: e.target.value})} style={{ flex: 1, padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.3)', color: '#fff' }} required />
                <button type="submit" className="btn">계정 추가</button>
              </form>
              <h4 style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>관리자 명단</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', borderRadius: '8px', border: '1px solid #9d4edd', background: 'rgba(157, 78, 221, 0.2)' }}>
                  <div><b>[최고 관리자]</b> video</div><span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>고정 계정</span>
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
