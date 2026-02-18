/* =========================
이미지 순서 정의
========================= */

const order=[
"e1","e2","e3","e4","e5","e6",
"p25",
"e7","e8","e13",
"p28","p26","p27","p31","p29","p30",
"e9","e10","e14","e15","e16","e17",
"e18","e19","e20","e21","e22","e23","e24",
"p32","p33","p34"
];


/* =========================
라이트박스 확대 보기
========================= */

const lightbox=document.getElementById("lightbox");
const lightboxImg=document.getElementById("lightbox-img");

document.querySelectorAll(".gallery img").forEach(img=>{
img.onclick=()=>{
lightbox.style.display="flex";
lightboxImg.src=img.src;
};
});

lightbox.onclick=()=>lightbox.style.display="none";

document.addEventListener("keydown",e=>{
if(e.key==="Escape") lightbox.style.display="none";
});


/* =========================
스크롤 등장 애니메이션
========================= */

const observer=new IntersectionObserver(entries=>{
entries.forEach(entry=>{
if(entry.isIntersecting){
entry.target.classList.add("show");
}
});
},{threshold:0.15});

document.querySelectorAll(".gallery img").forEach(img=>{
observer.observe(img);
});


/* =========================
썸네일 클릭 → 갤러리 이동
========================= */

const thumbList=document.getElementById("thumbList");

[...thumbList.children].forEach(thumb=>{
thumb.onclick=()=>{

const num=thumb.src.match(/s(\d+)/)[1];

const target=document.getElementById("e"+num) || document.getElementById("p"+num);

if(target){
target.scrollIntoView({
behavior:"smooth",
block:"center"
});
}

};
});


/* =========================
갤러리 ↔ 썸네일 자동 동기화 (최적화)
========================= */

let currentActive=null;
let ticking=false;

function updateThumbSync(){

let closest=null;
let min=Infinity;

for(const name of order){

const el=document.getElementById(name);
if(!el) continue;

const rect=el.getBoundingClientRect();
const dist=Math.abs(rect.top);

if(dist<min){
min=dist;
closest=name;
}
}

if(!closest) return;

/* 이미 같은 이미지면 실행 안함 */
if(currentActive===closest) return;

currentActive=closest;

const num=closest.replace(/[a-z]/g,"");

const target=[...thumbList.children].find(t=>t.src.includes(`s${num}`));

if(target){
target.scrollIntoView({
block:"center",
behavior:"auto"   // smooth 사용 금지 (버벅임 원인)
});
}

}

window.addEventListener("scroll",()=>{
if(!ticking){
requestAnimationFrame(()=>{
updateThumbSync();
ticking=false;
});
ticking=true;
}
},{passive:true});


/* =========================
이미지 우클릭 저장 방지
========================= */

document.addEventListener("contextmenu",e=>{
if(e.target.tagName==="IMG"){
e.preventDefault();
}
});
