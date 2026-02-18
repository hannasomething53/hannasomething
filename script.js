/* =========================
이미지 순서
========================= */
const order=[
"e1","e2","e3","e4","e5","e6","p25","e7","e8","e13",
"p28","p26","p27","p31","p29","p30","e9","e10",
"e14","e15","e16","e17","e18","e19","e20",
"e21","e22","e23","e24","p32","p33","p34"
];

/* =========================
캡션
========================= */
const captions={
e1:"Cover of the Sharjah International Book Fair Anthology 2023",
e2:"Interior Pages of the Sharjah International Book Fair Anthology"
};

const gallery=document.getElementById("gallery");
const thumbList=document.getElementById("thumbList");

/* =========================
갤러리 생성
========================= */
order.forEach(name=>{
const block=document.createElement("div");
block.className="art-block";
block.id=name;

const cap=document.createElement("div");
cap.className="caption";
cap.innerText=captions[name]||"";

const img=document.createElement("img");
img.src=`images/${name}.jpg`;

img.onclick=()=>{
lightbox.style.display="flex";
lightboxImg.src=img.src;
};

block.appendChild(cap);
block.appendChild(img);
gallery.appendChild(block);
});

/* =========================
썸네일 생성 (dataset 사용)
========================= */
order.forEach(name=>{
const num=name.replace(/[a-z]/g,"");

const t=document.createElement("img");
t.src=`images/s${num}.jpg`;
t.dataset.target=name;

t.onclick=()=>{
autoScrolling=true;

document.getElementById(name).scrollIntoView({
behavior:"smooth",
block:"start"
});

setTimeout(()=>autoScrolling=false,600);
};

thumbList.appendChild(t);
});

/* =========================
등장 애니메이션
========================= */
const observer=new IntersectionObserver(entries=>{
entries.forEach(e=>{
if(e.isIntersecting) e.target.classList.add("show");
});
},{threshold:0.2});

document.querySelectorAll(".art-block").forEach(el=>observer.observe(el));

/* =========================
라이트박스
========================= */
const lightbox=document.getElementById("lightbox");
const lightboxImg=document.getElementById("lightboxImg");

lightbox.onclick=()=>lightbox.style.display="none";
document.addEventListener("keydown",e=>{
if(e.key==="Escape") lightbox.style.display="none";
});

/* =========================
스크롤 동기화 (루프 방지 핵심)
========================= */
let autoScrolling=false;

window.addEventListener("scroll",()=>{

if(autoScrolling) return;

let closest=null;
let min=999999;

order.forEach(name=>{
const el=document.getElementById(name);
const rect=el.getBoundingClientRect();
const dist=Math.abs(rect.top);

if(dist<min){
min=dist;
closest=name;
}
});

if(!closest) return;

const targetThumb=[...thumbList.children]
.find(t=>t.dataset.target===closest);

if(targetThumb){
targetThumb.scrollIntoView({
block:"center"
});
}

});
