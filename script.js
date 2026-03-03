/* =========================
데이터(여기만 고치면 추가/관리 쉬움)
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
  e23:"Mimesis. The cover and illustrations for the novel  2018",
  e24:"Mimesis. The cover and illustrations for the novel  2018",
  p32:"personal work",
  p33:"personal work",
  p34:"personal work"
};

// id -> 파일명
const imgSrc = (id) => `${id}.jpeg`;

// 썸네일: e13 -> s13 / p25 -> s25 (요청 규칙)
function thumbIdFromWorkId(id){
  const num = id.replace(/\D/g, ""); // 숫자만
  return `s${num}`;
}
const thumbSrc = (id) => `${thumbIdFromWorkId(id)}.jpeg`;

/* =========================
DOM
========================= */
const galleryEl = document.getElementById("gallery");
const thumbsEl  = document.getElementById("thumbs");

const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");

const meModal = document.getElementById("meModal");
const meStage = document.getElementById("meStage");

const comicsModal = document.getElementById("comicsModal");

const toast = document.getElementById("toast");
const homeBtn = document.getElementById("homeBtn");

const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobileMenu");
const mobileComics = document.getElementById("mobileComics");

/* =========================
유틸
========================= */
function showToast(msg){
  toast.textContent = msg;
  toast.classList.add("show");
  window.clearTimeout(showToast._t);
  showToast._t = window.setTimeout(()=>toast.classList.remove("show"), 1200);
}

async function copyText(text){
  try{
    await navigator.clipboard.writeText(text);
    showToast("Copied!");
  }catch(e){
    // fallback
    const ta = document.createElement("textarea");
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    ta.remove();
    showToast("Copied!");
  }
}

/* =========================
갤러리/썸네일 렌더
========================= */
function render(){
  // gallery
  const fragG = document.createDocumentFragment();
  order.forEach((id)=>{
    const wrap = document.createElement("section");
    wrap.className = "gItem reveal";
    wrap.dataset.id = id;

    const cap = document.createElement("p");
    cap.className = "caption";
    cap.textContent = captions[id] || "";

    const img = document.createElement("img");
    img.className = "gImg clickable";
    img.src = imgSrc(id);
    img.alt = captions[id] || id;
    img.loading = "lazy";
    img.draggable = false;

    img.addEventListener("click", ()=>openLightbox(img.src, img.alt));

    wrap.appendChild(cap);
    wrap.appendChild(img);
    fragG.appendChild(wrap);
  });
  galleryEl.appendChild(fragG);

  // thumbs
  const fragT = document.createDocumentFragment();
  order.forEach((id)=>{
    const a = document.createElement("a");
    a.href = "#";
    a.className = "tItem clickable";
    a.dataset.target = id;

    const img = document.createElement("img");
    img.className = "tImg";
    img.src = thumbSrc(id);
    img.alt = `thumb ${id}`;
    img.loading = "lazy";
    img.draggable = false;

    a.appendChild(img);

    a.addEventListener("click", (e)=>{
      e.preventDefault();
      scrollToWork(id, true);
    });

    fragT.appendChild(a);
  });
  thumbsEl.appendChild(fragT);
}

/* =========================
스크롤/연동
========================= */
function scrollToWork(id, alsoSyncThumb){
  const el = galleryEl.querySelector(`.gItem[data-id="${id}"]`);
  if(!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });

  if(alsoSyncThumb){
    setActiveThumb(id, true);
  }
}

function setActiveThumb(id, autoScroll){
  const items = thumbsEl.querySelectorAll(".tItem");
  items.forEach(x => x.classList.toggle("isActive", x.dataset.target === id));

  if(autoScroll){
    const active = thumbsEl.querySelector(`.tItem[data-target="${id}"]`);
    if(active){
      // 썸네일 영역 가운데쯤 오도록 부드럽게 이동
      const box = thumbsEl.getBoundingClientRect();
      const ab = active.getBoundingClientRect();
      const delta = (ab.top + ab.height/2) - (box.top + box.height/2);
      thumbsEl.scrollBy({ top: delta, behavior: "smooth" });
    }
  }
}

