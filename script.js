const gallery = document.getElementById("gallery");

for(let i=1;i<=22;i++){

    const img = document.createElement("img");
    img.src = `images/e${i}.jpg`;

    img.onclick = () => openLightbox(img.src);

    gallery.appendChild(img);
}

/* ===== LIGHTBOX ===== */

const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");

function openLightbox(src){

    lightbox.style.display="flex";
    lightboxImg.src = src;

    // viewport 기준 자동 맞춤
    const vw = window.innerWidth * 0.9;
    const vh = window.innerHeight * 0.95;

    lightboxImg.style.maxWidth =
        Math.min(1200, vw) + "px";

    lightboxImg.style.maxHeight = vh + "px";
}

lightbox.onclick = () => {
    lightbox.style.display="none";
}
