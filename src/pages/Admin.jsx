import React, { useState, useContext, useEffect } from 'react';
import { Lock, Settings, LogOut, Save, Plus, Users, Trash2, ShieldCheck, RefreshCw, Link as LinkIcon, Share2, MoveVertical, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { AppContext } from '../context/AppContext';
import { Reorder } from 'framer-motion';

const Admin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [roleInfo, setRoleInfo] = useState('');
  const { siteData, updateData, isLoading, syncStatus, loadData } = useContext(AppContext);
  
  const [isSaving, setIsSaving] = useState(false);
  const [githubToken, setGithubToken] = useState(() => localStorage.getItem('github_token') || '');
  const [reorderList, setReorderList] = useState([]);

  useEffect(() => {
    if (siteData && siteData.newsFeeds) {
      setReorderList(siteData.newsFeeds);
    }
  }, [siteData]);

  const [loginForm, setLoginForm] = useState({ id: '', password: '' });
  const [formData, setFormData] = useState({ heroTitle: '', heroSubtitle: '', companyInfo: '' });
  const [newSns, setNewSns] = useState({ name: '', url: '', iconUrl: '' });
  const [newFeed, setNewFeed] = useState({ date: '', title: '', content: '', imageUrl: '' });
  const [newAdmin, setNewAdmin] = useState({ role: '', username: '', password: '' });

  useEffect(() => {
    if (siteData) {
      setFormData({
        heroTitle: siteData.heroTitle || '',
        heroSubtitle: siteData.heroSubtitle || '',
        companyInfo: siteData.companyInfo || ''
      });
    }
  }, [siteData]);

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
    alert("출입증(토큰) 저장 완료! 새로고침하여 동기화를 확인해 주세요.");
    window.location.reload();
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleCommonUpdate = async (updatePkg, successMsg) => {
    setIsSaving(true);
    const result = await updateData(updatePkg, githubToken);
    setIsSaving(false);
    if (result.success) {
      alert(successMsg);
    } else {
      alert("⚠️ 저장 실패\n원인: " + result.message + "\n\n(1. 토큰이 올바른지 확인\n2. 인터넷 연결 확인\n3. 잠시 후 다시 시도)");
    }
  };

  const handleSaveGeneral = (e) => {
    e.preventDefault();
    handleCommonUpdate({ ...formData }, "메인 정보가 안전하게 저장되었습니다.");
  };

  const handleAddSns = (e) => {
    e.preventDefault();
    if (!newSns.name || !newSns.url) return;
    const snsList = [...(siteData.snsLinks || []), { ...newSns, id: Date.now() }];
    handleCommonUpdate({ snsLinks: snsList }, "SNS 링크가 추가되었습니다.");
    setNewSns({ name: '', url: '', iconUrl: '' });
  };

  const handleDeleteSns = (id) => {
    const snsList = (siteData.snsLinks || []).filter(s => s.id !== id);
    handleCommonUpdate({ snsLinks: snsList }, "SNS 링크가 삭제되었습니다.");
  };

  const handleAddFeed = (e) => {
    e.preventDefault();
    const updatedFeeds = [{...newFeed, id: Date.now()}, ...(siteData.newsFeeds || [])];
    handleCommonUpdate({ newsFeeds: updatedFeeds }, "새 피드가 발행되었습니다.");
    setNewFeed({ date: '', title: '', content: '', imageUrl: '' });
  };

  const handleDeleteFeed = (id) => {
    if (window.confirm("삭제하시겠습니까?")) {
      handleCommonUpdate({ newsFeeds: (siteData.newsFeeds || []).filter(f => f.id !== id) }, "피드가 삭제되었습니다.");
    }
  };

  const handleSaveOrder = () => {
    handleCommonUpdate({ newsFeeds: reorderList }, "순서가 변경되었습니다.");
  };

  const handleAddAdmin = (e) => {
    e.preventDefault();
    handleCommonUpdate({ subAdmins: [...(siteData.subAdmins || []), {...newAdmin, id: Date.now()}] }, "관리 계정이 추가되었습니다.");
    setNewAdmin({ role: '', username: '', password: '' });
  };

  const handleDeleteAdmin = (id) => {
    handleCommonUpdate({ subAdmins: (siteData.subAdmins || []).filter(a => a.id !== id) }, "관리 계정이 삭제되었습니다.");
  };

  if (isLoading && syncStatus === 'loading') return <div className="container flex-center"><h3>연결 중...</h3></div>;

  if (!isLoggedIn) {
    return (
      <div className="container flex-center" style={{ minHeight: '80vh' }}>
        <div className="glass-panel fade-in" style={{ width: '100%', maxWidth: '400px', padding: '3rem 2rem', textAlign: 'center' }}>
          <div style={{ width: '60px', height: '60px', background: 'rgba(157, 78, 221, 0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
            <Lock size={30} color="#c77dff" />
          </div>
          <h2>ShortsGame</h2>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
            <input type="text" placeholder="아이디" value={loginForm.id} onChange={e => setLoginForm({...loginForm, id: e.target.value})} style={{ padding: '1rem', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', color: '#fff' }} required />
            <input type="password" placeholder="비밀번호" value={loginForm.password} onChange={e => setLoginForm({...loginForm, password: e.target.value})} style={{ padding: '1rem', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', color: '#fff' }} required />
            <button type="submit" className="btn">접속</button>
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
          <h3 style={{ marginTop: '1.5rem' }}>저장 중...</h3>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h2 className="title-display">Dashboard</h2>
            {syncStatus === 'success' ? (
              <span style={{ fontSize: '0.7rem', background: 'rgba(34, 197, 94, 0.2)', color: '#4ade80', padding: '4px 10px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <CheckCircle size={12} /> 실시간 연결됨
              </span>
            ) : (
              <span style={{ fontSize: '0.7rem', background: 'rgba(239, 68, 68, 0.2)', color: '#f87171', padding: '4px 10px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <XCircle size={12} /> 오프라인 모드
              </span>
            )}
          </div>
          <span style={{ fontSize: '0.8rem', color: '#c77dff' }}>{roleInfo}</span>
        </div>
        <button onClick={() => setIsLoggedIn(false)} className="btn" style={{ background: 'rgba(255,255,255,0.1)', padding: '0.5rem 1rem' }}>로그아웃</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '2rem' }}>
        <div className="glass-panel" style={{ padding: '1.2rem', height: 'fit-content' }}>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <li onClick={() => setActiveTab('general')} style={{ padding: '0.8rem', background: activeTab === 'general' ? 'var(--accent-glow)' : 'transparent', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem' }}><Settings size={16} /> 메인 정보</li>
            <li onClick={() => setActiveTab('sns')} style={{ padding: '0.8rem', background: activeTab === 'sns' ? 'var(--accent-glow)' : 'transparent', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem' }}><Share2 size={16} /> SNS 관리</li>
            <li onClick={() => setActiveTab('feeds')} style={{ padding: '0.8rem', background: activeTab === 'feeds' ? 'var(--accent-glow)' : 'transparent', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem' }}><Plus size={16} /> 뉴스/순서</li>
            <li onClick={() => setActiveTab('admins')} style={{ padding: '0.8rem', background: activeTab === 'admins' ? 'var(--accent-glow)' : 'transparent', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem' }}><Users size={16} /> 계정 관리</li>
            <li onClick={() => setActiveTab('sync')} style={{ padding: '0.8rem', background: activeTab === 'sync' ? 'var(--accent-glow)' : 'transparent', borderRadius: '8px', border: '1px solid #c77dff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', marginTop: '1rem', fontSize: '0.9rem' }}><ShieldCheck size={16} color="#c77dff" /> 동기화 토큰</li>
          </ul>
        </div>

        <div className="glass-panel" style={{ padding: '2rem' }}>
          {activeTab === 'general' && (
            <form onSubmit={handleSaveGeneral} className="fade-in">
              <h3 style={{ marginBottom: '1.5rem' }}>기본 텍스트 관리</h3>
              <textarea name="heroTitle" value={formData.heroTitle} onChange={handleChange} rows="2" style={{ width: '100%', padding: '1rem', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', color: '#fff', marginBottom: '1rem' }} />
              <textarea name="heroSubtitle" value={formData.heroSubtitle} onChange={handleChange} rows="3" style={{ width: '100%', padding: '1rem', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', color: '#fff', marginBottom: '1rem' }} />
              <input type="text" name="companyInfo" value={formData.companyInfo} onChange={handleChange} placeholder="푸터 정보" style={{ width: '100%', padding: '1rem', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', color: '#fff' }} />
              <button type="submit" className="btn" style={{ marginTop: '1.5rem' }}>메인 정보 저장</button>
            </form>
          )}

          {activeTab === 'sns' && (
            <div className="fade-in">
              <h3 style={{ marginBottom: '1.5rem' }}>SNS 링크</h3>
              <form onSubmit={handleAddSns} style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <input type="text" placeholder="이름" value={newSns.name} onChange={e => setNewSns({...newSns, name: e.target.value})} style={{ padding: '1rem', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', color: '#fff' }} required />
                  <input type="text" placeholder="아이콘 이미지 URL" value={newSns.iconUrl} onChange={e => setNewSns({...newSns, iconUrl: e.target.value})} style={{ padding: '1rem', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', color: '#fff' }} />
                </div>
                <input type="text" placeholder="링크 주소" value={newSns.url} onChange={e => setNewSns({...newSns, url: e.target.value})} style={{ width: '100%', padding: '1rem', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', color: '#fff', marginBottom: '1rem' }} required />
                <button type="submit" className="btn">링크 추가</button>
              </form>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                {(siteData.snsLinks || []).map(sns => (
                  <div key={sns.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {sns.iconUrl ? <img src={sns.iconUrl} style={{ width: '20px', height: '20px' }} alt="" /> : <LinkIcon size={18} />}
                      <span>{sns.name}</span>
                    </div>
                    <button onClick={() => handleDeleteSns(sns.id)} style={{ color: '#ff4d4d', background: 'none', border: 'none' }}><Trash2 size={16} /></button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'feeds' && (
            <div className="fade-in">
              <h3 style={{ marginBottom: '1.5rem' }}>피드 소식 추가</h3>
              <form onSubmit={handleAddFeed} style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '12px', marginBottom: '3rem' }}>
                <input type="text" placeholder="날짜 (예: 2026.04.08)" maxLength={20} value={newFeed.date} onChange={e => setNewFeed({...newFeed, date: e.target.value})} style={{ width: '100%', padding: '1rem', background: 'rgba(0,0,0,0.3)', color: '#fff', marginBottom: '1rem', borderRadius: '8px' }} required />
                <input type="text" placeholder="제목 (최대 20자)" maxLength={20} value={newFeed.title} onChange={e => setNewFeed({...newFeed, title: e.target.value})} style={{ width: '100%', padding: '1rem', background: 'rgba(0,0,0,0.3)', color: '#fff', marginBottom: '1rem', borderRadius: '8px' }} required />
                <input type="text" placeholder="썸네일 이미지 URL" value={newFeed.imageUrl} onChange={e => setNewFeed({...newFeed, imageUrl: e.target.value})} style={{ width: '100%', padding: '1rem', background: 'rgba(0,0,0,0.3)', color: '#fff', marginBottom: '1rem', borderRadius: '8px' }} />
                <textarea placeholder="내용 입력..." value={newFeed.content} onChange={e => setNewFeed({...newFeed, content: e.target.value})} rows="3" style={{ width: '100%', padding: '1rem', background: 'rgba(0,0,0,0.3)', color: '#fff', marginBottom: '1rem', borderRadius: '8px' }} required />
                <button type="submit" className="btn">피드 발행</button>
              </form>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>
                <h3>순서 관리 (드래그)</h3>
                <button onClick={handleSaveOrder} className="btn" style={{ background: '#9d4edd', padding: '0.6rem 2rem', fontSize: '0.8rem' }}><Save size={14} style={{display:'inline', marginRight:'6px'}}/> 정렬 순서 저장</button>
              </div>

              {reorderList.length > 0 ? (
                <Reorder.Group axis="y" values={reorderList} onReorder={setReorderList} style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  {reorderList.map((feed) => (
                    <Reorder.Item key={feed.id} value={feed}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px', cursor: 'grab', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                          <MoveVertical size={16} color="var(--text-muted)" />
                          <div>
                            <span style={{ fontSize: '0.75rem', color: '#c77dff' }}>{feed.date}</span>
                            <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>{feed.title}</div>
                          </div>
                        </div>
                        <button onClick={(e) => { e.stopPropagation(); handleDeleteFeed(feed.id); }} style={{ color: '#ff4d4d', background: 'none', border: 'none', padding: '10px' }}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </Reorder.Item>
                  ))}
                </Reorder.Group>
              ) : (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>데이터가 비어있습니다.</div>
              )}
            </div>
          )}

          {activeTab === 'admins' && (
            <div className="fade-in">
              <h3 style={{ marginBottom: '1.5rem' }}>계정 관리 (서브 관리자)</h3>
              <form onSubmit={handleAddAdmin} style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
                <input type="text" placeholder="직급/역할 (예: 편집팀)" value={newAdmin.role} onChange={e => setNewAdmin({...newAdmin, role: e.target.value})} style={{ flex: 1, padding: '1rem', background: 'rgba(0,0,0,0.3)', color: '#fff', borderRadius: '8px' }} required />
                <input type="text" placeholder="아이디" value={newAdmin.username} onChange={e => setNewAdmin({...newAdmin, username: e.target.value})} style={{ flex: 1, padding: '1rem', background: 'rgba(0,0,0,0.3)', color: '#fff', borderRadius: '8px' }} required />
                <input type="text" placeholder="비밀번호" value={newAdmin.password} onChange={e => setNewAdmin({...newAdmin, password: e.target.value})} style={{ flex: 1, padding: '1rem', background: 'rgba(0,0,0,0.3)', color: '#fff', borderRadius: '8px' }} required />
                <button type="submit" className="btn" style={{ padding: '0 1.5rem' }}>추가</button>
              </form>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                {siteData.subAdmins && siteData.subAdmins.length > 0 ? (
                  siteData.subAdmins.map(a => (
                    <div key={a.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.2rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <div>
                        <span style={{ fontSize: '0.8rem', color: '#c77dff', display: 'block' }}>{a.role}</span>
                        <span style={{ fontWeight: '600' }}>{a.username}</span>
                      </div>
                      <button onClick={() => handleDeleteAdmin(a.id)} style={{ color: '#ff4d4d', background: 'none', border: 'none', padding: '10px' }}><Trash2 size={18} /></button>
                    </div>
                  ))
                ) : (
                  <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)', border: '2px dashed rgba(255,255,255,0.05)', borderRadius: '12px' }}>
                    등록된 서브 계정이 없습니다. 위의 양식을 이용해 추가해 보세요!
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'sync' && (
            <div className="fade-in">
              <h3 style={{ marginBottom: '1.5rem' }}>동기화 설정</h3>
              <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '1.5rem', borderRadius: '12px' }}>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>깃허브 토큰(`ghp_...`)을 입력해 주세요. 이 기기 브라우저에 저장되어 실시간 서버 저장이 가능해집니다.</p>
                <input type="password" placeholder="ghp_ 토큰 입력" value={githubToken} onChange={e => setGithubToken(e.target.value)} style={{ width: '100%', padding: '1rem', background: 'rgba(0,0,0,0.3)', color: '#fff', borderRadius: '8px' }} />
                <button onClick={handleSaveToken} className="btn" style={{ width: '100%', marginTop: '1rem' }}>설정 완료</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