// 갤러리 스크롤 시 현재 보이는 작품을 썸네일과 연동
function bindScrollSync(){
  const items = [...galleryEl.querySelectorAll(".gItem")];
  let ticking = false;

  function onScroll(){
    if(ticking) return;
    ticking = true;
    requestAnimationFrame(()=>{
      ticking = false;

      // viewport 상단 근처에 가장 가까운 item 찾기
      let best = null;
      let bestDist = Infinity;

      const topLine = 90; // 살짝 여유
      items.forEach((it)=>{
        const r = it.getBoundingClientRect();
        const dist = Math.abs(r.top - topLine);
        if(dist < bestDist){
          bestDist = dist;
          best = it;
        }
      });

      if(best){
        const id = best.dataset.id;
        setActiveThumb(id, true);
      }
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

/* =========================
리빌 애니메이션(IntersectionObserver)
========================= */
function bindReveal(){
  const io = new IntersectionObserver((entries)=>{
    entries.forEach((en)=>{
      if(en.isIntersecting){
        en.target.classList.add("isVisible");
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll(".reveal").forEach(el=>io.observe(el));
}

/* =========================
라이트박스
========================= */
function openLightbox(src, alt){
  lightboxImg.src = src;
  lightboxImg.alt = alt || "";
  lightbox.classList.add("show");
  lightbox.setAttribute("aria-hidden", "false");
}

function closeLightbox(){
  lightbox.classList.remove("show");
  lightbox.setAttribute("aria-hidden", "true");
  lightboxImg.src = "";
}

lightbox.addEventListener("click", (e)=>{
  // 배경 클릭 시 닫힘(이미지 자체 클릭은 닫히지 않게)
  if(e.target === lightbox) closeLightbox();
});

/* =========================
Me 모달 + 핫스팟
좌표 해석:
- x, y는 % (이미지 기준 위치)
- w, h는 px (이미지 700x1983 고정이므로 그대로)
========================= */
function openMe(){
  meModal.classList.add("show");
  meModal.setAttribute("aria-hidden", "false");
}

function closeMe(){
  meModal.classList.remove("show");
  meModal.setAttribute("aria-hidden", "true");
}

function clearMeHotspots(){
  meStage.querySelectorAll(".hotspot").forEach(n=>n.remove());
}

function addHotspot({ w, h, x, y, onClick, href }){
  const btn = document.createElement(href ? "a" : "button");
  btn.className = "hotspot clickable";
  btn.style.width = `${w}px`;
  btn.style.height = `${h}px`;
  btn.style.left = `${x}%`;
  btn.style.top = `${y}%`;
  btn.style.transform = "translate(-50%, -50%)";

  if(href){
    btn.href = href;
    btn.target = "_blank";
    btn.rel = "noopener";
  }else{
    btn.type = "button";
    btn.addEventListener("click", onClick);
  }

  meStage.appendChild(btn);
}

function buildMeHotspots(){
  clearMeHotspots();

  // instagram
  addHotspot({
    w: 158, h: 158, x: 13.7, y: 65.4,
    href: "https://www.instagram.com/hanna_something/"
  });

  // behance
  addHotspot({
    w: 158, h: 158, x: 45.4, y: 65.4,
    href: "https://www.behance.net/hibyhanna3e0f"
  });

  // itsnicethat
  addHotspot({
    w: 158, h: 158, x: 29.2, y: 65.4,
    href: "https://www.itsnicethat.com/articles/hanna-something-illustration-020920"
  });

  // copy email area
  addHotspot({
    w: 538, h: 57, x: 28.6, y: 54.9,
    onClick: ()=>copyText("mybrowncat53@gmail.com")
  });
}

meModal.addEventListener("click", (e)=>{
  if(e.target === meModal) closeMe();
});

/* =========================
Comics 모달(데스크탑)
========================= */
function openComics(){
  comicsModal.classList.add("show");
  comicsModal.setAttribute("aria-hidden", "false");
}
function closeComics(){
  comicsModal.classList.remove("show");
  comicsModal.setAttribute("aria-hidden", "true");
}
comicsModal.addEventListener("click", (e)=>{
  if(e.target === comicsModal) closeComics();
});

/* =========================
카테고리 동작
- Editorial/Personal: 해당 그룹 첫 이미지로 점프
- Me: memyme 모달
- Comics: comics 모달
- Email: 복사 + 토스트
- Home: 최상단
========================= */
function firstIdByPrefix(prefix){
  return order.find(id => id.startsWith(prefix));
}

document.addEventListener("click", (e)=>{
  const btn = e.target.closest("[data-action]");
  if(!btn) return;

  const action = btn.dataset.action;

  if(action === "jump"){
    const target = btn.dataset.target;
    const id = target === "editorial" ? firstIdByPrefix("e")
             : target === "personal" ? firstIdByPrefix("p")
             : null;
    if(id) scrollToWork(id, true);
  }

  if(action === "me"){
    buildMeHotspots();
    openMe();
  }

  if(action === "comics"){
    openComics();
  }

  if(action === "copyEmail"){
    copyText("mybrowncat53@gmail.com");
  }
});

homeBtn.addEventListener("click", ()=>{
  window.scrollTo({ top: 0, behavior: "smooth" });
});

/* =========================
모바일 햄버거 메뉴
- 카테고리/썸네일 없이 갤러리만 보임(CSS)
- 햄버거 누르면 메뉴
- 화면 아무데나 클릭하면 닫힘
- Comics 누르면 c1 c8 c15 c23 리스트 표시
========================= */
function openMobileMenu(){
  mobileMenu.classList.add("show");
  mobileMenu.setAttribute("aria-hidden", "false");
}
function closeMobileMenu(){
  mobileMenu.classList.remove("show");
  mobileMenu.setAttribute("aria-hidden", "true");
  mobileComics.hidden = true;
}

hamburger.addEventListener("click", (e)=>{
  e.stopPropagation();
  openMobileMenu();
});

mobileMenu.addEventListener("click", ()=>{
  // “아무 곳이나 클릭하면 사라짐”
  closeMobileMenu();
});

mobileMenu.addEventListener("click", (e)=>{
  const item = e.target.closest("[data-mobile-action]");
  if(!item) return;
  e.stopPropagation();

  const act = item.dataset.mobileAction;

  if(act === "me"){
    closeMobileMenu();
    buildMeHotspots();
    openMe();
  }

  if(act === "copyEmail"){
    copyText("mybrowncat53@gmail.com");
  }

  if(act === "comics"){
    mobileComics.hidden = !mobileComics.hidden;
  }
});

/* =========================
다운로드 방지(요청: 우클릭 다운로드 불가)
- 완벽 차단은 불가능하지만 기본 UX 방지
========================= */
document.addEventListener("contextmenu", (e)=>{
  e.preventDefault();
});

document.addEventListener("dragstart", (e)=>{
  const t = e.target;
  if(t && (t.tagName === "IMG" || t.closest("img"))){
    e.preventDefault();
  }
});

// Ctrl+S / Ctrl+U / Ctrl+P 등 대표 단축키 일부 막기(가능한 범위)
document.addEventListener("keydown", (e)=>{
  if(e.key === "Escape"){
    closeLightbox();
    closeMe();
    closeComics();
    closeMobileMenu();
  }

  const k = e.key.toLowerCase();
  if((e.ctrlKey || e.metaKey) && (k === "s" || k === "u" || k === "p")){
    e.preventDefault();
  }
});

/* =========================
초기 실행
========================= */
render();
bindReveal();
bindScrollSync();

// 초기 활성 썸네일
setActiveThumb(order[0], false);
