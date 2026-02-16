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
부드러운 스크롤
========================= */

document.querySelectorAll('a[href^="#"]').forEach(anchor=>{
anchor.addEventListener('click',function(e){
e.preventDefault();
document.querySelector(this.getAttribute('href'))
.scrollIntoView({behavior:'smooth'});
});
});


/* =========================
오른쪽 썸네일 자동 생성
========================= */

const thumbNav = document.getElementById('thumbNav');
const artworks = document.querySelectorAll('.art');

artworks.forEach(img=>{

const thumb = document.createElement('img');
thumb.src = img.src;

thumb.addEventListener('click',()=>{
img.scrollIntoView({behavior:'smooth'});
});

thumbNav.appendChild(thumb);

});
