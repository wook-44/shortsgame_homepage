import React, { useState, useContext, useEffect } from 'react';
import { Lock, Settings, LogOut, Save, Plus, Users, Trash2, ShieldCheck, RefreshCw, Link as LinkIcon, Share2 } from 'lucide-react';
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
    companyInfo: ''
  });

  // SNS 개별 추가 폼
  const [newSns, setNewSns] = useState({ name: '', url: '', iconUrl: '' });

  // 초기 폼 데이터 바인딩
  useEffect(() => {
    if (siteData) {
      setFormData({
        heroTitle: siteData.heroTitle || '',
        heroSubtitle: siteData.heroSubtitle || '',
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
    alert("출입증(토큰) 저장 완료!");
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleCommonUpdate = async (updatePkg, successMsg) => {
    setIsSaving(true);
    const result = await updateData(updatePkg, githubToken);
    setIsSaving(false);
    if (result.success) {
      alert(successMsg + (result.localOnly ? " (로컬 저장)" : " 및 서버 배포 시작!"));
    } else {
      alert("오류: " + result.message);
    }
  };

  const handleSaveGeneral = (e) => {
    e.preventDefault();
    handleCommonUpdate({
      heroTitle: formData.heroTitle,
      heroSubtitle: formData.heroSubtitle,
      companyInfo: formData.companyInfo
    }, "기본 정보 수정 완료");
  };

  // SNS 추가
  const handleAddSns = (e) => {
    e.preventDefault();
    if (!newSns.name || !newSns.url) return;
    const snsList = [...(siteData.snsLinks || []), { ...newSns, id: Date.now() }];
    handleCommonUpdate({ snsLinks: snsList }, "SNS 링크 추가 완료");
    setNewSns({ name: '', url: '', iconUrl: '' });
  };

  // SNS 삭제
  const handleDeleteSns = (id) => {
    const snsList = (siteData.snsLinks || []).filter(s => s.id !== id);
    handleCommonUpdate({ snsLinks: snsList }, "SNS 링크 삭제 완료");
  };

  const handleAddFeed = (e) => {
    e.preventDefault();
    handleCommonUpdate({ newsFeeds: [{...newFeed, id: Date.now()}, ...(siteData.newsFeeds || [])] }, "피드 등록 완료");
    setNewFeed({ date: '', title: '', content: '', imageUrl: '' });
  };

  const handleDeleteFeed = (id) => {
    handleCommonUpdate({ newsFeeds: (siteData.newsFeeds || []).filter(f => f.id !== id) }, "피드 삭제 완료");
  };

  const handleAddAdmin = (e) => {
    e.preventDefault();
    handleCommonUpdate({ subAdmins: [...(siteData.subAdmins || []), {...newAdmin, id: Date.now()}] }, "관리자 추가 완료");
    setNewAdmin({ role: '', username: '', password: '' });
  };

  const handleDeleteAdmin = (id) => {
    handleCommonUpdate({ subAdmins: (siteData.subAdmins || []).filter(a => a.id !== id) }, "관리자 삭제 완료");
  };

  if (isLoading) return <div className="container flex-center"><h3>서버 연결 중...</h3></div>;

  if (!isLoggedIn) {
    return (
      <div className="container flex-center" style={{ minHeight: '80vh' }}>
        <div className="glass-panel fade-in" style={{ width: '100%', maxWidth: '400px', padding: '3rem 2rem', textAlign: 'center' }}>
          <div style={{ width: '60px', height: '60px', background: 'rgba(157, 78, 221, 0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
            <Lock size={30} color="#c77dff" />
          </div>
          <h2 style={{ marginBottom: '2rem' }}>사이트 관리 로그인</h2>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input type="text" placeholder="아이디" value={loginForm.id} onChange={e => setLoginForm({...loginForm, id: e.target.value})} style={{ padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.3)', color: '#fff' }} required />
            <input type="password" placeholder="비밀번호" value={loginForm.password} onChange={e => setLoginForm({...loginForm, password: e.target.value})} style={{ padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.3)', color: '#fff' }} required />
            <button type="submit" className="btn" style={{ marginTop: '0.5rem' }}>접속</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="container fade-in">
       {isSaving && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <RefreshCw size={50} color="#c77dff" className="spin" />
          <h3 style={{ marginTop: '1.5rem' }}>서버 전송 및 자동 배포 중...</h3>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div>
          <h2>마스터 대시보드</h2>
          <span style={{ fontSize: '0.9rem', color: '#c77dff' }}>등급: {roleInfo}</span>
        </div>
        <button onClick={() => setIsLoggedIn(false)} className="btn" style={{ background: 'rgba(255,255,255,0.1)' }}>로그아웃</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '2rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem', height: 'fit-content' }}>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <li onClick={() => setActiveTab('general')} style={{ padding: '1rem', background: activeTab === 'general' ? 'var(--accent-glow)' : 'transparent', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}><Settings size={18} /> 메인 정보</li>
            <li onClick={() => setActiveTab('sns')} style={{ padding: '1rem', background: activeTab === 'sns' ? 'var(--accent-glow)' : 'transparent', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}><Share2 size={18} /> SNS 관리</li>
            <li onClick={() => setActiveTab('feeds')} style={{ padding: '1rem', background: activeTab === 'feeds' ? 'var(--accent-glow)' : 'transparent', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}><Plus size={18} /> 피드 발행</li>
            <li onClick={() => setActiveTab('admins')} style={{ padding: '1rem', background: activeTab === 'admins' ? 'var(--accent-glow)' : 'transparent', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}><Users size={18} /> 계정 관리</li>
            <li onClick={() => setActiveTab('sync')} style={{ padding: '1rem', background: activeTab === 'sync' ? 'var(--accent-glow)' : 'transparent', borderRadius: '8px', border: '1px solid #c77dff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', marginTop: '1rem' }}><ShieldCheck size={18} color="#c77dff" /> 동기화 설정</li>
          </ul>
        </div>

        <div className="glass-panel" style={{ padding: '2rem' }}>
          {activeTab === 'general' && (
            <form onSubmit={handleSaveGeneral} className="fade-in">
              <h3 style={{ marginBottom: '1.5rem' }}>대문 문구 수정</h3>
              <textarea name="heroTitle" value={formData.heroTitle} onChange={handleChange} rows="2" style={{ width: '100%', padding: '1rem', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', color: '#fff', marginBottom: '1rem' }} />
              <textarea name="heroSubtitle" value={formData.heroSubtitle} onChange={handleChange} rows="3" style={{ width: '100%', padding: '1rem', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', color: '#fff', marginBottom: '1rem' }} />
              <input type="text" name="companyInfo" value={formData.companyInfo} onChange={handleChange} placeholder="푸터 정보" style={{ width: '100%', padding: '1rem', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', color: '#fff' }} />
              <button type="submit" className="btn" style={{ marginTop: '1.5rem' }}>저장하기</button>
            </form>
          )}

          {activeTab === 'sns' && (
            <div className="fade-in">
              <h3 style={{ marginBottom: '1.5rem' }}>SNS 링크 무제한 관리</h3>
              <form onSubmit={handleAddSns} style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <input type="text" placeholder="SNS 이름 (예: YouTube)" value={newSns.name} onChange={e => setNewSns({...newSns, name: e.target.value})} style={{ padding: '1rem', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', color: '#fff' }} required />
                  <input type="text" placeholder="아이콘 주소 (이미지 URL, 옵션)" value={newSns.iconUrl} onChange={e => setNewSns({...newSns, iconUrl: e.target.value})} style={{ padding: '1rem', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', color: '#fff' }} />
                </div>
                <input type="text" placeholder="연결 링크 (https://...)" value={newSns.url} onChange={e => setNewSns({...newSns, url: e.target.value})} style={{ width: '100%', padding: '1rem', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', color: '#fff', marginBottom: '1rem' }} required />
                <button type="submit" className="btn">새 SNS 추가</button>
              </form>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {(siteData.snsLinks || []).map(sns => (
                  <div key={sns.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {sns.iconUrl ? <img src={sns.iconUrl} style={{ width: '24px', height: '24px', borderRadius: '4px' }} alt="" /> : <LinkIcon size={20} />}
                      <b>{sns.name}</b>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>({sns.url})</span>
                    </div>
                    <button onClick={() => handleDeleteSns(sns.id)} style={{ color: '#ff4d4d', background: 'none', border: 'none', cursor: 'pointer' }}><Trash2 size={18} /></button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'feeds' && (
            <div className="fade-in">
              <h3>뉴스 발행</h3>
              <form onSubmit={handleAddFeed} style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '12px', marginTop: '1rem' }}>
                <input type="text" placeholder="날짜" maxLength={20} value={newFeed.date} onChange={e => setNewFeed({...newFeed, date: e.target.value})} style={{ width: '100%', padding: '1rem', background: 'rgba(0,0,0,0.3)', color: '#fff', marginBottom: '1rem' }} required />
                <input type="text" placeholder="제목" maxLength={20} value={newFeed.title} onChange={e => setNewFeed({...newFeed, title: e.target.value})} style={{ width: '100%', padding: '1rem', background: 'rgba(0,0,0,0.3)', color: '#fff', marginBottom: '1rem' }} required />
                <input type="text" placeholder="썸네일 주소" value={newFeed.imageUrl} onChange={e => setNewFeed({...newFeed, imageUrl: e.target.value})} style={{ width: '100%', padding: '1rem', background: 'rgba(0,0,0,0.3)', color: '#fff', marginBottom: '1rem' }} />
                <textarea placeholder="내용" value={newFeed.content} onChange={e => setNewFeed({...newFeed, content: e.target.value})} rows="4" style={{ width: '100%', padding: '1rem', background: 'rgba(0,0,0,0.3)', color: '#fff', marginBottom: '1rem' }} required />
                <button type="submit" className="btn">배포하기</button>
              </form>
            </div>
          )}

          {activeTab === 'sync' && (
            <div className="fade-in">
              <h3 style={{ marginBottom: '1.5rem' }}>동기화 출입증</h3>
              <input type="password" placeholder="ghp_ 토큰 입력" value={githubToken} onChange={e => setGithubToken(e.target.value)} style={{ width: '100%', padding: '1rem', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', color: '#fff', marginBottom: '1rem' }} />
              <button onClick={handleSaveToken} className="btn" style={{ width: '100%' }}>토큰 저장</button>
            </div>
          )}
          
          {activeTab === 'admins' && (
            <div className="fade-in">
              <h3 style={{ marginBottom: '1.5rem' }}>계정 관리</h3>
              <form onSubmit={handleAddAdmin} style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
                <input type="text" placeholder="직급" value={newAdmin.role} onChange={e => setNewAdmin({...newAdmin, role: e.target.value})} style={{ flex: 1, padding: '1rem', background: 'rgba(0,0,0,0.3)', color: '#fff' }} />
                <input type="text" placeholder="ID" value={newAdmin.username} onChange={e => setNewAdmin({...newAdmin, username: e.target.value})} style={{ flex: 1, padding: '1rem', background: 'rgba(0,0,0,0.3)', color: '#fff' }} />
                <input type="text" placeholder="PW" value={newAdmin.password} onChange={e => setNewAdmin({...newAdmin, password: e.target.value})} style={{ flex: 1, padding: '1rem', background: 'rgba(0,0,0,0.3)', color: '#fff' }} />
                <button type="submit" className="btn">생성</button>
              </form>
              {(siteData.subAdmins || []).map(a => (
                <div key={a.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', marginBottom: '0.5rem' }}>
                  <span>{a.role}: {a.username}</span>
                  <button onClick={() => handleDeleteAdmin(a.id)} style={{ color: '#ff4d4d', background: 'none', border: 'none' }}>삭제</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
