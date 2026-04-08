import React, { createContext, useState, useEffect } from 'react';

// === 데이터베이스 초기값 설정 (가장 처음에만 사용) === 
const defaultData = {
  heroTitle: "차원이 다른 도파민 퍼즐, Dopamine Smith",
  heroSubtitle: "ShortsGame이 선보이는 첫 번째 마스터피스. 대장장이 키우기와 퍼즐의 완벽한 조화.",
  snsLinks: { youtube: "https://youtube.com/@shortsgame", twitter: "https://twitter.com/shortsgame" },
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

  // 1. 앱 시작 시 깃허브 서버에 저장된 진짜 장부(data.json)를 읽어옵니다.
  useEffect(() => {
    const loadData = async () => {
      try {
        // 배포된 사이트의 data.json 경로에서 데이터를 가져옵니다.
        const response = await fetch(`${import.meta.env.BASE_URL}data.json?t=${Date.now()}`); // 캐시 방지용 시간 추가
        if (response.ok) {
          const cloudData = await response.json();
          setSiteData(prev => ({
            ...defaultData,
            ...cloudData,
            snsLinks: { ...defaultData.snsLinks, ...(cloudData.snsLinks || {}) }
          }));
        } else {
          // 서버에 없으면 로컬 스토리지라도 뒤져봅니다 (임시)
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

  // 2. 깃허브 서버(Repository)에 데이터를 직접 전송하여 저장하는 핵심 로직
  const syncToGithubServer = async (newData, githubToken) => {
    if (!githubToken) {
      console.warn("깃허브 토큰이 없어 로컬에만 저장됩니다.");
      localStorage.setItem('shortsgameData', JSON.stringify(newData));
      return { success: false, message: "토큰이 없습니다." };
    }

    try {
      const owner = "wook-44";
      const repo = "shortsgame_homepage";
      const path = "public/data.json";
      
      // 가. 기존 파일의 '고유 식별자(sha)'를 먼저 알아내야 수정이 가능합니다.
      const getFileRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
        headers: { "Authorization": `token ${githubToken}` }
      });
      
      let sha = "";
      if (getFileRes.ok) {
        const fileData = await getFileRes.json();
        sha = fileData.sha;
      }

      // 나. 파일 내용을 깃허브가 이해할 수 있게 변환(Base64)하여 전송합니다.
      const content = btoa(unescape(encodeURIComponent(JSON.stringify(newData, null, 2))));
      const updateRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
        method: "PUT",
        headers: {
          "Authorization": `token ${githubToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: "운영툴: 사이트 데이터 업데이트",
          content: content,
          sha: sha,
          branch: "main" // 메인 브랜치에 직접 커밋
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
    
    // 토큰이 인자로 넘어오면 깃허브 실시간 동기화 진행
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
