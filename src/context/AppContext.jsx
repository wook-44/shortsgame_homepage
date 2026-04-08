import React, { createContext, useState, useEffect } from 'react';

// === 데이터베이스 초기값 설정 === 
const defaultData = {
  heroTitle: "차원이 다른 도파민 퍼즐, Dopamine Smith",
  heroSubtitle: "ShortsGame이 선보이는 첫 번째 마스터피스. 대장장이 키우기와 퍼즐의 완벽한 조화.",
  snsLinks: { youtube: "https://youtube.com/@shortsgame", twitter: "https://twitter.com/shortsgame" },
  companyInfo: "회사명: ShortsGame | 대표: 무명 | 이메일: contact@shortsgame.com",
  newsFeeds: [
    { id: 1, date: "2026. 04. 08", title: "도파민 스미스, 시스템 개편!", content: "짜릿한 손맛을 경험해 보세요." }
  ],
  // 서브 관리자 목록 (비밀번호 포함!)
  subAdmins: [
    { id: 1, role: "운영팀", username: "manager01", password: "123" }
  ]
};

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [siteData, setSiteData] = useState(() => {
    // 실제 깃허브 배포 시에는 여기서 fetch를 통해 외부 json을 불러옵니다.
    // 현재는 로컬 테스트 및 데모용 브라우저 저장소 연동
    const saved = localStorage.getItem('shortsgameData');
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...defaultData,
        ...parsed,
        newsFeeds: parsed.newsFeeds || defaultData.newsFeeds,
        subAdmins: parsed.subAdmins || defaultData.subAdmins,
        snsLinks: { ...defaultData.snsLinks, ...(parsed.snsLinks || {}) }
      };
    }
    return defaultData;
  });

  useEffect(() => {
    localStorage.setItem('shortsgameData', JSON.stringify(siteData));
  }, [siteData]);

  // 깃허브 서버에 저장하는 통신 로직 (추후 Github 토큰 연동 시 이곳에서 작동)
  const syncToGithubServer = async (newData) => {
    /* 
      // 깃허브 API를 사용해 데이터를 강제로 업데이트하는 코드 (주석 처리됨)
      // 토큰 및 저장소 이름이 있어야 작동하므로, 기능 테스트 후 활성화 가능
      const token = localStorage.getItem('github_token');
      const encodedData = btoa(unescape(encodeURIComponent(JSON.stringify(newData))));
      await fetch('https://api.github.com/repos/내아이디/내저장소/contents/public/data.json', { ... })
    */
    console.log("Github 자동 배포 구조로 데이터가 전송되었습니다.");
  };

  const updateData = (newData) => {
    setSiteData(prev => {
      const updated = { ...prev, ...newData };
      syncToGithubServer(updated); // 수정 시 가상 서버 동기화 호출
      return updated;
    });
  };

  return (
    <AppContext.Provider value={{ siteData, updateData }}>
      {children}
    </AppContext.Provider>
  );
};
