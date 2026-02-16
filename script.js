const viewer = document.getElementById('viewer');
const viewerImg = document.getElementById('viewerImg');

/* 갤러리 클릭 */
document.querySelectorAll('.art').forEach(img=>{
img.addEventListener('click',()=>{
viewer.style.display='flex';
viewerImg.src=img.src;
});
});

/* 썸네일 클릭 */
document.querySelectorAll('.right-nav img').forEach(img=>{
img.addEventListener('click',()=>{
viewer.style.display='flex';
viewerImg.src=img.src;
});
});

/* 배경 클릭 닫기 */
viewer.addEventListener('click',()=>{
viewer.style.display='none';
});

/* ESC 닫기 */
document.addEventListener('keydown',e=>{
if(e.key==="Escape"){
viewer.style.display='none';
}
});
