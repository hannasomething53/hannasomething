const gallery = document.getElementById("gallery");
const thumbs = document.getElementById("thumbs");

/* =========================
이미지 자동 생성
========================= */

for(let i=1;i<=22;i++){

const img=document.createElement("img");
img.src=`images/e${i}.jpg`;
img.className="art";
img.id=`e${i}`;
gallery.appendChild(img);

const t=document.createElement("img");
t.src=`images/e${i}.jpg`;
t.onclick=()=>img.scrollIntoView({behavior:"smooth"});
thumbs.appendChild(t);
}


/* =========================
스크롤 등장
========================= */

const observer=new IntersectionObserver(entries=>{
entries.forEach(e=>{
if(e.isIntersecting) e.target.classList.add("show");
});
});

document.querySelectorAll(".art").forEach(img=>{
observer.observe(img);
});


/* =========================
라이트박스
========================= */

const viewer=document.getElementById("viewer");
const viewerImg=document.getElementById("viewerImg");

document.querySelectorAll(".art").forEach(img=>{
img.onclick=()=>{
viewer.style.display="flex";
viewerImg.src=img.src;
};
});

viewer.onclick=()=>viewer.style.display="none";

document.addEventListener("keydown",e=>{
if(e.key==="Escape") viewer.style.display="none";
});
