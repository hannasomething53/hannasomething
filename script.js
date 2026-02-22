/* =========================
데이터
========================= */

const order = [
  "e1","e2","e3","e4","e5","e6","p25","e7","e8","e13",
  "p28","p26","p27","p31","p29","p30","e9","e10",
  "e14","e15","e16","e17","e18","e19","e20","e21",
  "e22","e23","e24","p32","p33","p34"
];

const captions = {
  e1: "Cover of the Sharjah International Book Fair Anthology 2023",
  e2: "Interior Pages of the Sharjah International Book Fair Anthology",
  e7: "Purunsoop Publishing Book cover.",
  e3: "magazin pleasant place",
  e4: "magazin pleasant place",
  e5: "magazin pleasant place",
  e6: "magazin pleasant place"
};

/* =========================
DOM
========================= */

const galleryEl = document.getElementById("gallery");
const thumbsInner = document.getElementById("thumbsInner");

const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");

const modal = document.getElementById("categoryModal");
const modalClose = document.getElementById("catModalClose");
const modalImg = document.getElementById("catModalImg");
const modalCaption = document.getElementById("catModalCaption");
const modalThumbs = document.getElementById("catModalThumbs");
const modalPrev = document.getElementById("catPrev");
const modalNext = document.getElementById("catNext");

const ham = document.querySelector(".hamburger");
const mobileMe = document.getElementById("mobileMe");

/* =========================
우클릭 다운로드 방지
========================= */
document.addEventListener("contextmenu", (e) => e.preventDefault(), { passive:false });

/* =========================
갤러리 생성 + 썸네일 생성
========================= */

function numFromId(id){
  // e13 -> 13, p25 -> 25
  return id.replace(/[a-z]/gi, "");
}

order.forEach((id) => {
  // gallery item
  const box = document.createElement("section");
  box.className = "item";
  box.id = id;

  const capText = captions[id];
  if (capText) {
    const cap = document.createElement("div");
    cap.className = "cap";
    cap.textContent = capText;
    box.appendChild(cap);
  }

  const img = document.createElement("img");
  img.src = `images/${id}.jpg`;
  img.alt = id;
  img.loading = "lazy";
  box.appendChild(img);

  galleryEl.appendChild(box);

  // gallery click -> lightbox
  img.addEventListener("click", () => {
    lightboxImg.src = img.src;
    lightbox.style.display = "flex";
    lightbox.setAttribute("aria-hidden", "false");
  });

  // thumbs (right column)
  const n = numFromId(id);
  const t = document.createElement("img");
  t.src = `images/s${n}.jpg`;
  t.alt = `s${n}`;
  t.loading = "lazy";

  t.addEventListener("click", () => {
    const target = document.getElementById(id);
    if (!target) return;
    target.scrollIntoView({ behavior: "smooth", block: "center" });
  });

  thumbsInner.appendChild(t);
});

/* =========================
라이트박스 닫기
========================= */

function closeLightbox(){
  lightbox.style.display = "none";
  lightbox.setAttribute("aria-hidden", "true");
  lightboxImg.src = "";
}

lightbox.addEventListener("click", () => closeLightbox());

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    // lightbox / modal 둘 다 닫기
    closeLightbox();
    closeCategoryModal();
  }
});

/* =========================
갤러리 등장 애니메이션
========================= */

const io = new IntersectionObserver((entries) => {
  entries.forEach((en) => {
    if (en.isIntersecting) en.target.classList.add("show");
  });
}, { threshold: 0.12 });

document.querySelectorAll(".item").forEach((el) => io.observe(el));

/* =========================
갤러리 스크롤 -> 썸네일 자동 동기화
(단, 썸네일 위에 마우스 올라가면 자동 동기화 OFF)
========================= */

let isHoverThumbs = false;

thumbsInner.addEventListener("mouseenter", () => { isHoverThumbs = true; });
thumbsInner.addEventListener("mouseleave", () => { isHoverThumbs = false; });

const items = Array.from(document.querySelectorAll(".item"));
const thumbImgs = Array.from(thumbsInner.querySelectorAll("img"));

let syncRaf = null;

function syncThumbToGallery(){
  if (isHoverThumbs) return;

  // viewport 중앙에 가장 가까운 item 찾기
  const mid = window.innerHeight * 0.5;
  let idx = 0;

  for (let i = 0; i < items.length; i++){
    const r = items[i].getBoundingClientRect();
    if (r.top < mid) idx = i;
  }

  const t = thumbImgs[idx];
  if (!t) return;

  const targetTop = t.offsetTop - (thumbsInner.clientHeight / 2) + (t.clientHeight / 2);
  thumbsInner.scrollTo({ top: targetTop, behavior: "smooth" });
}

