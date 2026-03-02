/* =========================
  데이터: 한 곳에서 관리
========================= */

// 갤러리 전체 순서(요구 순서 그대로)
const GALLERY_ORDER = [
  "e1","e2","e3","e4","e5","e6","p25","e7","e8","e13",
  "p28","p26","p27","p31","p29","p30","e9","e10",
  "e14","e15","e16","e17","e18","e19","e20","e21",
  "e22","e23","e24","p32","p33","p34"
];

// 캡션(갤러리 상단, 카테고리 뷰어 하단에도 동일 사용)
const CAPTIONS = {
  e1: "Cover of the Sharjah International Book Fair Anthology 2023",
  e2: "Interior Pages of the Sharjah International Book Fair Anthology 2023",
  e3: "magazin pleasant place 2023",
  e4: "magazin pleasant place 2023",
  e5: "magazin pleasant place 2023",
  e6: "magazin pleasant place 2023",
  p25:"personal work",
  e7: "Purunsoop Publishing Book cover. 2023",
  e8: "산울림(Sanullim)’s 50th-anniversary remake project 2025",
  e13:"magazine tools Interior Illustrations 2024",
  p28:"personal work",
  p26:"personal work",
  p27:"personal work",
  p31:"personal work",
  p29:"personal work",
  p30:"personal work",
  e9: "Amorepacific beauty curation book on 70 years of Korean beauty./rawpressbooks 2022",
  e10:"Amorepacific beauty curation book on 70 years of Korean beauty./rawpressbooks 2022",
  e14:"Maybooks Publishing Interior Illustrations/Column Illustrations for BEMINOR 2023",
  e15:"Maybooks Publishing Interior Illustrations/Column Illustrations for BEMINOR 2023",
  e16:"Maybooks Publishing Interior Illustrations/Column Illustrations for BEMINOR 2023",
  e17:"Maybooks Publishing Interior Illustrations/Column Illustrations for BEMINOR 2023",
  e18:"Maybooks Publishing Interior Illustrations/Column Illustrations for BEMINOR 2023",
  e19:"Minumsa Publishing Book Cover and Interior 2021",
  e20:"Minumsa Publishing Book Cover and Interior 2021",
  e21:"McSweeney's Interior Illustrations 2021",
  e22:"FFL Publishing mind graph magazine article. 2021",
  e23:"Mimesis. The cover and illustrations for the novel 2018",
  e24:"Mimesis. The cover and illustrations for the novel 2018",
  p32:"personal work",
  p33:"personal work",
  p34:"personal work"
};

// 카테고리별 뷰어 순서(요구 순서 그대로)
const EDITORIAL_ORDER = ["e1","e2","e3","e4","e5","e6","e7","e8","e13","e9","e10","e14","e15","e16","e17","e18","e19","e20","e21","e22","e23","e24"];
const PERSONAL_ORDER   = ["p25","p28","p26","p27","p31","p29","p30","p32","p33","p34"];

// Comics 페이지(표지) 순서
const COMICS_COVERS = ["c1","c8","c15","c23"];

// Comics 책 넘김 범위
const COMICS_BOOKS = [
  { cover: "c1",  pages: rangeIds("c", 2, 7)  },
  { cover: "c8",  pages: rangeIds("c", 9, 14) },
  { cover: "c15", pages: rangeIds("c", 16, 22)},
  { cover: "c23", pages: rangeIds("c", 24, 42)}
];

function rangeIds(prefix, start, end){
  const out = [];
  for(let i=start;i<=end;i++) out.push(prefix + i);
  return out;
}

/* =========================
  파일 경로 규칙(확장자)
  - 여기만 바꾸면 전체 적용
========================= */
function imgSrc(id){
  // 예: e1.jpg, p25.jpg, c1.jpg
  return `${id}.jpg`;
}
function thumbSrc(id){
  // 예: s13.jpg, s25.jpg
  const num = id.replace(/[^\d]/g, "");
  return `s${num}.jpg`;
}

