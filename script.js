/* =========================
ASSET 경로 (중요)
- 너 폴더명이 images 이므로 여기만 맞추면 됨
========================= */
const ASSET_DIR = "images/";

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

/* =========================
파일 경로 생성
========================= */
const imgSrc = (id) => `${ASSET_DIR}${id}.jpeg`;

// e13 -> s13 / p25 -> s25
function thumbIdFromWorkId(id){
  const num = id.replace(/\D/g, "");
  return `s${num}`;
}
const thumbSrc = (id) => `${ASSET_DIR}${thumbIdFromWorkId(id)}.jpeg`;

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
      const box = thumbsEl.getBoundingClientRect();
      const ab = active.getBoundingClientRect();
      const delta = (ab.top + ab.height/2) - (box.top + box.height/2);
      thumbsEl.scrollBy({ top: delta, behavior: "smooth" });
    }
  }
}

function bindScrollSync(){
  const items = [...galleryEl.querySelectorAll(".gItem")];
  let ticking = false;

  function onScroll(){
    if(ticking) return;
    ticking = true;
    requestAnimationFrame(()=>{
      ticking = false;

      let best = null;
      let bestDist = Infinity;

      const topLine = 90;
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
리빌 애니메이션
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
  if(e.target === lightbox) closeLightbox();
});

/* =========================
Me 모달 + 핫스팟
(이미지 700x1983 고정)
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
  const el = document.createElement(href ? "a" : "button");
  el.className = "hotspot clickable";
  el.style.width = `${w}px`;
  el.style.height = `${h}px`;
  el.style.left = `${x}%`;
  el.style.top = `${y}%`;
  el.style.transform = "translate(-50%, -50%)";

  if(href){
    el.href = href;
    el.target = "_blank";
    el.rel = "noopener";
  }else{
    el.type = "button";
    el.addEventListener("click", onClick);
  }
  meStage.appendChild(el);
}

function buildMeHotspots(){
  clearMeHotspots();

  addHotspot({
    w: 158, h: 158, x: 13.7, y: 65.4,
    href: "https://www.instagram.com/hanna_something/"
  });

  addHotspot({
    w: 158, h: 158, x: 45.4, y: 65.4,
    href: "https://www.behance.net/hibyhanna3e0f"
  });

  addHotspot({
    w: 158, h: 158, x: 29.2, y: 65.4,
    href: "https://www.itsnicethat.com/articles/hanna-something-illustration-020920"
  });

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
  closeMobileMenu(); // 아무 곳이나 클릭하면 닫힘
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
다운로드 방지(가능한 범위)
========================= */
document.addEventListener("contextmenu", (e)=> e.preventDefault());

document.addEventListener("dragstart", (e)=>{
  const t = e.target;
  if(t && (t.tagName === "IMG" || t.closest("img"))){
    e.preventDefault();
  }
});

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
setActiveThumb(order[0], false);
