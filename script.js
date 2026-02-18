
const mainImage = document.getElementById("mainImage");
const thumbs = document.querySelectorAll("#thumbs img");
const gallery = document.getElementById("gallery");
const zoomIcon = document.getElementById("zoomIcon");


/* -------------------------
썸네일 클릭 → 메인 이미지 변경
------------------------- */
thumbs.forEach(img=>{
    img.addEventListener("click", ()=>{
        mainImage.src = img.src;
    });
});


/* -------------------------
갤러리 hover → 확대 아이콘 표시
------------------------- */
gallery.addEventListener("mouseenter", ()=>{
    zoomIcon.style.display="block";
});

gallery.addEventListener("mouseleave", ()=>{
    zoomIcon.style.display="none";
});


/* -------------------------
마우스 따라다니는 아이콘
------------------------- */
document.addEventListener("mousemove", e=>{
    zoomIcon.style.left = e.pageX + 20 + "px";
    zoomIcon.style.top = e.pageY + 20 + "px";
});


/* -------------------------
갤러리 스크롤 완전 정상 작동
(이벤트 차단 없음)
------------------------- */
// 아무것도 하지 않는다.
// 브라우저 기본 스크롤 사용이 가장 안정적

