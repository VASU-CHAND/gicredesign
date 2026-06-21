// =======================
// NAVBAR SHADOW ON SCROLL
// =======================

window.addEventListener("scroll", () => {

const navbar = document.querySelector(".navbar");

if(window.scrollY > 50){
navbar.style.boxShadow = "0 10px 30px rgba(0,0,0,.15)";
}
else{
navbar.style.boxShadow = "0 4px 20px rgba(0,0,0,.08)";
}

});

// =======================
// SCROLL ANIMATION
// =======================

const observer = new IntersectionObserver(entries => {

entries.forEach(entry => {

if(entry.isIntersecting){
entry.target.classList.add("show");
}

});

},{
threshold:0.15
});

document.querySelectorAll("section").forEach(section => {

section.classList.add("hidden");

observer.observe(section);

});

// =======================
// COUNTER ANIMATION
// =======================

const counters = document.querySelectorAll(".stat-card h3");

counters.forEach(counter => {

const updateCount = () => {

const target = parseInt(counter.innerText);

const count = +counter.getAttribute("data-count") || 0;

const increment = target / 80;

if(count < target){

counter.setAttribute(
"data-count",
Math.ceil(count + increment)
);

counter.innerText =
Math.ceil(count + increment);

setTimeout(updateCount,20);

}else{

counter.innerText = target + "+";

}

};

updateCount();

});

// =======================
// GALLERY IMAGE POP EFFECT
// =======================

document.querySelectorAll(".gallery-grid img")
.forEach(img => {

img.addEventListener("click", () => {

img.style.transform = "scale(1.15)";

setTimeout(() => {

img.style.transform = "scale(1)";

},500);

});

});