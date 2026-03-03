/* =========================
데이터 (추가/수정은 여기만)
========================= */

const order = [
  "e1","e2","e3","e4","e5","e6","p25","e7","e8","e13",
  "p28","p26","p27","p31","p29","p30","e9","e10",
  "e14","e15","e16","e17","e18","e19","e20","e21",
  "e22","e23","e24","p32","p33","p34"
];

const captions = {
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

const editorialOrder = ["e1","e2","e3","e4","e5","e6","e7","e8","e13","e9","e10","e14","e15","e16","e17","e18","e19","e20","e21","e22","e23","e24"];
const personalOrder  = ["p25","p28","p26","p27","p31","p29","p30","p32","p33","p34"];

/* Comics cover list (페이지에 일렬로 나열되는 큰 파일) */
const comicsCovers = ["c1.png","c8.png","c15.png","c23.png"];

/* 각 커버 클릭 시 넘겨볼 페이지들 */
const comicsBooks = {
  "c1.png":  Array.from({length:6}, (_,i)=>`c${i+2}.jpeg`),          // c2~c7
  "c8.png":  Array.from({length:6}, (_,i)=>`c${i+9}.jpeg`),          // c9~c14
  "c15.png": Array.from({length:7}, (_,i)=>`c${i+16}.jpeg`),         // c16~c22
  "c23.png": Array.from({length:19},(_,i)=>`c${i+24}.jpeg`)          // c24~c42
};

/* =========================
DOM
========================= */
const gallery = document.getElementById("gallery");
const thumbsInner = document.getElementById("thumbsInner");

const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");

const categoryModal = document.getElementById("categoryModal");
const cmClose = document.getElementById("cmClose");
const cmImg = document.getElementById("cmImg");
const cmCaption = document.getElementById("cmCaption");
const cmThumbs = document.getElementById("cmThumbs");
const cmHitLeft = document.getElementById("cmHitLeft");
const cmHitRight = document.getElementById("cmHitRight");

const comicsModal = document.getElementById("comicsModal");
const comicsClose = document.getElementById("comicsClose");
const comicsList = document.getElementById("comicsList");

const bookModal = document.getElementById("bookModal");
const bookClose = document.getElementById("bookClose");
const bookImg = document.getElementById("bookImg");
const bookPrev = document.getElementById("bookPrev");
const bookNext = document.getElementById("bookNext");

const meModal = document.getElementById("meModal");
const meClose = document.getElementById("meClose");
const copyMail = document.getElementById("copyMail");
const toast = document.getElementById("toast");

const homeBtn = document.getElementById("homeBtn");

const hamburger = document.getElementById("hamburger");
const mobilePanel = document.getElementById("mobilePanel");
const mobileComicsList = document.getElementById("mobileComicsList");

/* =========================
유틸
========================= */
function imgPath(idOrFile){
  // 갤러리/썸네일은 jpg / 코믹스는 png/jpeg 혼용
  if (idOrFile.endsWith(".png") || idOrFile.endsWith(".jpeg") || idOrFile.endsWith(".jpg")) {
    return `images/${idOrFile}`;
  }
  return `images/${idOrFile}.jpg`;
}

function thumbPath(id){
  const num = id.replace(/[a-z]/g,"");
  return `images/s${num}.jpg`;
}

/* =========================
갤러리 생성
========================= */
order.forEach((id)=>{
  const item = document.createElement("section");
  item.className = "item";
  item.id = id;

  const cap = document.createElement("div");
  cap.className = "cap";
  cap.textContent = captions[id] || "";
  item.appendChild(cap);

  const img = document.createElement("img");
  img.src = imgPath(id);
  img.alt = id;
  item.appendChild(img);

  gallery.appendChild(item);

  // 라이트박스(메인 갤러리)
  img.addEventListener("click", ()=>{
    openLightbox(img.src);
  });

  // 오른쪽 썸네일
  const t = document.createElement("img");
  t.src = thumbPath(id);
  t.alt = `thumb-${id}`;
  t.dataset.target = id;
  t.addEventListener("click", ()=>{
    document.getElementById(id).scrollIntoView({behavior:"smooth", block:"center"});
  });
  thumbsInner.appendChild(t);
});

/* 등장 애니메이션 */
const io = new IntersectionObserver((entries)=>{
  entries.forEach(en=>{
    if(en.isIntersecting) en.target.classList.add("show");
  });
},{threshold:0.12});
document.querySelectorAll(".item").forEach(el=>io.observe(el));

/* =========================
라이트박스
========================= */
function openLightbox(src){
  lightbox.style.display = "flex";
  lightbox.setAttribute("aria-hidden","false");
  lightboxImg.src = src;
}
function closeLightbox(){
  lightbox.style.display = "none";
  lightbox.setAttribute("aria-hidden","true");
  lightboxImg.src = "";
}

lightbox.addEventListener("click", closeLightbox);
document.addEventListener("keydown",(e)=>{
  if(e.key === "Escape"){
    if(lightbox.style.display === "flex") closeLightbox();
    if(categoryModal.style.display === "block") closeCategoryModal();
    if(comicsModal.style.display === "block") closeComicsModal();
    if(bookModal.style.display === "flex") closeBookModal();
    if(meModal.style.display === "flex") closeMeModal();
    if(mobilePanel.style.display === "block") closeMobilePanel();
  }
});

/* =========================
우클릭 방지
========================= */
document.addEventListener("contextmenu",(e)=>e.preventDefault());

/* =========================
썸네일 ↔ 갤러리 연동 (JITTER 방지)
- 스크롤 중 매번 smooth 하지 않고, "active가 바뀔 때만" 즉시 이동
========================= */
const galleryItems = Array.from(document.querySelectorAll(".item"));
const thumbImgs = Array.from(thumbsInner.querySelectorAll("img"));

let activeIndex = 0;
let ticking = false;

function setActiveThumb(idx){
  if(idx === activeIndex) return;
  activeIndex = idx;

  thumbImgs.forEach((img,i)=>img.classList.toggle("active", i===idx));

  const t = thumbImgs[idx];
  if(!t) return;

  // 중앙으로 맞추되, smooth 사용 안함(흔들림 방지)
  const container = thumbsInner;
  const targetTop = t.offsetTop - (container.clientHeight/2) + (t.clientHeight/2);
  container.scrollTo({top: Math.max(0, targetTop), behavior:"auto"});
}

window.addEventListener("scroll", ()=>{
  if(ticking) return;
  ticking = true;
  requestAnimationFrame(()=>{
    let idx = 0;
    for(let i=0;i<galleryItems.length;i++){
      const rect = galleryItems[i].getBoundingClientRect();
      if(rect.top < window.innerHeight * 0.5) idx = i;
    }
    setActiveThumb(idx);
    ticking = false;
  });
});

/* =========================
HOME 버튼: 첫 화면(맨 위)로
========================= */
homeBtn.addEventListener("click", ()=>{
  window.scrollTo({top:0, behavior:"smooth"});
});

/* =========================
카테고리 클릭
- e / p : 슬라이드 모달(썸네일바 포함)
- comics : comics 오버레이
- me : memyme 팝업
========================= */
document.querySelectorAll(".cat").forEach(el=>{
  el.addEventListener("click", ()=>{
    const type = el.dataset.open;

    if(type === "e"){
      openCategoryModal("e");
    }else if(type === "p"){
      openCategoryModal("p");
    }else if(type === "comics"){
      openComicsModal();
    }else if(type === "me"){
      openMeModal();
    }
  });
});

/* =========================
Category Modal (Editorial/Personal)
- 화면 왼/오른 여백 클릭으로 이동
- X / ESC 닫기
- 하단 썸네일(100px, bottom 15px)
========================= */
let cmList = [];
let cmIndex = 0;

function openCategoryModal(type){
  cmList = (type === "e") ? editorialOrder : personalOrder;
  cmIndex = 0;

  categoryModal.style.display = "block";
  categoryModal.setAttribute("aria-hidden","false");

  buildCategoryThumbs();
  renderCategoryModal();
}

function closeCategoryModal(){
  categoryModal.style.display = "none";
  categoryModal.setAttribute("aria-hidden","true");
  cmThumbs.innerHTML = "";
}

function renderCategoryModal(){
  const id = cmList[cmIndex];
  if(!id) return;

  cmImg.src = imgPath(id);
  cmCaption.textContent = captions[id] || "";

  // active thumb
  const thumbs = Array.from(cmThumbs.querySelectorAll("img"));
  thumbs.forEach((t,i)=>t.classList.toggle("active", i===cmIndex));

  // active thumb를 화면 가운데로
  const active = thumbs[cmIndex];
  if(active){
    const left = active.offsetLeft - (cmThumbs.clientWidth/2) + (active.clientWidth/2);
    cmThumbs.scrollTo({left: Math.max(0,left), behavior:"auto"});
  }
}

function buildCategoryThumbs(){
  cmThumbs.innerHTML = "";
  cmList.forEach((id, i)=>{
    const t = document.createElement("img");
    t.src = thumbPath(id);
    t.alt = `thumb-${id}`;
    t.addEventListener("click", ()=>{
      cmIndex = i;
      renderCategoryModal();
    });
    cmThumbs.appendChild(t);
  });
}

function prevCategory(){
  cmIndex = (cmIndex - 1 + cmList.length) % cmList.length;
  renderCategoryModal();
}
function nextCategory(){
  cmIndex = (cmIndex + 1) % cmList.length;
  renderCategoryModal();
}

cmClose.addEventListener("click", closeCategoryModal);

// “화살표 대신”: 화면 좌/우 클릭으로 이동
cmHitLeft.addEventListener("click", prevCategory);
cmHitRight.addEventListener("click", nextCategory);

// 이미지/캡션 영역 클릭 시엔 이동하지 않게(원하면 여기 제거 가능)
categoryModal.addEventListener("click", (e)=>{
  // 바깥 클릭은 닫기(단, hit영역 클릭은 이동이니까 제외)
  if(e.target === categoryModal) closeCategoryModal();
});

// 키보드 이동
document.addEventListener("keydown",(e)=>{
  if(categoryModal.style.display !== "block") return;
  if(e.key === "ArrowLeft") prevCategory();
  if(e.key === "ArrowRight") nextCategory();
});

/* =========================
Comics (새창 느낌 오버레이)
- 카테고리 고정은 원래 fixed라 그대로 유지됨
- 갤러리+썸네일 영역만 바뀌는 느낌
========================= */
function openComicsModal(){
  comicsModal.style.display = "block";
  comicsModal.setAttribute("aria-hidden","false");
  comicsList.innerHTML = "";

  comicsCovers.forEach((file)=>{
    const img = document.createElement("img");
    img.src = imgPath(file);
    img.alt = file;

    img.addEventListener("click", ()=>{
      // 책 넘김(가벼운 슬라이드)
      const pages = comicsBooks[file] || [];
      if(pages.length) openBookModal(pages);
    });

    comicsList.appendChild(img);
  });
}

function closeComicsModal(){
  comicsModal.style.display = "none";
  comicsModal.setAttribute("aria-hidden","true");
}
comicsClose.addEventListener("click", closeComicsModal);
comicsModal.addEventListener("click",(e)=>{
  if(e.target === comicsModal) closeComicsModal();
});

/* =========================
Book viewer
- 좌/우 클릭/ESC/바깥 클릭 닫기
- 마지막 페이지에서 다음 눌러도 계속 루프 말고: 아무데나 클릭시 닫힘(요구)
========================= */
let bookPages = [];
let bookIndex = 0;

function openBookModal(pages){
  bookPages = pages.slice();
  bookIndex = 0;
  bookModal.style.display = "flex";
  bookModal.setAttribute("aria-hidden","false");
  renderBook();
}
function renderBook(){
  const file = bookPages[bookIndex];
  bookImg.src = imgPath(file);
}
function closeBookModal(){
  bookModal.style.display = "none";
  bookModal.setAttribute("aria-hidden","true");
  bookImg.src = "";
  bookPages = [];
  bookIndex = 0;
}

function bookPrevPage(){
  if(bookIndex <= 0){
    // 첫 페이지에서 이전은 그냥 닫아도 됨(원하면 루프 가능)
    closeBookModal();
    return;
  }
  bookIndex--;
  renderBook();
}
function bookNextPage(){
  if(bookIndex >= bookPages.length - 1){
    // 마지막 페이지까지 끝나고 아무곳이나 클릭시 꺼짐 -> 다음 시도하면 닫기
    closeBookModal();
    return;
  }
  bookIndex++;
  renderBook();
}

bookClose.addEventListener("click", closeBookModal);
bookPrev.addEventListener("click", bookPrevPage);
bookNext.addEventListener("click", bookNextPage);

bookModal.addEventListener("click",(e)=>{
  if(e.target === bookModal) closeBookModal();
});

document.addEventListener("keydown",(e)=>{
  if(bookModal.style.display !== "flex") return;
  if(e.key === "ArrowLeft") bookPrevPage();
  if(e.key === "ArrowRight") bookNextPage();
});

/* =========================
ME WINDOW: open/close, drag, scroll lock, hotspots, copy toast
========================= */

const meModal = document.getElementById("meModal");
const meCard = document.getElementById("meCard") || document.querySelector("#meModal .me-card");
const meTitlebar = document.getElementById("meTitlebar");
const meClose = document.getElementById("meClose");
const copyMail = document.getElementById("copyMail");
const toast = document.getElementById("toast");

// (중요) hot 링크들이 실제로 존재하는지 잡아둠 (디버그 겸)
const hotLinks = Array.from(document.querySelectorAll("#meModal a.hot"));

let prevBodyOverflow = "";
let prevHtmlOverflow = "";

/** 배경 스크롤 잠금 */
function lockBackgroundScroll() {
  prevBodyOverflow = document.body.style.overflow;
  prevHtmlOverflow = document.documentElement.style.overflow;
  document.body.style.overflow = "hidden";
  document.documentElement.style.overflow = "hidden";
}

/** 배경 스크롤 복구 */
function unlockBackgroundScroll() {
  document.body.style.overflow = prevBodyOverflow || "";
  document.documentElement.style.overflow = prevHtmlOverflow || "";
}

/** 열기 */
function openMeModal() {
  if (!meModal || !meCard) return;

  meModal.style.display = "block";
  meModal.setAttribute("aria-hidden", "false");
  lockBackgroundScroll();
}

/** 닫기 */
function closeMeModal() {
  if (!meModal) return;

  meModal.style.display = "none";
  meModal.setAttribute("aria-hidden", "true");
  toast?.classList.remove("show");
  unlockBackgroundScroll();
}

/* ===== 닫기 동작 ===== */
meClose?.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();
  closeMeModal();
});

