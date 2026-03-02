/* =========================
  0) 기본 정책: 우클릭/드래그 방지
  (완벽 차단은 불가하지만 기본 다운로드 UX는 막음)
========================= */
document.addEventListener("contextmenu", (e) => e.preventDefault());
document.addEventListener("dragstart", (e) => e.preventDefault());
document.addEventListener("touchstart", (e) => {
  // 모바일 롱프레스 저장 방지(일부 브라우저)
  if (e.touches && e.touches.length === 1) {
    // no-op
  }
}, { passive: true });

/* =========================
  1) 데이터(한 곳에서 관리)
========================= */

// 갤러리 전체 순서 (e/p는 모두 jpeg 파일)
const ORDER_ALL = [
  "e1","e2","e3","e4","e5","e6","p25","e7","e8","e13",
  "p28","p26","p27","p31","p29","p30","e9","e10",
  "e14","e15","e16","e17","e18","e19","e20","e21",
  "e22","e23","e24","p32","p33","p34"
];

// 캡션(갤러리 상단 + 뷰어 하단)
const TEXT = {
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

// 카테고리 뷰어 순서
const ORDER_E = ["e1","e2","e3","e4","e5","e6","e7","e8","e13","e9","e10","e14","e15","e16","e17","e18","e19","e20","e21","e22","e23","e24"];
const ORDER_P = ["p25","p28","p26","p27","p31","p29","p30","p32","p33","p34"];

// Comics (표지 png, 페이지 jpeg)
const COMICS_COVERS = ["c1","c8","c15","c23"];
const COMICS_BOOK = [
  { cover:"c1",  pages: makeSeq("c",2,7) },
  { cover:"c8",  pages: makeSeq("c",9,14) },
  { cover:"c15", pages: makeSeq("c",16,22) },
  { cover:"c23", pages: makeSeq("c",24,42) }
];
function makeSeq(prefix, a, b){
  const arr = [];
  for(let i=a;i<=b;i++) arr.push(prefix + i);
  return arr;
}

/* =========================
  2) 파일 로딩 규칙
  - e/p : 모두 .jpeg (요구사항)
  - c cover: .png
  - c pages: .jpeg
  - s thumbs: 확장자 섞일 수 있어 fallback
========================= */

const BASE = ""; // 폴더를 쓰면 "images/" 같은 식으로 바꿔

function pathEP(id){ return `${BASE}${id}.jpeg`; }
function pathComicsCover(id){ return `${BASE}${id}.png`; }
function pathComicsPage(id){ return `${BASE}${id}.jpeg`; }

// 썸네일은 s+숫자 규칙, 확장자 자동 시도
const TH_EXT = ["jpeg","jpg","png","webp","JPG","PNG","JPEG","WEBP"]; // 안전하게 대문자도 포함
const memoThumb = new Map();

function thumbBase(id){
  const n = String(id).replace(/[^\d]/g,"");
  return `s${n}`;
}

function setThumb(imgEl, id){
  const key = thumbBase(id);
  if(memoThumb.has(key)){
    imgEl.src = memoThumb.get(key);
    return;
  }
  let k = 0;
  const tryNext = () => {
    if(k >= TH_EXT.length){
      imgEl.removeEventListener("error", tryNext);
      return;
    }
    imgEl.src = `${BASE}${key}.${TH_EXT[k++]}`;
  };
  imgEl.addEventListener("error", tryNext);
  imgEl.addEventListener("load", () => {
    memoThumb.set(key, imgEl.currentSrc || imgEl.src);
    imgEl.removeEventListener("error", tryNext);
  }, { once:true });
  tryNext();
}

/* =========================
  3) DOM 유틸
========================= */
const $ = (q, p=document) => p.querySelector(q);
const $$ = (q, p=document) => Array.from(p.querySelectorAll(q));

const elGallery = $("#gallery");
const elRail = $("#thumbRail");

const elLB = $("#lb");
const elLBImg = $("#lbImg");

const elViewer = $("#viewer");
const elVImg = $("#vImg");
const elVCap = $("#vCap");
const elVThumbs = $("#vThumbs");

const elComicsPage = $("#comicsPage");
const elComicsList = $("#comicsList");

const elBook = $("#book");
const elBImg = $("#bImg");

const elMe = $("#me");
const elMeStage = $("#meStage");

const elToast = $("#toast");

const elHam = $("#mHam");
const elMMenu = $("#mMenu");
const elMComics = $("#mComics");

/* =========================
  4) 갤러리 생성 + 스크롤 애니메이션
========================= */
function buildGallery(){
  elGallery.innerHTML = "";
  ORDER_ALL.forEach(id => {
    const block = document.createElement("section");
    block.className = "g-block";
    block.dataset.id = id;

    const cap = document.createElement("p");
    cap.className = "g-cap";
    cap.textContent = TEXT[id] || "";

    const img = document.createElement("img");
    img.className = "g-img";
    img.alt = TEXT[id] || id;
    img.loading = "lazy";
    img.src = pathEP(id); // e/p는 jpeg 고정
    img.dataset.id = id;

    img.addEventListener("click", () => openLightbox(img.src, img.alt));

    block.appendChild(cap);
    block.appendChild(img);
    elGallery.appendChild(block);
  });

  const io = new IntersectionObserver((ents) => {
    ents.forEach(en => {
      if(en.isIntersecting) en.target.classList.add("in");
    });
  }, { threshold: 0.15 });

  $$(".g-block", elGallery).forEach(b => io.observe(b));
}

/* =========================
  5) 썸네일 레일 + 갤러리 연동
========================= */
let nowId = null;

function buildRail(){
  elRail.innerHTML = "";
  ORDER_ALL.forEach(id => {
    const b = document.createElement("button");
    b.className = "th-btn";
    b.type = "button";
    b.dataset.to = id;

    const im = document.createElement("img");
    im.alt = `thumb ${id}`;
    im.loading = "lazy";
    setThumb(im, id);

    b.appendChild(im);
    b.addEventListener("click", () => jumpTo(id));
    elRail.appendChild(b);
  });

  // 갤러리 스크롤 시 현재 아이템 추적
  const items = $$(".g-block", elGallery);
  const track = new IntersectionObserver((ents) => {
    const v = ents.filter(e => e.isIntersecting)
      .sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
    if(!v) return;
    activateThumb(v.target.dataset.id, true);
  }, { threshold: [0.2,0.4,0.6,0.8] });

  items.forEach(it => track.observe(it));
}

function jumpTo(id){
  const t = $(`.g-block[data-id="${id}"]`, elGallery);
  if(!t) return;
  t.scrollIntoView({ behavior:"smooth", block:"start" });
  activateThumb(id, true);
}

function activateThumb(id, smooth){
  if(nowId === id) return;
  nowId = id;
  $$(".th-btn", elRail).forEach(btn => {
    btn.classList.toggle("on", btn.dataset.to === id);
  });
  const on = $(`.th-btn[data-to="${id}"]`, elRail);
  if(on) on.scrollIntoView({ behavior: smooth ? "smooth":"auto", block:"center" });
}

/* =========================
  6) 라이트박스(검정 90%)
========================= */
function openLightbox(src, alt){
  elLBImg.src = src;
  elLBImg.alt = alt || "";
  elLB.classList.add("on");
  elLB.setAttribute("aria-hidden","false");
}
function closeLightbox(){
  if(!elLB.classList.contains("on")) return;
  elLB.classList.remove("on");
  elLB.setAttribute("aria-hidden","true");
}

/* =========================
  7) Editorial/Personal Viewer (ffff4 95%, 900px)
========================= */
let vList = [];
let vPos = 0;

function openViewer(kind){
  vList = (kind === "editorial") ? ORDER_E.slice() : ORDER_P.slice();
  vPos = 0;

  // 썸네일 생성
  elVThumbs.innerHTML = "";
  vList.forEach((id, idx) => {
    const b = document.createElement("button");
    b.className = "vt-btn";
    b.type = "button";
    b.dataset.idx = String(idx);

    const im = document.createElement("img");
    im.alt = `thumb ${id}`;
    setThumb(im, id);

    b.appendChild(im);
    b.addEventListener("click", () => showViewer(idx));
    elVThumbs.appendChild(b);
  });

  showViewer(0);

  elViewer.classList.add("on");
  elViewer.setAttribute("aria-hidden","false");
}

function showViewer(idx){
  const n = vList.length;
  vPos = (idx + n) % n;
  const id = vList[vPos];

  elVImg.src = pathEP(id); // e/p viewer도 jpeg
  elVImg.alt = TEXT[id] || id;
  elVCap.textContent = TEXT[id] || "";

  // 썸네일 하이라이트 + 중앙으로 스크롤
  $$(".vt-btn", elVThumbs).forEach(b => b.classList.toggle("on", Number(b.dataset.idx) === vPos));
  const on = $(`.vt-btn[data-idx="${vPos}"]`, elVThumbs);
  if(on) on.scrollIntoView({ behavior:"smooth", inline:"center", block:"nearest" });
}

function vPrev(){ showViewer(vPos - 1); }
function vNext(){ showViewer(vPos + 1); }
function vClose(){
  if(!elViewer.classList.contains("on")) return;
  elViewer.classList.remove("on");
  elViewer.setAttribute("aria-hidden","true");
}

/* =========================
  8) Comics 페이지(카테고리 고정, center/right 교체 느낌)
  - 데스크탑: gallery 숨기고 comicsPage 보여줌
  - 모바일: 요구사항대로 “뷰어 없이” 메뉴에서 표지만 보여주고 닫힘
========================= */
function openComics(){
  // 데스크탑만: 본문 전환
  if(window.matchMedia("(max-width: 900px)").matches){
    openMobileMenu(); // 모바일은 메뉴로
    return;
  }

  elGallery.style.display = "none";
  elComicsPage.classList.add("on");
  elComicsPage.setAttribute("aria-hidden","false");

  renderComicsList();
}

function goHome(){
  // comics에서 홈으로 돌아오기
  elComicsPage.classList.remove("on");
  elComicsPage.setAttribute("aria-hidden","true");
  elGallery.style.display = "";

  // 상단 이동
  window.scrollTo({ top:0, behavior:"smooth" });
}

function renderComicsList(){
  elComicsList.innerHTML = "";
  COMICS_COVERS.forEach(id => {
    const box = document.createElement("div");
    box.className = "comicsItem";

    const img = document.createElement("img");
    img.alt = id;
    img.loading = "lazy";
    img.src = pathComicsCover(id); // 표지는 png 고정

    img.addEventListener("click", () => {
      const set = COMICS_BOOK.find(x => x.cover === id);
      if(!set) return;
      openBook(set.pages);
    });

    box.appendChild(img);
    elComicsList.appendChild(box);
  });
}

/* =========================
  9) Comics Book viewer (검정 90%, 1000px)
  - 마지막 페이지 이후: 어디든 클릭/next 시 닫힘
========================= */
let bPages = [];
let bPos = 0;

function openBook(pages){
  bPages = pages.slice();
  bPos = 0;
  elBook.classList.add("on");
  elBook.setAttribute("aria-hidden","false");
  showBook(0);
}
function showBook(idx){
  if(idx < 0) idx = 0;
  if(idx >= bPages.length){
    closeBook();
    return;
  }
  bPos = idx;
  const id = bPages[bPos];
  elBImg.src = pathComicsPage(id); // comics page는 jpeg
  elBImg.alt = id;
}
function bPrev(){ showBook(bPos - 1); }
function bNext(){ showBook(bPos + 1); }
function closeBook(){
  if(!elBook.classList.contains("on")) return;
  elBook.classList.remove("on");
  elBook.setAttribute("aria-hidden","true");
}

/* =========================
  10) Me modal + 투명버튼 좌표(700x1983 기준)
  - x,y는 %로 주어졌다고 보고, w/h는 px로 주어졌다고 해석
  - w/h는 base 크기 대비 %로 변환
========================= */
function openMe(){
  elMe.classList.add("on");
  elMe.setAttribute("aria-hidden","false");
  applyHits();
}
function closeMe(){
  if(!elMe.classList.contains("on")) return;
  elMe.classList.remove("on");
  elMe.setAttribute("aria-hidden","true");
}

function applyHits(){
  const baseW = 700;
  const baseH = 1983;

  const list = [
    { sel: ".hit.insta",   x: 13.7, y: 65.4, w: 158, h: 158 },
    { sel: ".hit.itsnice", x: 29.2, y: 65.4, w: 158, h: 158 },
    { sel: ".hit.behance", x: 45.4, y: 65.4, w: 158, h: 158 },
    { sel: ".hit.emailcopy", x: 28.6, y: 54.9, w: 538, h: 57 },
  ];

  list.forEach(o => {
    const el = $(o.sel, elMeStage);
    if(!el) return;
    el.style.left = `${o.x}%`;
    el.style.top = `${o.y}%`;
    el.style.width = `${(o.w / baseW) * 100}%`;
    el.style.height = `${(o.h / baseH) * 100}%`;
  });
}

/* =========================
  11) 이메일 복사 + 토스트("Copied")
========================= */
let toastTimer = null;
function toast(msg){
  elToast.textContent = msg;
  elToast.classList.add("on");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => elToast.classList.remove("on"), 1200);
}

