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
box.className="item";
box.id=id;

if(captions[id]){
const c=document.createElement("div");
c.className="cap";
c.textContent=captions[id];
box.appendChild(c);
}

if(["e3","e4","e5","e6"].includes(id)){
const c=document.createElement("div");
c.className="cap small";
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
document.getElementById(id).scrollIntoView({behavior:"smooth",block:"center"});
};

thumbsInner.appendChild(t);


/* lightbox */

img.onclick=()=>{
lightbox.style.display="flex";
lightbox.querySelector("img").src=img.src;
};

});


/* reveal */

const io=new IntersectionObserver(e=>{
e.forEach(v=>{ if(v.isIntersecting) v.target.classList.add("show"); });
},{threshold:.1});

document.querySelectorAll(".item").forEach(el=>io.observe(el));


/* thumb sync */

const items=document.querySelectorAll(".item");
const thumbs=document.querySelectorAll(".thumbs-inner img");

window.addEventListener("scroll",()=>{
let idx=0;
items.forEach((it,i)=>{
if(it.getBoundingClientRect().top<window.innerHeight/2) idx=i;
});
const t=thumbs[idx];
if(!t)return;
thumbsInner.scrollTo({top:t.offsetTop - thumbsInner.clientHeight/2,behavior:"smooth"});
});


/* lightbox */

const lightbox=document.getElementById("lightbox");
lightbox.onclick=()=>lightbox.style.display="none";
document.addEventListener("keydown",e=>{if(e.key==="Escape")lightbox.style.display="none";});


/* category modal */

const modal=document.getElementById("categoryModal");
const inner=document.querySelector(".modal-inner");

document.querySelectorAll(".cat[data-open]").forEach(c=>{
c.onclick=()=>{
inner.innerHTML="";
const type=c.dataset.open;
order.filter(v=>v.startsWith(type)).forEach(id=>{
const img=document.createElement("img");
img.src="images/"+id+".jpg";
inner.appendChild(img);
});
modal.style.display="block";
};
});

modal.onclick=e=>{if(e.target===modal)modal.style.display="none";};


/* home */

document.querySelector(".home-btn").onclick=()=>window.scrollTo({top:0,behavior:"smooth"});


/* mobile */

const ham=document.querySelector(".hamburger");
const mobile=document.querySelector(".mobile-me");
ham.onclick=()=>mobile.style.display="block";
mobile.onclick=()=>mobile.style.display="none";


/* right click block */

document.addEventListener("contextmenu",e=>e.preventDefault());

/* ===== ME POPUP ===== */

const meBtn = document.querySelectorAll(".cat")[3]; // Me 버튼
const mePopup = document.getElementById("mePopup");
const meClose = document.querySelector(".me-close");

meBtn.onclick = () => {
  mePopup.style.display = "flex";
};

meClose.onclick = () => {
  mePopup.style.display = "none";
};

mePopup.onclick = (e) => {
  if (e.target === mePopup) {
    mePopup.style.display = "none";
  }
};

document.addEventListener("keydown", e => {
  if (e.key === "Escape") {
    mePopup.style.display = "none";
  }
});