/* =========================
  DOM
========================= */
const $ = (sel, parent=document) => parent.querySelector(sel);
const $$ = (sel, parent=document) => Array.from(parent.querySelectorAll(sel));

const galleryEl = $("#gallery");
const thumbRailEl = $("#thumbRail");

const lightboxEl = $("#lightbox");
const lightboxImg = $("#lightboxImg");

const viewerEl = $("#viewer");
const viewerImg = $("#viewerImg");
const viewerCaption = $("#viewerCaption");
const viewerThumbs = $("#viewerThumbs");

const comicsPageEl = $("#comicsPage");
const comicsListEl = $("#comicsList");

const bookEl = $("#book");
const bookImg = $("#bookImg");

const meModalEl = $("#meModal");
const toastEl = $("#toast");

const hamburgerEl = $("#hamburger");
const mobileMenuEl = $("#mobileMenu");
const mobileComicsListEl = $("#mobileComicsList");

let currentViewerList = [];
let viewerIndex = 0;

let currentBookPages = [];
let bookIndex = 0;

/* =========================
  공통: 다운로드 방지(완전 방지는 불가하지만 우클릭/드래그 기본 차단)
========================= */
document.addEventListener("contextmenu", (e) => e.preventDefault());
document.addEventListener("dragstart", (e) => e.preventDefault());

/* ESC로 닫기 */
document.addEventListener("keydown", (e) => {
  if(e.key !== "Escape") return;
  closeLightbox();
  closeViewer();
  closeBook();
  closeMe();
  closeMobileMenu();
});

/* =========================
  갤러리 렌더
========================= */
function renderGallery(){
  galleryEl.innerHTML = "";

  for(const id of GALLERY_ORDER){
    const item = document.createElement("section");
    item.className = "gItem";
    item.dataset.id = id;

    const cap = document.createElement("div");
    cap.className = "gCap";
    cap.textContent = CAPTIONS[id] || "";

    const img = document.createElement("img");
    img.className = "gImg";
    img.alt = CAPTIONS[id] || id;
    img.loading = "lazy";
    img.src = imgSrc(id);
    img.dataset.id = id;

    // 클릭: 라이트박스
    img.addEventListener("click", () => openLightbox(img.src, img.alt));

    item.appendChild(cap);
    item.appendChild(img);
    galleryEl.appendChild(item);
  }

  // 스크롤 애니메이션(아래에서 위로 스윽)
  const io = new IntersectionObserver((entries) => {
    for(const ent of entries){
      if(ent.isIntersecting) ent.target.classList.add("in");
    }
  }, { threshold: 0.15 });

  $$(".gItem", galleryEl).forEach(el => io.observe(el));
}

/* =========================
  썸네일 레일 렌더 + 갤러리 연동
========================= */
let activeId = null;

function renderThumbRail(){
  thumbRailEl.innerHTML = "";

  for(const id of GALLERY_ORDER){
    const btn = document.createElement("button");
    btn.className = "thumbBtn";
    btn.type = "button";
    btn.dataset.target = id;

    const img = document.createElement("img");
    img.src = thumbSrc(id);
    img.alt = `thumb ${id}`;
    img.loading = "lazy";

    btn.appendChild(img);

    btn.addEventListener("click", () => {
      scrollToGalleryId(id);
    });

    thumbRailEl.appendChild(btn);
  }

  // 갤러리에서 현재 보이는 이미지와 연동(IntersectionObserver)
  const items = $$(".gItem", galleryEl);
  const obs = new IntersectionObserver((entries) => {
    // 가장 많이 보이는 항목 선택
    const visible = entries
      .filter(e => e.isIntersecting)
      .sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
    if(!visible) return;
    const id = visible.target.dataset.id;
    setActiveThumb(id, { smooth: true });
  }, { root: null, threshold: [0.2, 0.4, 0.6, 0.8] });

  items.forEach(el => obs.observe(el));
}

