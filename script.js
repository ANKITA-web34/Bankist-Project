'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const header = document.querySelector('.header');
const allSection = document.querySelectorAll('section');
const logo = document.querySelector('.nav__logo')
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const tabs = document.querySelectorAll('.operations__tab');
const tabContainer = document.querySelector('.operations__tab-container');
const tabContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');

const slides = document.querySelectorAll('.slide');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');

const dotContainer = document.querySelector('.dots');

///////////////////////////////////////
// Modal window

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

///////////////////////////////////////
// scroll Down

document.getElementById('section--1');
const allButton = document.getElementsByTagName('button');

btnScrollTo.addEventListener('click', function() {
  section1.scrollIntoView({behavior: 'smooth'})
});
///////////////////////////////////////
// page navigation 1st method
/*document.querySelectorAll('.nav__link').forEach(function(el) {
  el.addEventListener('click', function(e) {
    e.preventDefault();
    const id = this.getAttribute('href');
    console.log(id, 'you click me !');
    document.querySelector(id).scrollIntoView({behavior: 'smooth'})
  })
})*/

//2nd method
document.querySelector('.nav__links').addEventListener('click', function(e) {
  e.preventDefault();
  
  if(e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');    
    document.querySelector(id).scrollIntoView({behavior: 'smooth'});
  } 
});

/////////Tabbed Components////////////
tabContainer.addEventListener('click', function(e) {
  const clicked = e.target.closest('.operations__tab');
  // console.log(clicked);

  if(!clicked) return;

  //add and remove transtionY in tabs
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  
  tabContent.forEach(c => c.classList.remove('operations__content--active'));
  
  clicked.classList.add('operations__tab--active');

  //add content when we click(Tabs)
  document.querySelector(`.operations__content--${clicked.dataset.tab}`)
  .classList.add('operations__content--active');
});

///////////////Passing Arguments to Event Handlers///////////
//menu Fade animation//

const handleHover = function(e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if(el !== link) el.style.opacity = this;
     });

     logo.style.opacity = this;
  }
};

nav.addEventListener('mouseover', handleHover.bind(0.3));
nav.addEventListener('mouseout', handleHover.bind(1));

/////////////Sticky nav///////////////////

// const intialCoords = section1.getBoundingClientRect();
// console.log(intialCoords);
// window.addEventListener('scroll', function() {
//   if(window.scrollY > intialCoords.top) 
//   nav.classList.add('sticky');
//   else nav.classList.remove('sticky');
// });

/////////IntersectionObserver//////////

/*const obsCallback = function(entries, observer) {
  entries.forEach(entry => {
    console.log(entry);
  })
};
const obsOptions = {
  root: null,
  threshhold: [0, 0.2],
};
const observer = new IntersectionObserver(obsCallback, obsOptions);
observer.observe(section1);*/

const navHeight = nav.getBoundingClientRect().height;
const stickyNav = function(entries) {
const [entry] = entries;
  
  if(!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);
//geting value(header) from very top #header


////////////////Revel sections Animation////////////
const revelSection = function(entries, observer) {
  const [entry] = entries;
  if(!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target)
};

const sectionObserver = new IntersectionObserver(revelSection, {
  root:null,
  threshold: 0.15,
});

//geting value(section) from very top
allSection.forEach(function(section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

///////////////Lasy Loading page//////////////
const imgTargets = document.querySelectorAll('img[data-src]');

const loading = function(entries, observer) {
  const [entry] = entries;
  if(!entry.isIntersecting) return;

  //Replace src with data-src
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function() {
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
}
const imgObserver = new IntersectionObserver(loading, {
  root:null,
  threshold: 0,
  rootMargin: '-200px',
})
imgTargets.forEach(img => imgObserver.observe(img));


/////////////Slider component///////////////
const slider = function() {
let curSlide = 0;
const maxSlide = slides.length;
//geting value(slides) from very top

const goToSlide = function(slide) {
  slides.forEach((s,i) => s.style.transform = 
  `translateX(${100 * (i - slide)}%)`);
};

goToSlide(0);

//right and left btn
const nxtSlide = function() {
  if(curSlide === (maxSlide-1)) {
    curSlide = 0;
  }else {
    curSlide++;
  }
    goToSlide(curSlide);
    activateDots(curSlide);
};

const preSlide = function() {
  if(curSlide === 0) {
    curSlide = maxSlide - 1;
  } else {
    curSlide--;
  }
  goToSlide(curSlide);
  activateDots(curSlide);
};


btnRight.addEventListener('click', nxtSlide);
btnLeft.addEventListener('click', preSlide);

//////Keyboard handler
document.addEventListener('keydown', function(e) {
  e.key === 'ArrowRight' && nxtSlide();
  e.key === 'ArrowLeft' && preSlide();
});

///dots
const createDots = function() {
  slides.forEach(function (_ , i) {
    dotContainer.insertAdjacentHTML('beforeend',
    `<button class="dots__dot" data-slide="${i}"></button>`
    );
  });
};
createDots();

///activate the dots
const activateDots = function(slide) {
  document.querySelectorAll('.dots__dot').forEach
  (dot => dot.classList.remove('dots__dot--active'));

  document.querySelector(`.dots__dot[data-slide="${slide}"]`)
  .classList.add('dots__dot--active');
};

activateDots(0);

dotContainer.addEventListener('click', function(e) {
  if(e.target.classList.contains('dots__dot')) {
    const {slide} = e.target.dataset;
    goToSlide(slide);
    activateDots(slide);
  }
});
};
slider();







