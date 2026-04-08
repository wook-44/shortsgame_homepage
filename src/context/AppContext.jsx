import React, { createContext, useState, useEffect, useCallback } from 'react';

// === 데이터베이스 초기값 설정 === 
const defaultData = {
  heroTitle: "차원이 다른 도파민 퍼즐, Dopamine Smith",
  heroSubtitle: "ShortsGame이 선보이는 첫 번째 마스터피스. 대장장이 키우기와 퍼즐의 완벽한 조화.",
  snsLinks: [
    { id: 1, name: "YouTube", url: "https://youtube.com/@shortsgame", iconUrl: "" },
    { id: 2, name: "Twitter", url: "https://twitter.com/shortsgame", iconUrl: "" }
  ],
  companyInfo: "회사명: ShortsGame | 대표: 무명 | 이메일: contact@shortsgame.com",
  newsFeeds: [
    { id: 1, date: "2026. 04. 08", title: "도파민 스미스, 시스템 개편!", content: "짜릿한 손맛을 경험해 보세요.", imageUrl: "" }
  ],
  subAdmins: [
    { id: 1, role: "운영팀", username: "manager01", password: "123" }
  ]
};

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [siteData, setSiteData] = useState(defaultData);
  const [isLoading, setIsLoading] = useState(true);
  const [syncStatus, setSyncStatus] = useState('idle'); // 'idle', 'loading', 'success', 'error'

  // 데이터 로드 함수 (캐시 방지 강화)
  const loadData = useCallback(async () => {
    setIsLoading(true);
    setSyncStatus('loading');
    try {
      const owner = "wook-44";
      const repo = "shortsgame_homepage";
      const path = "public/data.json";
      const branch = "data";

      // 1. GitHub API를 통해 실시간 데이터와 SHA값을 가져옵니다. (캐시 무력화 t 파라미터)
      const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}&t=${Date.now()}`, {
        cache: 'no-store'
      });
      
      if (res.ok) {
        const fileInfo = await res.json();
        // UTF-8 디코딩 안전하게 처리
        const content = decodeURIComponent(escape(atob(fileInfo.content)));
        const cloudData = JSON.parse(content);
        
        setSiteData({
          ...defaultData,
          ...cloudData,
          snsLinks: Array.isArray(cloudData.snsLinks) ? cloudData.snsLinks : defaultData.snsLinks,
          newsFeeds: Array.isArray(cloudData.newsFeeds) ? cloudData.newsFeeds : defaultData.newsFeeds
        });
        setSyncStatus('success');
      } else {
        throw new Error("서버 응답 없음");
      }
    } catch (e) {
      console.error("데이터 로드 실패:", e);
      setSyncStatus('error');
      const saved = localStorage.getItem('shortsgameData');
      if (saved) setSiteData(JSON.parse(saved));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // 데이터 저장 함수
  const syncToGithubServer = async (newData, githubToken) => {
    if (!githubToken) {
      localStorage.setItem('shortsgameData', JSON.stringify(newData));
      return { success: false, message: "동기화 토큰이 설정되지 않았습니다." };
    }

    setSyncStatus('loading');
    try {
      const owner = "wook-44";
      const repo = "shortsgame_homepage";
      const path = "public/data.json";
      const branch = "data";
      
      // 1. 최신 SHA값 획득 (충돌 방지)
      const getFileRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}&t=${Date.now()}`, {
        headers: { "Authorization": `token ${githubToken}` },
        cache: 'no-store'
      });
      
      let sha = "";
      if (getFileRes.ok) {
        const fileData = await getFileRes.json();
        sha = fileData.sha;
      } else {
        throw new Error("서버의 최신 상태를 가져오지 못했습니다. 토큰을 확인해 주세요.");
      }

      // 2. 데이터 인코딩 및 전송
      const content = btoa(unescape(encodeURIComponent(JSON.stringify(newData, null, 2))));
      const updateRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
        method: "PUT",
        headers: {
          "Authorization": `token ${githubToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: "운영툴: 데이터 실시간 업데이트",
          content: content,
          sha: sha,
          branch: branch
        })
      });

      if (updateRes.ok) {
        localStorage.setItem('shortsgameData', JSON.stringify(newData));
        setSyncStatus('success');
        return { success: true };
      } else {
        const errData = await updateRes.json();
        throw new Error(errData.message);
      }
    } catch (error) {
      setSyncStatus('error');
      return { success: false, message: error.message };
    }
  };

  const updateData = async (newData, githubToken = null) => {
    const updated = { ...siteData, ...newData };
    setSiteData(updated);
    if (githubToken) {
      return await syncToGithubServer(updated, githubToken);
    } else {
      localStorage.setItem('shortsgameData', JSON.stringify(updated));
      return { success: true, localOnly: true };
    }
  };

  return (
    <AppContext.Provider value={{ siteData, updateData, isLoading, syncStatus, loadData }}>
      {children}
    </AppContext.Provider>
  );
};
