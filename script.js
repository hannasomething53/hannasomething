/* =========================
스크롤 등장 애니메이션
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
썸네일 자동 생성
========================= */

const thumbNav = document.getElementById('thumbNav');
const artworks = document.querySelectorAll('.art');

artworks.forEach(img=>{

const thumb = document.createElement('img');

thumb.src = img.src;

/* 품질 조금 낮추기 (브라우저 리사이즈) */
thumb.loading = "lazy";

thumb.addEventListener('click',()=>{
img.scrollIntoView({behavior:'smooth'});
});

thumbNav.appendChild(thumb);

});
