const order = [
"e1","e2","e3","e4","e5","e6","p25","e7","e8","e13",
"p28","p26","p27","p31","p29","p30","e9","e10",
"e14","e15","e16","e17","e18","e19","e20","e21",
"e22","e23","e24","p32","p33","p34"
];

const captions={
e1:"Cover of the Sharjah International Book Fair Anthology 2023",
e2:"Interior Pages of the Sharjah International Book Fair Anthology",
e7:"Purunsoop Publishing Book cover.",
e3:"magazin pleasant place",
e4:"magazin pleasant place",
e5:"magazin pleasant place",
e6:"magazin pleasant place"
};

const gallery=document.getElementById("gallery");
const thumbs=document.getElementById("thumbs");

/* 썸네일 내부 스크롤 컨테이너 */
const thumbsInner=document.createElement("div");
thumbsInner.className="thumbs-inner";
thumbs.appendChild(thumbsInner);


/* =========================
   SNS 링크 (Me 아래 추가)
========================= */

const meBox=document.querySelector(".me-box"); // Me 박스 클래스

if(meBox){

const behLink=document.createElement("a");
behLink.href="https://www.behance.net/hibyhanna3e0f";
behLink.target="_blank";

const behImg=document.createElement("img");
behImg.src="linebeh.png";
behImg.style.width="50px";
behImg.style.display="block";
behImg.style.marginTop="20px";

behLink.appendChild(behImg);
meBox.appendChild(behLink);


const insLink=document.createElement("a");
insLink.href="https://www.instagram.com/hanna_something/";
insLink.target="_blank";

const insImg=document.createElement("img");
insImg.src="lineins.png";
insImg.style.width="50px";
insImg.style.display="block";
insImg.style.marginTop="10px";

insLink.appendChild(insImg);
meBox.appendChild(insLink);

}


/* =========================
   갤러리 생성
========================= */

order.forEach(id=>{

const item=document.createElement("div");
item.className="gallery-item";
item.id=id;

if(captions[id]){
const cap=document.createElement("div");
cap.className="caption";
cap.textContent=captions[id];
item.appendChild(cap);
}

const img=document.createElement("img");
img.src=`images/${id}.jpg`;
item.appendChild(img);

gallery.appendChild(item);


/* 썸네일 */

const num=id.replace(/[a-z]/g,"");
const t=document.createElement("img");
t.src=`images/s${num}.jpg`;

t.onclick=()=>{
document.getElementById(id).scrollIntoView({
behavior:"smooth",
block:"center"
});
};

thumbsInner.appendChild(t);


/* 라이트박스 */

img.onclick=()=>{
lightbox.style.display="flex";
lightboxImg.src=img.src;
};

});


/* =========================
   라이트박스
========================= */

const lightbox=document.getElementById("lightbox");
const lightboxImg=document.getElementById("lightbox-img");

lightbox.onclick=()=> lightbox.style.display="none";
document.addEventListener("keydown",e=>{
if(e.key==="Escape") lightbox.style.display="none";
});


/* =========================
   등장 애니메이션
========================= */

const io=new IntersectionObserver(entries=>{
entries.forEach(e=>{
if(e.isIntersecting) e.target.classList.add("show");
});
},{threshold:0.1});

document.querySelectorAll(".gallery-item").forEach(el=>io.observe(el));


/* =========================
   갤러리 → 썸네일 동기화
========================= */

const items=document.querySelectorAll(".gallery-item");
const thumbImgs=thumbsInner.querySelectorAll("img");

window.addEventListener("scroll",()=>{

let index=0;

items.forEach((item,i)=>{
const rect=item.getBoundingClientRect();
if(rect.top<window.innerHeight/2) index=i;
});

const target=thumbImgs[index];
if(!target) return;

thumbsInner.scrollTo({
top:target.offsetTop - thumbsInner.clientHeight/2 + target.clientHeight/2,
behavior:"smooth"
});

});


/* =========================
   우클릭 방지
========================= */

document.addEventListener("contextmenu",e=>e.preventDefault());


/* =========================
   모바일 햄버거
========================= */

const ham=document.querySelector(".hamburger");
const panel=document.querySelector(".mobile-me");

ham.onclick=()=> panel.style.display="block";
panel.onclick=()=> panel.style.display="none";
