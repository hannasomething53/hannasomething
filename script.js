const viewer = document.getElementById("viewer");
const viewerImg = document.getElementById("viewer-img");



/* 이미지 클릭 확대 */

document.querySelectorAll(".art").forEach(img=>{
img.addEventListener("click",()=>{
viewer.style.display="flex";
viewerImg.src = img.src;
});
});



/* 배경 클릭 닫기 */

viewer.addEventListener("click",()=>{
viewer.style.display="none";
});



/* 썸네일 이동 */

document.querySelectorAll(".right-nav img").forEach(thumb=>{

thumb.addEventListener("click",()=>{

const id = thumb.dataset.target;
document.getElementById(id).scrollIntoView({
behavior:"smooth",
block:"start"
});

});

});
