import React, { createContext, useState, useEffect } from 'react';

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

  // 1. 공용 데이터 로드 (data 브랜치의 장부를 실시간으로 읽어옵니다)
  useEffect(() => {
    const loadData = async () => {
      try {
        const owner = "wook-44";
        const repo = "shortsgame_homepage";
        const path = "public/data.json";
        const branch = "data";

        // Raw 주소는 속도가 빠르고 Rate Limit 제약이 적어 실시간 패치에 유리합니다.
        const response = await fetch(`https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${path}?t=${Date.now()}`);
        
        if (response.ok) {
          const cloudData = await response.json();
          setSiteData(prev => ({
            ...defaultData,
            ...cloudData,
            snsLinks: Array.isArray(cloudData.snsLinks) ? cloudData.snsLinks : defaultData.snsLinks,
            newsFeeds: Array.isArray(cloudData.newsFeeds) ? cloudData.newsFeeds : (cloudData.newsFeeds ? Object.values(cloudData.newsFeeds) : defaultData.newsFeeds)
          }));
        } else {
          console.warn("서버 데이터 응답 없음, 로컬 저장소 확인");
          const saved = localStorage.getItem('shortsgameData');
          if (saved) setSiteData(JSON.parse(saved));
        }
      } catch (e) {
        console.error("데이터 로드 실패:", e);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // 2. 데이터 저장 (GitHub API를 사용해 data 브랜치 업데이트)
  const syncToGithubServer = async (newData, githubToken) => {
    if (!githubToken) {
      localStorage.setItem('shortsgameData', JSON.stringify(newData));
      return { success: false, message: "토큰이 없습니다." };
    }

    try {
      const owner = "wook-44";
      const repo = "shortsgame_homepage";
      const path = "public/data.json";
      const branch = "data";
      
      // 최신 SHA값 획득 (API 사용)
      const getFileRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`, {
        headers: { "Authorization": `token ${githubToken}` }
      });
      
      let sha = "";
      if (getFileRes.ok) {
        const fileData = await getFileRes.json();
        sha = fileData.sha;
      }

      // 데이터 인코딩 (UTF-8 대응)
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
          sha: sha,
          branch: branch
        })
      });

      if (updateRes.ok) {
        localStorage.setItem('shortsgameData', JSON.stringify(newData));
        return { success: true };
      } else {
        const errData = await updateRes.json();
        return { success: false, message: errData.message };
      }
    } catch (error) {
      return { success: false, message: error.toString() };
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
    <AppContext.Provider value={{ siteData, updateData, isLoading }}>
      {children}
    </AppContext.Provider>
  );
};
