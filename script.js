const imgs = document.querySelectorAll(".art");
const lightbox = document.getElementById("lightbox");
const lbImg = document.getElementById("lightbox-img");

imgs.forEach(img=>{
  img.addEventListener("click",()=>{
    lbImg.src = img.src;
    lightbox.classList.add("show");
  });
});

lightbox.addEventListener("click",()=>{
  lightbox.classList.remove("show");
});