function scrollToGalleryId(id){
  const target = $(`.gItem[data-id="${id}"]`, galleryEl);
  if(!target) return;
  target.scrollIntoView({ behavior: "smooth", block: "start" });
  setActiveThumb(id, { smooth: true });
}

function setActiveThumb(id, {smooth=false} = {}){
  if(activeId === id) return;
  activeId = id;

  $$(".thumbBtn", thumbRailEl).forEach(b => {
    b.classList.toggle("active", b.dataset.target === id);
  });

  const btn = $(`.thumbBtn[data-target="${id}"]`, thumbRailEl);
  if(btn){
    btn.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "center" });
  }
}

/* =========================
  라이트박스
========================= */
function openLightbox(src, alt=""){
  // 모바일/데스크탑 공통: 검정 90% + 살짝 떠있는 느낌
  lightboxImg.src = src;
  lightboxImg.alt = alt;
  lightboxEl.classList.add("show");
  lightboxEl.setAttribute("aria-hidden", "false");
}
function closeLightbox(){
  if(!lightboxEl.classList.contains("show")) return;
  lightboxEl.classList.remove("show");
  lightboxEl.setAttribute("aria-hidden", "true");
}
document.addEventListener("click", (e) => {
  const action = e.target?.dataset?.action;
  if(action === "closeLightbox") closeLightbox();
});

/* =========================
  카테고리 뷰어(Editorial/Personal)
========================= */
function openCategoryViewer(cat){
  currentViewerList = (cat === "editorial") ? EDITORIAL_ORDER : PERSONAL_ORDER;
  viewerIndex = 0;

  // 첫 파일로 연결
  showViewerAt(0);

  // 썸네일 슬라이더 생성
  viewerThumbs.innerHTML = "";
  currentViewerList.forEach((id, idx) => {
    const b = document.createElement("button");
    b.className = "vThumb";
    b.type = "button";
    b.dataset.idx = String(idx);

    const im = document.createElement("img");
    im.src = thumbSrc(id);
    im.alt = `thumb ${id}`;
    b.appendChild(im);

    b.addEventListener("click", () => showViewerAt(idx, {syncThumb:true}));
    viewerThumbs.appendChild(b);
  });

  viewerEl.classList.add("show");
  viewerEl.setAttribute("aria-hidden", "false");
  syncViewerThumb();
}

function showViewerAt(idx, opts = {}){
  viewerIndex = (idx + currentViewerList.length) % currentViewerList.length;
  const id = currentViewerList[viewerIndex];

  viewerImg.src = imgSrc(id);
  viewerImg.alt = CAPTIONS[id] || id;
  viewerCaption.textContent = CAPTIONS[id] || "";

  syncViewerThumb();

  // “마지막 페이지까지 끝나고 아무곳이나 클릭시 꺼짐” 규칙은 comics book에만 적용
  // editorial/personal은 그냥 순환 이동
}

function syncViewerThumb(){
  $$(".vThumb", viewerThumbs).forEach(b => {
    b.classList.toggle("active", Number(b.dataset.idx) === viewerIndex);
  });
  const active = $(`.vThumb[data-idx="${viewerIndex}"]`, viewerThumbs);
  if(active){
    active.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }
}

function closeViewer(){
  if(!viewerEl.classList.contains("show")) return;
  viewerEl.classList.remove("show");
  viewerEl.setAttribute("aria-hidden", "true");
}

function prevViewer(){ showViewerAt(viewerIndex - 1); }
function nextViewer(){ showViewerAt(viewerIndex + 1); }

/* =========================
  Comics 페이지(영역 교체) + 책 넘김 뷰어
========================= */
function openComicsPage(){
  // 갤러리/썸네일 영역은 숨기고 comicsPage 표시
  $("#gallery").style.display = "none";
  $(".right").style.display = "none";
  comicsPageEl.classList.add("show");
  comicsPageEl.setAttribute("aria-hidden", "false");

  renderComicsList();
}