async function copyEmail(){
  const email = "mybrowncat53@gmail.com";
  try{
    await navigator.clipboard.writeText(email);
    toast("Copied");
  }catch{
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
  12) 모바일 햄버거 + comics 표지만 나열(뷰어 없음)
========================= */
function openMobileMenu(){
  elMMenu.classList.add("on");
  elMMenu.setAttribute("aria-hidden","false");
}
function closeMobileMenu(){
  if(!elMMenu.classList.contains("on")) return;
  elMMenu.classList.remove("on");
  elMMenu.setAttribute("aria-hidden","true");
}

function buildMobileComics(){
  elMComics.innerHTML = "";
  COMICS_COVERS.forEach(id => {
    const img = document.createElement("img");
    img.alt = id;
    img.loading = "lazy";
    img.src = pathComicsCover(id); // 모바일에서도 표지 png
    img.addEventListener("click", () => closeMobileMenu()); // 터치시 닫힘
    elMComics.appendChild(img);
  });
}

elHam.addEventListener("click", openMobileMenu);

/* =========================
  13) 이벤트 위임 (data-act)
========================= */
document.addEventListener("click", (e) => {
  const t = e.target;
  const act = t?.dataset?.act;
  if(!act) return;

  if(act === "lbClose") closeLightbox();

  if(act === "openViewer"){
    const kind = t.dataset.kind || t.closest("[data-kind]")?.dataset?.kind;
    if(kind) openViewer(kind);
  }
  if(act === "vClose") vClose();
  if(act === "vPrev") vPrev();
  if(act === "vNext") vNext();

  if(act === "openComics") openComics();
  if(act === "goHome") goHome();

  if(act === "bClose") closeBook();
  if(act === "bPrev") bPrev();
  if(act === "bNext") bNext();

  if(act === "openMe") openMe();
  if(act === "meClose") closeMe();

  if(act === "copyEmail") copyEmail();

  if(act === "mClose") closeMobileMenu();
});

/* 배경 클릭/ESC 닫기 */
document.addEventListener("keydown", (e) => {
  if(e.key !== "Escape") return;
  closeLightbox();
  vClose();
  closeBook();
  closeMe();
  closeMobileMenu();
});

/* book: 마지막 페이지에서 배경 포함 아무데나 클릭하면 닫히도록(요구) */
$("#book").addEventListener("click", (e) => {
  // 배경 클릭은 닫힘
  if(e.target.classList.contains("book-bg")) closeBook();
});

/* viewer 배경 클릭 닫기 */
$("#viewer").addEventListener("click", (e) => {
  if(e.target.classList.contains("viewer-bg")) vClose();
});

/* lightbox 배경 클릭 닫기 */
$("#lb").addEventListener("click", (e) => {
  if(e.target.classList.contains("lb-bg")) closeLightbox();
});

/* mobile 메뉴: 아무데나 탭하면 닫힘(카드 안 버튼은 제외하려면 여기 수정 가능) */
$("#mMenu").addEventListener("click", (e) => {
  if(e.target.classList.contains("m-menu-bg")) closeMobileMenu();
});

/* =========================
  14) 초기 실행
========================= */
buildGallery();
buildRail();
buildMobileComics();

/* 시작 시 첫 썸네일 활성화 */
activateThumb(ORDER_ALL[0], false);
