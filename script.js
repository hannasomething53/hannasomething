document.addEventListener("DOMContentLoaded", function () {

    const images = document.querySelectorAll(".zoomable");
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");

    // 이미지 클릭 → 확대
    images.forEach(img => {
        img.addEventListener("click", function () {
            lightbox.style.display = "flex";
            lightboxImg.src = this.src;
        });
    });

    // 배경 클릭 → 닫기
    lightbox.addEventListener("click", function () {
        lightbox.style.display = "none";
    });

});