// 오버레이(바깥) 클릭 시 닫기
meModal?.addEventListener("click", (e) => {
  if (e.target === meModal) closeMeModal();
});

// 카드 내부 클릭은 오버레이로 새지 않게
meCard?.addEventListener("click", (e) => {
  e.stopPropagation();
});

/* ===== 휠/스크롤 이벤트가 뒤로 새는 문제 해결 =====
   - 모달 위에서 wheel이 발생하면 기본 스크롤(=body 스크롤)을 막고
   - 스크롤은 me-scroll 영역에서만 일어나게 함
*/
const meScroll = document.querySelector("#meModal .me-scroll");

// passive:false 필수(그래야 preventDefault가 먹음)
meModal?.addEventListener(
  "wheel",
  (e) => {
    // 모달 위에서 휠 돌리면 배경 스크롤은 무조건 차단
    e.preventDefault();

    // 스크롤 영역이 있으면 그쪽으로 스크롤 전달
    if (meScroll) {
      meScroll.scrollTop += e.deltaY;
    }
  },
  { passive: false }
);

/* ===== 링크(바로가기) 클릭이 안 되는 문제 대비 =====
   - a.hot이 클릭되면 무조건 새 탭으로 열리게(브라우저 기본도 되지만, 이벤트 꼬임 대비)
*/
hotLinks.forEach((a) => {
  a.addEventListener("click", (e) => {
    e.stopPropagation(); // 오버레이 클릭 닫기 등에 먹히지 않게
    // 기본 동작을 막지 않음: a 기본으로도 열리게 두되,
    // 어떤 환경에서 기본이 막히면 보조로 open 시도
    const url = a.getAttribute("href");
    if (!url) return;
    // window.open은 팝업 차단될 수 있지만, 클릭 이벤트 내라 대부분 허용됨
    window.open(url, "_blank", "noopener,noreferrer");
  });
});

