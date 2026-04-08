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
  const [syncStatus, setSyncStatus] = useState('idle');

  const owner = "wook-44";
  const repo = "shortsgame_homepage";
  const path = "public/data.json";
  const branch = "data";

  // 1. 데이터 로드 (API를 통해 실시간 SHA와 기보유 데이터를 가져옴)
  const loadData = useCallback(async () => {
    setIsLoading(true);
    setSyncStatus('loading');
    try {
      const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}&t=${Date.now()}`);
      
      if (res.ok) {
        const fileInfo = await res.json();
        const content = decodeURIComponent(escape(atob(fileInfo.content)));
        const cloudData = JSON.parse(content);
        
        setSiteData({
          ...defaultData,
          ...cloudData,
          snsLinks: Array.isArray(cloudData.snsLinks) ? cloudData.snsLinks : defaultData.snsLinks,
          newsFeeds: Array.isArray(cloudData.newsFeeds) ? cloudData.newsFeeds : defaultData.newsFeeds
        });
        setSyncStatus('success');
      } else if (res.status === 404) {
        // 파일이 아직 없는 경우 (최초 실행)
        console.log("서버에 데이터 파일이 없습니다. 새로 생성될 예정입니다.");
        setSyncStatus('success');
      } else {
        throw new Error(`상태코드: ${res.status}`);
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

  // 2. 데이터 저장 (수정: 404 상황에서도 저장이 가능하도록 보강)
  const syncToGithubServer = async (newData, githubToken) => {
    if (!githubToken) {
      localStorage.setItem('shortsgameData', JSON.stringify(newData));
      return { success: false, message: "토큰이 입력되지 않았습니다." };
    }

    setSyncStatus('loading');
    try {
      // 1) 지점에 파일이 있는지, 있다면 SHA값이 무엇인지 확인
      const getFileRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`, {
        headers: { "Authorization": `token ${githubToken}` },
        cache: 'no-store'
      });
      
      let sha = "";
      if (getFileRes.ok) {
        const fileData = await getFileRes.json();
        sha = fileData.sha;
      } else if (getFileRes.status !== 404) {
        // 404 이외의 에러(401 등)면 중단
        throw new Error(`연결 오류 (코드: ${getFileRes.status})`);
      }

      // 2) 데이터 전송
      const jsonStr = JSON.stringify(newData, null, 2);
      const content = btoa(unescape(encodeURIComponent(jsonStr)));

      const updateRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
        method: "PUT",
        headers: {
          "Authorization": `token ${githubToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: "운영툴: 데이터 실시간 업데이트",
          content: content,
          sha: sha || undefined, // sha가 있으면 업데이트, 없으면 신규생성
          branch: branch
        })
      });

      if (updateRes.ok) {
        localStorage.setItem('shortsgameData', JSON.stringify(newData));
        setSyncStatus('success');
        return { success: true };
      } else {
        const errData = await updateRes.json();
        throw new Error(errData.message || `전송 실패 (${updateRes.status})`);
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
