# kyeol.win — 결(Kyeol) 공식 홈페이지

정적 HTML 사이트. `main`에 푸시하면 GitHub Actions가 `site/`를 `gh-pages`로 배포 → kyeol.win

## 구조
| 경로 | 내용 |
|---|---|
| `tools/pages/*.html` | 페이지 본문 (맨 위 주석에 제목·설명·출력 경로) |
| `tools/build.py` | 공통 헤더·푸터를 붙여 `site/`에 HTML 생성 · **회사 정보(사업자번호 등)는 여기 `SITE`에서 수정** |
| `site/assets/` | 공통 CSS·JS |
| `site/img/` | 게임 이미지 (webp) |
| `site/riftseal/privacy`, `site/riftseal/delete` | 균열봉인 개인정보처리방침 · 계정 삭제 요청 (Play 콘솔 등록 URL — 경로 변경 금지) |
| `site/app-ads.txt`, `site/ads.txt` | AdMob / AdSense 인증 |

## 페이지
- `/` 홈 · `/riftseal/` 균열봉인! 마법소녀 · `/dopamine-smith/` 도파민 스미스
- `/support/` 고객지원 · `/privacy/` `/terms/` `/youth/` 정책

## 로컬 확인
```bash
python3 tools/build.py
cd site && python3 -m http.server 8000
```
