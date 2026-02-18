const order=[
"e1","e2","e3","e4","e5","e6","p25","e7","e8","e13",
"p28","p26","p27","p31","p29","p30","e9","e10",
"e14","e15","e16","e17","e18","e19","e20",
"e21","e22","e23","e24","p32","p33","p34"
];

const gallery=document.getElementById("gallery");
const thumbList=document.getElementById("thumbList");
const thumbContainer=document.querySelector(".thumbs");

let autoScrolling=false;

/* ======================
갤러리 생성
====================== */
order.forEach(name=>{
const block=document.createElement("div");
block.className="art-block";
block.id=name;

const img=document.createElement("img");
img.src=`images/${name}.jpg`;

img.onclick=()=>{
lightbox.style.display="flex";
lightboxImg.src=img.src;
};

block.appendChild(img);
gallery.appendChild(block);
});

/* ======================
썸네일 생성
====================== */
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

/* ======================
갤러리 스크롤 → 썸네일 동기화
(페이지 스크롤 절대 안 움직임)
====================== */
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

const thumb=[...thumbList.children]
.find(t=>t.dataset.target===closest);

if(!thumb) return;

/* 썸네일 컨테이너 내부만 스크롤 */
const offset=
thumb.offsetTop
- thumbContainer.clientHeight/2
+ thumb.clientHeight/2;

thumbContainer.scrollTo({
top:offset,
behavior:"smooth"
});

});
