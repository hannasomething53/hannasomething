const images = document.querySelectorAll(".art");
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");

images.forEach(img=>{
  img.addEventListener("click",()=>{
    lightboxImg.src = img.src;
    lightbox.classList.add("show");
  });
});

lightbox.addEventListener("click",()=>{
  lightbox.classList.remove("show");
});