window.addEventListener("scroll", () => {
  if (syncRaf) cancelAnimationFrame(syncRaf);
  syncRaf = requestAnimationFrame(syncThumbToGallery);
}, { passive:true });

/* =========================
카테고리 모달 (슬라이드 + 하단 썸네일바)
========================= */

let currentList = [];
let currentIndex = 0;

function captionForModal(id, type){
  if (type === "p") return "Personal works";
  if (type === "c") return "";
  // e
  return captions[id] || "";
}

function renderCategoryModal(type){
  // 리스트 구성
  if (type === "e") {
    currentList = ["e1","e2","e3","e4","e5","e6","e7","e8","e13","e9","e10","e14","e15","e16","e17","e18","e19","e20","e21","e22","e23","e24"];
  } else if (type === "p") {
    currentList = ["p25","p28","p26","p27","p31","p29","p30","p32","p33","p34"];
  } else if (type === "c") {
    // comics 파일이 실제로 없을 수 있으니, 있으면 넣고 없으면 빈 화면 유지
    // 필요하면 여기 배열만 채우면 됨: ["c1","c2"...]
    currentList = [];
  }

  currentIndex = 0;

  // 하단 썸네일 만들기
  modalThumbs.innerHTML = "";
  currentList.forEach((id, i) => {
    const n = numFromId(id);
    const th = document.createElement("img");
    th.src = `images/s${n}.jpg`;
    th.alt = `thumb ${id}`;

    th.addEventListener("click", () => {
      currentIndex = i;
      updateModalMain(type);
    });

    modalThumbs.appendChild(th);
  });

  updateModalMain(type);
}

function updateModalMain(type){
  const id = currentList[currentIndex];
  if (!id) {
    modalImg.src = "";
    modalCaption.textContent = "";
    // 썸네일 active 정리
    Array.from(modalThumbs.querySelectorAll("img")).forEach(img => img.classList.remove("active"));
    return;
  }

  modalImg.src = `images/${id}.jpg`;
  modalCaption.textContent = captionForModal(id, type);

  // active 표시
  const thumbs = Array.from(modalThumbs.querySelectorAll("img"));
  thumbs.forEach(img => img.classList.remove("active"));
  if (thumbs[currentIndex]) thumbs[currentIndex].classList.add("active");

  // 현재 썸네일이 보이게 스크롤(가로)
  const active = thumbs[currentIndex];
  if (active) {
    const left = active.offsetLeft - (modalThumbs.clientWidth / 2) + (active.clientWidth / 2);
    modalThumbs.scrollTo({ left, behavior:"smooth" });
  }
}

function openCategoryModal(type){
  renderCategoryModal(type);
  modal.style.display = "block";
  modal.setAttribute("aria-hidden", "false");
}

function closeCategoryModal(){
  modal.style.display = "none";
  modal.setAttribute("aria-hidden", "true");
  modalImg.src = "";
  modalCaption.textContent = "";
  modalThumbs.innerHTML = "";
  currentList = [];
  currentIndex = 0;
}

document.querySelectorAll(".cat[data-open]").forEach((btn) => {
  btn.addEventListener("click", () => {
    openCategoryModal(btn.dataset.open);
  });
});

modalClose.addEventListener("click", () => closeCategoryModal());

// 배경 클릭 닫기(안쪽 클릭은 유지)
modal.addEventListener("click", (e) => {
  if (e.target === modal) closeCategoryModal();
});

// 좌우 이동
function modalPrevNext(dir){
  if (!currentList.length) return;
  currentIndex += dir;
  if (currentIndex < 0) currentIndex = 0;
  if (currentIndex >= currentList.length) currentIndex = currentList.length - 1;

  // type 추정: 첫 글자
  const type = currentList[0][0].toLowerCase();
  updateModalMain(type);
}

modalPrev.addEventListener("click", () => modalPrevNext(-1));
modalNext.addEventListener("click", () => modalPrevNext(+1));

/* =========================
Home 버튼: 맨 위로 이동 + 모달 닫기
========================= */
document.querySelector(".home-link").addEventListener("click", (e) => {
  e.preventDefault();
  closeCategoryModal();
  closeLightbox();
  window.scrollTo({ top:0, behavior:"smooth" });
});

/* =========================
모바일 햄버거
========================= */

ham.addEventListener("click", () => {
  mobileMe.style.display = "block";
  mobileMe.setAttribute("aria-hidden", "false");
});

mobileMe.addEventListener("click", () => {
  mobileMe.style.display = "none";
  mobileMe.setAttribute("aria-hidden", "true");
});
