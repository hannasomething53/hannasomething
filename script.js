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

/* Comics cover list (세로로 큰 이미지 리스트) */
const comicsCovers = ["c1.png","c8.png","c15.png","c23.png"];

/* 각 커버 클릭 시 넘겨볼 페이지들 (pages는 .jpg 확정) */
const comicsBooks = {
  "c1.png":  Array.from({length:6}, (_,i)=>`c${i+2}.jpg`),           // c2~c7
  "c8.png":  Array.from({length:6}, (_,i)=>`c${i+9}.jpg`),           // c9~c14
  "c15.png": Array.from({length:7}, (_,i)=>`c${i+16}.jpg`),          // c16~c22
  "c23.png": Array.from({length:19},(_,i)=>`c${i+24}.jpg`)           // c24~c42
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
/* ✅ 여기(바로 아래)에 넣기 */
function setComicsLeft(){
  const cat = document.getElementById("category");
  if(!cat || !comicsModal) return;

  const r = cat.getBoundingClientRect();
  const gap = 100;
  comicsModal.style.left = Math.round(r.right + gap) + "px";
}

/* ✅ 그 다음에 openComicsModal */
function openComicsModal(){
  document.getElementById("gallery").style.display = "none";
  document.getElementById("thumbs").style.display = "none";

  comicsModal.style.display = "block";
  setComicsLeft();
  window.addEventListener("resize", setComicsLeft);

  comicsModal.setAttribute("aria-hidden","false");
}
const bookModal = document.getElementById("bookModal");
const bookClose = document.getElementById("bookClose");
const bookImg = document.getElementById("bookImg");
const bookPrev = document.getElementById("bookPrev");
const bookNext = document.getElementById("bookNext");

const homeBtn = document.getElementById("homeBtn");

/* (Me는 지금 문제 없다고 했으니 여기서 건드리지 않음)
   단, ESC 처리에서 참조하는 closeMeModal() 같은 것만 있으면 삭제/정리 필요.
*/
/* =========================
Me Modal 기능
========================= */

const meModal = document.getElementById("meModal");
const meClose = document.getElementById("meClose");
const meTitlebar = document.getElementById("meTitlebar");
const copyMailBtn = document.getElementById("copyMail");
const toast = document.getElementById("toast");

/* =========================
Me hotspots hover toast: "click!"
========================= */

let toastLock = false;  // Copied가 뜨는 동안 hover가 덮어쓰지 못하게 잠금

function showToastAt(clientX, clientY, text){
  if(!toast || !meModal) return;

  // Copied 띄우는 중이면 hover 토스트는 무시
  if(toastLock) return;

  const wrap = meModal.querySelector(".me-wrap");
  if(!wrap) return;

  const rect = wrap.getBoundingClientRect();

  // me-wrap 안에서의 좌표로 변환
  const x = clientX - rect.left;
  const y = clientY - rect.top;

  toast.textContent = text;

  // 마우스 근처로 띄우기(살짝 위로)
  toast.style.left = `${Math.max(10, Math.min(rect.width - 10, x))}px`;
  toast.style.top  = `${Math.max(10, y - 18)}px`;
  toast.style.transform = "translate(-50%, -100%)";

  toast.classList.add("show");
}

function hideToast(){
  if(!toast) return;
  if(toastLock) return;   // Copied 띄우는 중이면 숨기지 않음
  toast.classList.remove("show");
}

// ✅ Me 안의 모든 핫스팟에 hover 이벤트 걸기
const meHotspots = Array.from(document.querySelectorAll("#meModal .hot"));

meHotspots.forEach((el)=>{
  el.addEventListener("mouseenter", (e)=>{
    showToastAt(e.clientX, e.clientY, "click!");
  });

  // 움직일 때 토스트가 따라오게(원하면 빼도 됨)
  el.addEventListener("mousemove", (e)=>{
    showToastAt(e.clientX, e.clientY, "click!");
  });

  el.addEventListener("mouseleave", ()=>{
    hideToast();
  });
});
function openMeModal(){
  meModal.style.display = "block";
  meModal.setAttribute("aria-hidden","false");
}

function closeMeModal(){
  meModal.style.display = "none";
  meModal.setAttribute("aria-hidden","true");
}

window.openMeModal = openMeModal;

meClose?.addEventListener("click", closeMeModal);

meModal?.addEventListener("click",(e)=>{
  if(e.target === meModal) closeMeModal();
});

/* 이메일 복사 (lock 포함) */
copyMailBtn?.addEventListener("click",(e)=>{
  e.stopPropagation();
  const email = "mybrowncat53@gmail.com";

  const done = ()=>{
    if(!toast) return;

    toastLock = true;
    toast.textContent = "Copied";
    toast.classList.add("show");

    setTimeout(()=>{
      toast.classList.remove("show");
      toastLock = false;
    },900);
  };

  if(navigator.clipboard?.writeText){
    navigator.clipboard.writeText(email).then(done).catch(done);
  }else{
    const ta = document.createElement("textarea");
    ta.value = email;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
    done();
  }
});

/* 드래그 이동 */
let dragging = false;
let startX=0,startY=0,baseLeft=0,baseTop=0;

const card = meModal?.querySelector(".me-card");

meTitlebar?.addEventListener("mousedown",(e)=>{
  dragging=true;

  startX=e.clientX;
  startY=e.clientY;

  const rect=card.getBoundingClientRect();
  baseLeft=rect.left;
  baseTop=rect.top;
});

window.addEventListener("mousemove",(e)=>{
  if(!dragging) return;

  const dx=e.clientX-startX;
  const dy=e.clientY-startY;

  card.style.left=(baseLeft+dx)+"px";
  card.style.top=(baseTop+dy)+"px";
});

window.addEventListener("mouseup",()=>{
  dragging=false;
});

/* =========================
유틸
========================= */
function imgPath(idOrFile){
  // idOrFile이 확장자를 이미 갖고 있으면 그대로
  if (idOrFile.endsWith(".png") || idOrFile.endsWith(".jpg")) {
    return `images/${idOrFile}`;
  }
  // 갤러리 id는 기본 jpg로 로드 (네 e/p 파일들이 jpg라고 했으니)
  return `images/${idOrFile}.jpg`;
}

function thumbPath(id){
  // 네 썸네일은 s숫자.jpg 가정
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

  // 오른쪽 썸네일 (클릭은 유지)
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

/* =========================
우클릭 방지
========================= */
document.addEventListener("contextmenu",(e)=>e.preventDefault());

/* =========================
썸네일 ↔ 갤러리 연동
- "오토스크롤(thumbsInner.scrollTo)" 제거 완료
- active 표시만 유지
========================= */
const galleryItems = Array.from(document.querySelectorAll(".item"));
const thumbImgs = Array.from(thumbsInner.querySelectorAll("img"));

let activeIndex = 0;
let ticking = false;

function setActiveThumb(idx){
  if(idx === activeIndex) return;
  activeIndex = idx;
  thumbImgs.forEach((img,i)=>img.classList.toggle("active", i===idx));
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
homeBtn?.addEventListener("click", ()=>{
  window.scrollTo({top:0, behavior:"smooth"});
});

/* =========================
카테고리 클릭
- e / p : 슬라이드 모달(하단 썸네일바)
- comics : comics 오버레이
- me : (기존 너 코드 그대로 쓰는 걸 권장)
========================= */
document.querySelectorAll(".cat").forEach(el=>{
  el.addEventListener("click", ()=>{
    const type = el.dataset.open;

    if(type === "e"){
      if(comicsModal?.style.display === "block") closeComicsModal(); // ✅ 추가
      openCategoryModal("e");
    }else if(type === "p"){
      if(comicsModal?.style.display === "block") closeComicsModal(); // ✅ 추가
      openCategoryModal("p");
    }else if(type === "comics"){
      openComicsModal();
    }else if(type === "me"){
      
      if (typeof openMeModal === "function") openMeModal();
      else if (window.openMeModal) window.openMeModal();
    }
  });
});

/* =========================
Category Modal (Editorial/Personal) - FIXED
- 썸네일 클릭 정확
- active 썸네일이 cmThumbs 안에서만 보이도록 오토스크롤(=필요 기능)
- Editorial/Personal 둘 다 동일 적용
========================= */
let cmList = [];
let cmIndex = 0;

function openCategoryModal(type){
  cmList = (type === "e") ? editorialOrder : personalOrder;

  if(!cmList || cmList.length === 0){
    console.warn("[CategoryModal] list empty:", type);
    return;
  }

  cmIndex = 0;
  categoryModal.style.display = "block";
  categoryModal.setAttribute("aria-hidden","false");

  buildCategoryThumbs();
  renderCategoryModal(true);

  // ✅ 처음 열 때 썸네일바 시작 위치를 왼쪽으로
  cmThumbs.scrollLeft = 0;
}

function closeCategoryModal(){
  categoryModal.style.display = "none";
  categoryModal.setAttribute("aria-hidden","true");
  cmThumbs.innerHTML = "";
}

function renderCategoryModal(instant){
  const id = cmList[cmIndex];
  if(!id) return;

  // 큰 이미지/캡션
  cmImg.src = imgPath(id);
  cmCaption.textContent = captions[id] || "";

  // active 표시
  const thumbs = Array.from(cmThumbs.querySelectorAll("img"));
  thumbs.forEach((t,i)=>t.classList.toggle("active", i===cmIndex));

  // ✅ 너가 원한 기능: "다음 썸네일이 자동으로 보이게"
  const active = thumbs[cmIndex];
  if(active){
    const left = active.offsetLeft - (cmThumbs.clientWidth/2) + (active.clientWidth/2);
    cmThumbs.scrollTo({
      left: Math.max(0, left),
      behavior: instant ? "auto" : "smooth"
    });
  }
}

function buildCategoryThumbs(){
  cmThumbs.innerHTML = "";

  cmList.forEach((id, i)=>{
    const t = document.createElement("img");
    t.src = thumbPath(id);
    t.alt = `thumb-${id}`;

    t.addEventListener("click", (e)=>{
      e.stopPropagation(); // ✅ 바깥 클릭/좌우 hit로 새지 않게
      cmIndex = i;
      renderCategoryModal(false);
    });

    cmThumbs.appendChild(t);
  });

  // ✅ 썸네일 바 영역 클릭은 모달 바깥 클릭으로 전파 금지
  cmThumbs.addEventListener("click", (e)=>e.stopPropagation());
}

function prevCategory(){
  cmIndex = (cmIndex - 1 + cmList.length) % cmList.length;
  renderCategoryModal(false);
}
function nextCategory(){
  cmIndex = (cmIndex + 1) % cmList.length;
  renderCategoryModal(false);
}

cmClose.addEventListener("click", (e)=>{ e.stopPropagation(); closeCategoryModal(); });
cmHitLeft.addEventListener("click", (e)=>{ e.stopPropagation(); prevCategory(); });
cmHitRight.addEventListener("click", (e)=>{ e.stopPropagation(); nextCategory(); });

categoryModal.addEventListener("click", (e)=>{
  if(e.target === categoryModal) closeCategoryModal();
});

document.addEventListener("keydown",(e)=>{
  if(categoryModal.style.display !== "block") return;
  if(e.key === "ArrowLeft") prevCategory();
  if(e.key === "ArrowRight") nextCategory();
});

/* =========================
Comics (오버레이 리스트)
요구사항:
- 커버 이미지 폭: 700px 기준 (최대 700, 화면 작으면 줄어듦)
- 세로로 일렬 나열: c1.png, c8.png, c15.png, c23.png
- 간격 50px
- 이미지 위에서 스크롤 가능 (modal overflow)
- 이후 cover 추가 시 comicsCovers 배열에만 추가
========================= */
function openComicsModal(){
  console.log("OPEN COMICS CALLED FROM:", new Error().stack);
  document.getElementById("gallery").style.display = "none";   // 추가
  document.getElementById("thumbs").style.display = "none";    // 추가
  comicsModal.style.display = "block";
  setComicsLeft();
window.addEventListener("resize", setComicsLeft);
  comicsModal.setAttribute("aria-hidden","false");

  // ✅ 다른 모달이 열려 있으면 닫아 충돌 방지
  if(categoryModal?.style.display === "block") closeCategoryModal();
  if(lightbox?.style.display === "flex") closeLightbox();

  comicsList.innerHTML = "";

  comicsCovers.forEach((file)=>{
    const img = document.createElement("img");
    img.src = imgPath(file);
    img.alt = file;

    // ✅ 요구된 스타일(폭/간격) - CSS에 해도 되지만 여기서도 보장
    img.style.width = "min(700px, 92vw)";
    img.style.maxWidth = "700px";
    img.style.display = "block";
    img.style.margin = "0 auto 50px auto";

    img.addEventListener("click", ()=>{
      const pages = comicsBooks[file] || [];
      if(pages.length) openBookModal(pages);
    });

    comicsList.appendChild(img);
  });
}

function closeComicsModal(){
  comicsModal.style.display = "none";
  comicsModal.setAttribute("aria-hidden","true");
   document.getElementById("gallery").style.display = "";   // 추가
  document.getElementById("thumbs").style.display = "";    // 추가
  window.removeEventListener("resize", setComicsLeft); // ✅ 추가
}

comicsClose?.addEventListener("click", closeComicsModal);
comicsModal?.addEventListener("click",(e)=>{
  if(e.target === comicsModal) closeComicsModal();
});

/* =========================
Book viewer (코믹스 페이지 넘김)
요구사항:
- 검정 90% 오버레이
- 가로 1000px 고정(최대 1000, 화면 작으면 줄어듦)
- 좌/우 클릭(히트영역)으로 넘김
- esc / 바깥 클릭 닫힘
- 마지막 페이지에서 "다음" 누르면 닫힘
========================= */
let bookPages = [];
let bookIndex = 0;

function openBookModal(pages){
  bookPages = pages.slice();
  bookIndex = 0;

  bookModal.style.display = "flex";
  bookModal.setAttribute("aria-hidden","false");

  // ✅ comics 목록은 유지해도 되지만, 원하면 닫고 책만 띄우는 느낌을 위해 닫아도 됨
  // closeComicsModal();

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
    closeBookModal();
    return;
  }
  bookIndex--;
  renderBook();
}

function bookNextPage(){
  if(bookIndex >= bookPages.length - 1){
    closeBookModal();
    return;
  }
  bookIndex++;
  renderBook();
}

bookClose?.addEventListener("click", closeBookModal);
bookPrev?.addEventListener("click", (e)=>{ e.stopPropagation(); bookPrevPage(); });
bookNext?.addEventListener("click", (e)=>{ e.stopPropagation(); bookNextPage(); });

bookModal?.addEventListener("click",(e)=>{
  if(e.target === bookModal) closeBookModal();
});

document.addEventListener("keydown",(e)=>{
  if(e.key !== "Escape") return;

  // 라이트박스
  if(lightbox?.style.display === "flex") closeLightbox();

  // 에디토리얼/퍼스널
  if(categoryModal?.style.display === "block") closeCategoryModal();

  // 코믹스 리스트
  if(comicsModal?.style.display === "block") closeComicsModal();

  // 책 뷰어
  if(bookModal?.style.display === "flex") closeBookModal();

  // Me는 네가 문제 없다고 했으니 여기서는 강제로 안 건드림
  // (네 기존 closeMeModal이 있으면 거기서 처리)
});