function goHome(){
  comicsPageEl.classList.remove("show");
  comicsPageEl.setAttribute("aria-hidden", "true");

  $("#gallery").style.display = "";
  $(".right").style.display = "";
  // top으로
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderComicsList(){
  comicsListEl.innerHTML = "";

  for(const coverId of COMICS_COVERS){
    const wrap = document.createElement("div");
    wrap.className = "comicsItem";

    const img = document.createElement("img");
    img.src = imgSrc(coverId);
    img.alt = coverId;
    img.loading = "lazy";

    img.addEventListener("click", () => {
      // 표지 클릭 -> 책 뷰어 (c1이면 c2~c7 ...)
      const book = COMICS_BOOKS.find(b => b.cover === coverId);
      if(!book) return;
      openBookViewer(book.pages);
    });

    wrap.appendChild(img);
    comicsListEl.appendChild(wrap);
  }
}

function openBookViewer(pages){
  currentBookPages = pages.slice();
  bookIndex = 0;
  bookEl.classList.add("show");
  bookEl.setAttribute("aria-hidden", "false");
  showBookAt(0);
}

function showBookAt(idx){
  // 마지막 페이지 넘긴 뒤(=끝) 아무곳이나 클릭 시 꺼짐 규칙:
  // 여기서는 “마지막 페이지에서 nextBook 실행되면 닫힘”으로 처리 + backdrop 클릭도 닫힘
  if(idx < 0) idx = 0;
  if(idx >= currentBookPages.length){
    closeBook();
    return;
  }
  bookIndex = idx;
  const id = currentBookPages[bookIndex];
  bookImg.src = imgSrc(id);
  bookImg.alt = id;
}

function prevBook(){
  showBookAt(bookIndex - 1);
}
function nextBook(){
  showBookAt(bookIndex + 1);
}
function closeBook(){
  if(!bookEl.classList.contains("show")) return;
  bookEl.classList.remove("show");
  bookEl.setAttribute("aria-hidden", "true");
}

/* =========================
  Me 팝업 + 투명버튼 좌표(픽셀 기반 -> 비율로 변환)
========================= */
function openMe(){
  meModalEl.classList.add("show");
  meModalEl.setAttribute("aria-hidden", "false");
  applyMeHitAreas();
}
function closeMe(){
  if(!meModalEl.classList.contains("show")) return;
  meModalEl.classList.remove("show");
  meModalEl.setAttribute("aria-hidden", "true");
}

/* 제공된 w/h/x/y는 “이미지(700x1983) 기준” 좌표로 해석해서 %로 세팅 */
function applyMeHitAreas(){
  const baseW = 700;
  const baseH = 1983;

  // 요구 좌표(픽셀처럼 보이지만 소수점 포함) → 비율 처리
  const hits = [
    { sel: ".me-hit.insta",   x: 13.7, y: 65.4, w: 158, h: 158 },
    { sel: ".me-hit.itsnice", x: 29.2, y: 65.4, w: 158, h: 158 },
    { sel: ".me-hit.behance", x: 45.4, y: 65.4, w: 158, h: 158 },
    { sel: ".me-hit.emailCopy", x: 28.6, y: 54.9, w: 538, h: 57 }
  ];

  // x,y 값이 “%”인지 “px”인지 애매하지만,
  // w/h가 158/538처럼 픽셀 크기로 명확해서,
  // x,y는 “이미지 폭 대비 % 위치”로 주어진 것으로 보고 처리:
  // left = x%, top = y%, width = (w/baseW)*100%, height=(h/baseH)*100%
  hits.forEach(h => {
    const el = $(h.sel, meModalEl);
    if(!el) return;

    el.style.left = `${h.x}%`;
    el.style.top  = `${h.y}%`;
    el.style.width  = `${(h.w / baseW) * 100}%`;
    el.style.height = `${(h.h / baseH) * 100}%`;
  });
}

/* =========================
  Mobile hamburger menu
========================= */
function openMobileMenu(){
  mobileMenuEl.classList.add("show");
  mobileMenuEl.setAttribute("aria-hidden", "false");
}
function closeMobileMenu(){
  if(!mobileMenuEl.classList.contains("show")) return;
  mobileMenuEl.classList.remove("show");
  mobileMenuEl.setAttribute("aria-hidden", "true");
}
hamburgerEl.addEventListener("click", openMobileMenu);

// 모바일 메뉴: 바깥 클릭하면 닫기
mobileMenuEl.addEventListener("click", (e) => {
  if(e.target === mobileMenuEl) closeMobileMenu();
  // 배경(::before) 때문에 target이 카드 밖인지 체크
  const card = $(".mobileMenu-card", mobileMenuEl);
  if(card && !card.contains(e.target)) closeMobileMenu();
});

function renderMobileComicsCovers(){
  mobileComicsListEl.innerHTML = "";
  COMICS_COVERS.forEach(id => {
    const img = document.createElement("img");
    img.src = imgSrc(id);
    img.alt = id;
    img.loading = "lazy";
    img.addEventListener("click", () => {
      // 모바일 요구: 뷰어 없이 리스트만 -> 터치하면 닫힘
      closeMobileMenu();
    });
    mobileComicsListEl.appendChild(img);
  });
}

/* =========================
  토스트
========================= */
let toastTimer = null;
function toast(msg){
  toastEl.textContent = msg;
  toastEl.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove("show"), 1200);
}

