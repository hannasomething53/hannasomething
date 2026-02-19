const order=[
"e1","e2","e3","e4","e5","e6","p25","e7","e8","e13",
"p28","p26","p27","p31","p29","p30","e9","e10",
"e14","e15","e16","e17","e18","e19","e20","e21",
"e22","e23","e24","p32","p33","p34"
];

const captions={
e1:"Cover of the Sharjah International Book Fair Anthology 2023",
e2:"Interior Pages of the Sharjah International Book Fair Anthology",
e7:"Purunsoop Publishing Book cover."
};

const gallery=document.getElementById("gallery");
const thumbsInner=document.querySelector(".thumbs-inner");


/* ===== build gallery ===== */

order.forEach(id=>{

const box=document.createElement("div");
box.className="gallery-item";
box.id=id;

if(captions[id]){
const c=document.createElement("div");
c.className="caption";
c.textContent=captions[id];
box.appendChild(c);
}

if(["e3","e4","e5","e6"].includes(id)){
const c=document.createElement("div");
c.className="caption small";
c.textContent="magazin pleasant place";
box.appendChild(c);
}

const img=document.createElement("img");
img.src="images/"+id+".jpg";
box.appendChild(img);
gallery.appendChild(box);


/* thumb */

const num=id.replace(/[a-z]/g,"");
const t=document.createElement("img");
t.src="images/s"+num+".jpg";

t.onclick=()=>{
document.getElementById(id).scrollIntoView({
behavior:"smooth",
block:"center"
});
};

thumbsInner.appendChild(t);


/* lightbox */

img.onclick=()=>{
lightbox.style.display="flex";
lightboxImg.src=img.src;
};

});


/* ===== reveal ===== */

const io=new IntersectionObserver(e=>{
e.forEach(v=>{
if(v.isIntersecting) v.target.classList.add("show");
});
},{threshold:.1});

document.querySelectorAll(".gallery-item").forEach(el=>io.observe(el));


/* ===== thumb sync ===== */

const items=document.querySelectorAll(".gallery-item");
const thumbs=document.querySelectorAll(".thumbs-inner img");

window.addEventListener("scroll",()=>{

let idx=0;

items.forEach((it,i)=>{
if(it.getBoundingClientRect().top<window.innerHeight/2) idx=i;
});

const target=thumbs[idx];
if(!target) return;

thumbsInner.scrollTo({
top:target.offsetTop - thumbsInner.clientHeight/2,
behavior:"smooth"
});

});


/* ===== lightbox ===== */

const lightbox=document.getElementById("lightbox");
const lightboxImg=document.getElementById("lightbox-img");

lightbox.onclick=()=>lightbox.style.display="none";
document.addEventListener("keydown",e=>{
if(e.key==="Escape") lightbox.style.display="none";
});


/* ===== category grid ===== */

const modal=document.getElementById("gridModal");
const wrap=document.querySelector(".grid-wrap");

document.querySelectorAll(".cat-item[data-type]").forEach(el=>{
el.onclick=()=>{
const type=el.dataset.type;
wrap.innerHTML="";

order.filter(v=>v.startsWith(type)).forEach(id=>{
const img=document.createElement("img");
img.src="images/"+id+".jpg";
img.onclick=()=>{
lightbox.style.display="flex";
lightboxImg.src=img.src;
};
wrap.appendChild(img);
});

modal.style.display="block";
};
});

document.querySelector(".grid-close").onclick=()=>modal.style.display="none";
modal.onclick=e=>{ if(e.target===modal) modal.style.display="none"; };


/* ===== mobile ===== */

const ham=document.querySelector(".hamburger");
const mobile=document.querySelector(".mobile-me");

ham.onclick=()=>mobile.style.display="block";
mobile.onclick=()=>mobile.style.display="none";


/* ===== block right click ===== */

document.addEventListener("contextmenu",e=>e.preventDefault());
