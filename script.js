const gallery = document.getElementById("gallery");

for (let i = 1; i <= 22; i++) {

    const img = document.createElement("img");
    img.src = `images/e${i}.jpg`;
    img.alt = `e${i}`;

    img.onerror = function () {
        const div = document.createElement("div");
        div.className = "broken";
        div.textContent = `이미지 없음: e${i}.jpg`;
        img.replaceWith(div);
    };

    gallery.appendChild(img);
}