/* ===== 이메일 복사 ===== */
copyMail?.addEventListener("click", async (e) => {
  e.preventDefault();
  e.stopPropagation();
  try {
    await navigator.clipboard.writeText("mybrowncat53@gmail.com");
    toast?.classList.add("show");
    setTimeout(() => toast?.classList.remove("show"), 900);
  } catch (err) {
    alert("Copy failed");
  }
});

/* ===== 드래그로 창 이동 ===== */
let dragging = false;
let startX = 0;
let startY = 0;
let startLeft = 0;
let startTop = 0;

meTitlebar?.addEventListener("mousedown", (e) => {
  // 닫기 버튼 눌렀을 때는 드래그 시작하면 안 됨
  if (e.target === meClose) return;

  dragging = true;
  startX = e.clientX;
  startY = e.clientY;

  const rect = meCard.getBoundingClientRect();
  startLeft = rect.left;
  startTop = rect.top;

  document.body.style.userSelect = "none";
});

window.addEventListener("mousemove", (e) => {
  if (!dragging) return;

  const dx = e.clientX - startX;
  const dy = e.clientY - startY;

  let nextLeft = startLeft + dx;
  let nextTop = startTop + dy;

  // 화면 밖으로 날아가지 않게 최소한의 제한
  const margin = 10;
  const maxLeft = window.innerWidth - meCard.offsetWidth - margin;
  const maxTop = window.innerHeight - 60; // 아래쪽 여유

  nextLeft = Math.max(margin, Math.min(maxLeft, nextLeft));
  nextTop = Math.max(margin, Math.min(maxTop, nextTop));

  meCard.style.left = `${nextLeft}px`;
  meCard.style.top = `${nextTop}px`;
});

