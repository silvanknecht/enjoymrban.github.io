let viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
document.getElementsByTagName('body')[0].onresize = function () {
    viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    console.log(viewportHeight);
};


let navbar = document.getElementById('navbar');
let navLinks = document.getElementsByClassName('nav-link');
window.onscroll = function () {
    "use strict";
    if (window.pageYOffset >= viewportHeight-53) {
        navbar.classList.add("nav-bg-colored");
        navbar.classList.remove("nav-bg-white");
        for (let i = 0; i < navLinks.length; i++) {
            navLinks[i].classList.add("nav-link-white");
            navLinks[i].classList.remove("nav-link-colored");
        }

    } else {
        navbar.classList.add("nav-bg-white");
        navbar.classList.remove("nav-bg-colored");
        for (let i = 0; i < navLinks.length; i++) {
            navLinks[i].classList.remove("nav-link-white");
            navLinks[i].classList.add("nav-link-colored");
        }
    }
};