#!/usr/bin/env python3
"""결(Kyeol) 홈페이지 페이지 생성기.

tools/pages/*.html (본문) + 공통 헤더·푸터 → site/ 아래 정적 HTML.
회사 정보·메뉴는 아래 SITE 값만 바꾸면 전 페이지에 반영됩니다.

    python3 tools/build.py
"""
import html, pathlib, re

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / "tools" / "pages"
OUT = ROOT / "site"

SITE = {
    "name": "결",
    "name_en": "Kyeol",
    "url": "https://kyeol.win",
    "ga": "G-VVX6KY12MW",
    "email": "support@kyeol.win",
    "ceo": "박찬욱",
    # 아래 값은 채우면 푸터에 자동 표시 (비워 두면 숨김)
    "biz_no": "",        # 사업자등록번호 예: 000-00-00000
    "ecom_no": "",       # 통신판매업 신고번호 예: 제2026-서울노원-0000호
    "address": "",       # 사업장 주소
}

NAV = [("/", "홈"), ("/#games", "게임"), ("/#news", "소식"), ("/support/", "고객지원")]

LOGO = """<svg viewBox="0 0 32 32" aria-hidden="true"><rect x="1" y="1" width="30" height="30" rx="9" fill="#e9d8b4"/>
<path d="M6 11c4-3 8 3 12 0s6-2 8-1M6 16.5c4-3 8 3 12 0s6-2 8-1M6 22c4-3 8 3 12 0s6-2 8-1" fill="none" stroke="#0d0c11" stroke-width="2" stroke-linecap="round"/></svg>"""


def head(meta):
    title = meta["title"]
    desc = meta.get("desc", "")
    path = meta.get("path", "/")
    og = meta.get("og", "/img/og-kyeol.jpg")
    theme = meta.get("theme_color", "#0d0c11")
    extra = meta.get("head", "")
    return f"""<!doctype html>
<html lang="ko" class="no-js">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{html.escape(title)}</title>
<meta name="description" content="{html.escape(desc)}">
<link rel="canonical" href="{SITE['url']}{path}">
<meta name="theme-color" content="{theme}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="결 Kyeol">
<meta property="og:title" content="{html.escape(title)}">
<meta property="og:description" content="{html.escape(desc)}">
<meta property="og:url" content="{SITE['url']}{path}">
<meta property="og:image" content="{SITE['url']}{og}">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/img/apple-touch-icon.png">
<link rel="stylesheet" href="/assets/site.css">
<script async src="https://www.googletagmanager.com/gtag/js?id={SITE['ga']}"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){{dataLayer.push(arguments);}}gtag('js',new Date());gtag('config','{SITE['ga']}');</script>
{extra}
</head>
"""


def header(active):
    cur = ' aria-current="page"'
    links = "".join(f'<a href="{h}"{cur if h == active else ""}>{t}</a>' for h, t in NAV)
    return f"""<body class="{{BODY}}">
<a class="skip" href="#main">본문 바로가기</a>
<header class="hd">
  <div class="wrap">
    <a class="logo" href="/" aria-label="결 Kyeol 홈">{LOGO}<span>결 <small>KYEOL</small></span></a>
    <button class="menu-btn" aria-label="메뉴" aria-expanded="false" aria-controls="nav"><span></span><span></span><span></span></button>
    <nav class="nav" id="nav" aria-label="주요 메뉴">{links}</nav>
  </div>
</header>
<main id="main">
"""


def footer():
    info = [("상호", f"{SITE['name']}({SITE['name_en']})"), ("대표", SITE["ceo"])]
    if SITE["biz_no"]:
        info.append(("사업자등록번호", SITE["biz_no"]))
    if SITE["ecom_no"]:
        info.append(("통신판매업 신고", SITE["ecom_no"]))
    if SITE["address"]:
        info.append(("주소", SITE["address"]))
    info.append(("이메일", f'<a href="mailto:{SITE["email"]}">{SITE["email"]}</a>'))
    dl = "".join(f"<div><dt>{k}</dt><dd>{v}</dd></div>" for k, v in info)
    return f"""</main>
<footer class="ft">
  <div class="wrap">
    <div class="row">
      <a class="logo" href="/" aria-label="결 Kyeol 홈">{LOGO}<span>결 <small>KYEOL</small></span></a>
      <nav class="links" aria-label="정책">
        <a href="/terms/">이용약관</a>
        <a class="strong" href="/privacy/">개인정보처리방침</a>
        <a href="/youth/">청소년보호정책</a>
        <a href="/support/">고객지원</a>
      </nav>
    </div>
    <dl>{dl}</dl>
    <p class="copy">© <span data-year>2026</span> Kyeol. All rights reserved.</p>
  </div>
</footer>
<script src="/assets/site.js" defer></script>
</body>
</html>
"""


def parse(src):
    """첫 HTML 주석 블록을 key: value 메타로 읽음."""
    m = re.match(r"\s*<!--(.*?)-->\s*", src, re.S)
    meta = {}
    for line in m.group(1).strip().splitlines():
        k, _, v = line.partition(":")
        meta[k.strip()] = v.strip()
    return meta, src[m.end():]


def main():
    for p in sorted(SRC.glob("*.html")):
        meta, body = parse(p.read_text(encoding="utf-8"))
        page = head(meta) + header(meta.get("nav", "")).replace("{BODY}", meta.get("body", "")) + body + footer()
        page = page.replace("{EMAIL}", SITE["email"])
        dest = OUT / meta["out"]
        dest.parent.mkdir(parents=True, exist_ok=True)
        dest.write_text(page, encoding="utf-8")
        print("✓", dest.relative_to(ROOT))


if __name__ == "__main__":
    main()
