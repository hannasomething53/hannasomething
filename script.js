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
  "c1.png":  Array.from({length:6}, (_,i)=>`c${i+2}.jpg`),          // c2~c7
  "c8.png":  Array.from({length:6}, (_,i)=>`c${i+9}.jpg`),          // c9~c14
  "c15.png": Array.from({length:7}, (_,i)=>`c${i+16}.jpg`),         // c16~c22
  "c23.png": Array.from({length:19},(_,i)=>`c${i+24}.jpg`)          // c24~c42
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
  // 갤러리/썸네일은 jpg / 코믹스는 png/jpg 혼용
  if (idOrFile.endsWith(".png") || idOrFile.endsWith(".jpg") || idOrFile.endsWith(".jpg")) {
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
ME WINDOW (isolated): open/close, drag, scroll lock, hotspots, copy toast
- 변수명 충돌 방지 버전
========================= */
(() => {
  const meModalEl = document.getElementById("meModal");
  const meCardEl = document.getElementById("meCard") || document.querySelector("#meModal .me-card");
  const meTitlebarEl = document.getElementById("meTitlebar");
  const meCloseEl = document.getElementById("meClose");
  const copyMailEl = document.getElementById("copyMail");
  const toastEl = document.getElementById("toast");
  const meScrollEl = document.querySelector("#meModal .me-scroll");
  const hotLinkEls = Array.from(document.querySelectorAll("#meModal a.hot"));

  if (!meModalEl || !meCardEl) {
    // 요소가 없으면 조용히 종료 (다른 기능 망가뜨리지 않음)
    return;
  }

  let prevBodyOverflow = "";
  let prevHtmlOverflow = "";

  function lockBg() {
    prevBodyOverflow = document.body.style.overflow;
    prevHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
  }

  function unlockBg() {
    document.body.style.overflow = prevBodyOverflow || "";
    document.documentElement.style.overflow = prevHtmlOverflow || "";
  }

  function openMeModal() {
    meModalEl.style.display = "block";
    meModalEl.setAttribute("aria-hidden", "false");
    lockBg();
  }

  function closeMeModal() {
    meModalEl.style.display = "none";
    meModalEl.setAttribute("aria-hidden", "true");
    toastEl?.classList.remove("show");
    unlockBg();
  }

  // 닫기 버튼
  meCloseEl?.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    closeMeModal();
  });

  // 바깥 클릭 닫기
  meModalEl.addEventListener("click", (e) => {
    if (e.target === meModalEl) closeMeModal();
  });

  // 카드 내부 클릭은 바깥으로 전파 금지
  meCardEl.addEventListener("click", (e) => e.stopPropagation());

  // 휠: 배경 스크롤 차단 + meScroll만 스크롤
  meModalEl.addEventListener(
    "wheel",
    (e) => {
      e.preventDefault();
      if (meScrollEl) meScrollEl.scrollTop += e.deltaY;
    },
    { passive: false }
  );

  // 링크: 클릭 시 새 탭 보강
  hotLinkEls.forEach((a) => {
    a.addEventListener("click", (e) => {
      e.stopPropagation();
      const url = a.getAttribute("href");
      if (!url) return;
      window.open(url, "_blank", "noopener,noreferrer");
    });
  });

  // 이메일 복사
  copyMailEl?.addEventListener("click", async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText("mybrowncat53@gmail.com");
      toastEl?.classList.add("show");
      setTimeout(() => toastEl?.classList.remove("show"), 900);
    } catch (err) {
      alert("Copy failed");
    }
  });

  // 드래그 이동
  let dragging = false;
  let startX = 0, startY = 0, startLeft = 0, startTop = 0;

  meTitlebarEl?.addEventListener("mousedown", (e) => {
    if (e.target === meCloseEl) return;
    dragging = true;
    startX = e.clientX;
    startY = e.clientY;

    const rect = meCardEl.getBoundingClientRect();
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

    const margin = 10;
    const maxLeft = window.innerWidth - meCardEl.offsetWidth - margin;
    const maxTop = window.innerHeight - 60;

    nextLeft = Math.max(margin, Math.min(maxLeft, nextLeft));
    nextTop = Math.max(margin, Math.min(maxTop, nextTop));

    meCardEl.style.left = `${nextLeft}px`;
    meCardEl.style.top = `${nextTop}px`;
  });

  window.addEventListener("mouseup", () => {
    if (!dragging) return;
    dragging = false;
    document.body.style.userSelect = "";
  });

  // ESC 닫기
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (meModalEl.style.display === "block") closeMeModal();
  });

  // 기존 카테고리 클릭 로직에서 openMeModal()을 부를 수 있게 전역으로 노출
  window.openMeModal = openMeModal;
  window.closeMeModal = closeMeModal;
})();

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
