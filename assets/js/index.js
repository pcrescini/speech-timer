const txtRotate = function (el, toRotate, period) {
  this.toRotate = toRotate;
  this.el = el;
  this.loopNum = 0;
  this.period = parseInt(period, 10) || 2000;
  this.txt = "";
  this.tick();
  this.isDeleting = false;
};

txtRotate.prototype.tick = function () {
  let i = this.loopNum % this.toRotate.length;
  let fullTxt = this.toRotate[i];

  if (this.isDeleting) {
    this.txt = fullTxt.substring(0, this.txt.length - 1);
  } else {
    this.txt = fullTxt.substring(0, this.txt.length + 1);
  }

  this.el.innerHTML = '<span class="wrap">' + this.txt + "</span>";

  let that = this;
  let delta = 300 - Math.random() * 100;

  if (this.isDeleting) {
    delta /= 2;
  }

  if (!this.isDeleting && this.txt === fullTxt) {
    delta = this.period;
    this.isDeleting = true;
  } else if (this.isDeleting && this.txt === "") {
    this.isDeleting = false;
    this.loopNum++;
    delta = 500;
  }

  setTimeout(function () {
    that.tick();
  }, delta);
};

window.onload = function () {
  const elements = document.getElementsByClassName("txt-rotate");
  for (let i = 0; i < elements.length; i++) {
    let toRotate = elements[i].getAttribute("data-rotate");
    let period = elements[i].getAttribute("data-period");
    if (toRotate) {
      new txtRotate(elements[i], JSON.parse(toRotate), period);
    }
  }
};

document.addEventListener("DOMContentLoaded", () => {
  const documentBody = document.querySelector("body");
  const overlay = document.querySelector("#overlay");
  const hamburgerMenu = document.querySelector(".nav__menu--button");

  hamburgerMenu.addEventListener("click", (event) => {
    event.stopPropagation();
    console.log('menu clicked');
    documentBody.classList.toggle("nav-open");
    overlay.classList.toggle("blur");
  });

  documentBody.addEventListener("click", () => {

    if (documentBody.classList.contains("nav-open")) {
      documentBody.classList.remove("nav-open");
      overlay.classList.remove("blur");
    }
  });

});


let lastKnownScrollPosition = 0;
let ticking = false;

document.addEventListener('scroll', (event) => {
  lastKnownScrollPosition = window.scrollY;

  if (!ticking) {
    window.requestAnimationFrame(() => {
      checkScrollPosition(lastKnownScrollPosition);
      ticking = false;
    });
    ticking = true;
  }
});

function checkScrollPosition(scrollPosition) {
  const headerHeight = document.querySelector('header').offsetHeight;
   console.log('header height ' + headerHeight);
   console.log(scrollPosition);

  if (scrollPosition < (headerHeight / 3)) {
    document.querySelector('header').classList.remove('scroll');
  } else {
    document.querySelector('header').classList.add('scroll');
  }
}