/* =========================
  이메일 복사
========================= */
async function copyEmail(){
  const email = "mybrowncat53@gmail.com";
  try{
    await navigator.clipboard.writeText(email);
    toast("Copied");
  }catch{
    // fallback
    const ta = document.createElement("textarea");
    ta.value = email;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
    toast("Copied");
  }
}

/* =========================
  이벤트 위임(버튼 data-action)
========================= */
document.addEventListener("click", (e) => {
  const action = e.target?.dataset?.action;
  if(!action) return;

  if(action === "goHome") goHome();

  if(action === "openCategory"){
    const cat = e.target.dataset.cat || e.target.closest("[data-cat]")?.dataset?.cat;
    if(cat === "editorial") openCategoryViewer("editorial");
    if(cat === "personal") openCategoryViewer("personal");
  }

  if(action === "openComicsPage") openComicsPage();

  if(action === "closeViewer") closeViewer();
  if(action === "prevViewer") prevViewer();
  if(action === "nextViewer") nextViewer();

  if(action === "closeBook") closeBook();
  if(action === "prevBook") prevBook();
  if(action === "nextBook") nextBook();

  if(action === "openMe") openMe();
  if(action === "closeMe") closeMe();

  if(action === "copyEmail") copyEmail();

  if(action === "closeMobileMenu") closeMobileMenu();
});

/* 배경 클릭으로 닫기 */
viewerEl.addEventListener("click", (e) => {
  if(e.target.classList.contains("viewer-backdrop")) closeViewer();
});
bookEl.addEventListener("click", (e) => {
  if(e.target.classList.contains("book-backdrop")) closeBook();
});
meModalEl.addEventListener("click", (e) => {
  if(e.target.classList.contains("me-backdrop")) closeMe();
});

/* =========================
  초기 실행
========================= */
renderGallery();
renderThumbRail();
renderMobileComicsCovers();

/* =========================
  자체 점검(중요한 구현 선택)
  - Personal works 이미지 폭을 “9000px”로 고정하면
    대부분 화면에서 불가능/역효과라서, viewer는 900px 기준으로 맞춤.
    (원본 해상도는 파일 자체가 크면 그대로 선명하게 보임)
  - “우클릭 다운로드 완전 차단”은 웹 특성상 100% 불가능하지만,
    contextmenu/dragstart 차단 + 라이트박스/뷰어 구조로 기본 다운로드를 어렵게 만들었음.
========================= */