window.addEventListener("mouseup", () => {
  if (!dragging) return;
  dragging = false;
  document.body.style.userSelect = "";
});

/* ===== ESC로 닫기(선택) ===== */
document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  if (meModal?.style.display === "block") closeMeModal();
});

/* ===== 기존 카테고리 클릭 로직과 연결 =====
   네 코드에서 "me" 눌렀을 때 openMeModal()을 호출하도록 되어 있어야 함.
   (이미 그렇게 되어 있으면 이 줄은 필요 없음)
*/
window.openMeModal = openMeModal;
window.closeMeModal = closeMeModal;

/* =========================
모바일: 햄버거 -> Me 패널
- 어디든 탭하면 닫힘
- comics는 리스트만 일렬로(뷰어 없이) 요구 반영: cover들만 보여줌
========================= */
function openMobilePanel(){
  mobilePanel.style.display = "block";
  mobilePanel.setAttribute("aria-hidden","false");
}
function closeMobilePanel(){
  mobilePanel.style.display = "none";
  mobilePanel.setAttribute("aria-hidden","true");
}
hamburger.addEventListener("click",(e)=>{
  e.stopPropagation();
  openMobilePanel();
});
mobilePanel.addEventListener("click", closeMobilePanel);

// 모바일 코믹스 리스트(cover만)
function buildMobileComics(){
  if(!mobileComicsList) return;
  mobileComicsList.innerHTML = "";
  comicsCovers.forEach((file)=>{
    const img = document.createElement("img");
    img.src = imgPath(file);
    img.alt = file;
    mobileComicsList.appendChild(img);
  });
}
buildMobileComics();
