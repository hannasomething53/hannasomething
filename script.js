

/* =========================
스크롤 이미지 등장
========================= */

const observer = new IntersectionObserver(entries=>{
entries.forEach(entry=>{
if(entry.isIntersecting){
entry.target.classList.add('show');
}
});
});

document.querySelectorAll('.art').forEach(img=>{
observer.observe(img);
});


/* =========================
이미지 클릭 확대
========================= */

const viewer = document.getElementById('viewer');
const viewerImg = document.getElementById('viewerImg');

document.querySelectorAll('.art').forEach(img=>{
img.addEventListener('click',()=>{
viewer.style.display='flex';
viewerImg.src=img.src;
});
});

viewer.addEventListener('click',()=>{
viewer.style.display='none';
});


/* =========================
커서 확대
========================= */

const cursor = document.createElement('div');
cursor.classList.add('cursor');
document.body.appendChild(cursor);

document.addEventListener('mousemove',e=>{
cursor.style.left=e.clientX+'px';
cursor.style.top=e.clientY+'px';
});


/* =========================
부드러운 스크롤
========================= */

document.querySelectorAll('a[href^="#"]').forEach(anchor=>{
anchor.addEventListener('click',function(e){
e.preventDefault();
document.querySelector(this.getAttribute('href'))
.scrollIntoView({behavior:'smooth'});
});
});
