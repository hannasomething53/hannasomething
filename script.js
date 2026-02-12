document.addEventListener("DOMContentLoaded", function () {

  const images = document.querySelectorAll(".zoomable");
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");

  images.forEach(img => {
    img.addEventListener("click", function () {
      lightbox.style.display = "flex";
      lightboxImg.src = this.src;
    });
  });

  lightbox.addEventListener("click", function () {
    lightbox.style.display = "none";
  });

});
