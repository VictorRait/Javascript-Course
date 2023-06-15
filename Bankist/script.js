const header = document.querySelector('.header')
const nav = document.querySelector('nav')
const closeBtn = document.querySelector('.modal__close')
const modal = document.querySelector('.modal')
const overlay = document.querySelector('.overlay')
const signupBtn = document.querySelectorAll('.button')
const operationsTab = document.querySelectorAll('.operations__tab')

document.addEventListener('scroll', function(e){
    const height = header.clientHeight - nav.clientHeight

    if (window.scrollY >= height ){
      nav.style.backgroundColor = '#ffffffc7'
      nav.style.position = 'fixed'
    }
    else {
        nav.style.backgroundColor = '#f3f3f3'
        nav.style.position = 'relative'
    }
})
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        if (this.getAttribute('href') === '#') return
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});
closeBtn.addEventListener('click',function(){
    modal.classList.toggle('hidden')
    overlay.classList.toggle('hidden')
})
signupBtn.forEach(btn =>{
    btn.addEventListener('click',function(){
        modal.classList.toggle('hidden')
        overlay.classList.toggle('hidden')
    })
}
)
//////////////////////////////////// Operations tab
const removeActiveTab = function(){
    operationsTab.forEach(tab => {
        tab.classList.remove('operations__tab--active')
    })
}
operationsTab.forEach(tab => {
    const operationsContent = document.querySelector('.operations__content')
    const operationsIcon = document.querySelector('.operations__icon')
    const operationsIconsvg = document.querySelector('.operations__icon svg use')
    const operationsHeader = document.querySelector('.operations__header')
    const paragraph = operationsContent.querySelector('p') 
    tab.addEventListener('click', function(e){
        const tabBtn = e.target.closest('.btn')
        removeActiveTab()
        tabBtn.classList.add('operations__tab--active')
        const num = tabBtn.dataset.num 
    
        if (+num === 1) {
            operationsIconsvg.setAttribute('href', './img/icons.svg#icon-upload')
            operationsIcon.className = 'operations__icon operations__icon--1'
            operationsHeader.innerText = 'Transfer money to anyone, instantly! No fees, no BS.'
            paragraph.innerText = `Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.`
          
      
        }
        if (+num === 2) {
            operationsIconsvg.setAttribute('href', './img/icons.svg#icon-home')
            operationsIcon.className = 'operations__icon operations__icon--2'
            operationsHeader.innerText = 'Buy a home or make your dreams come true, with instant loans.'
            paragraph.innerText = `Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`
          
      
        }
        if (+num === 3) {
            operationsIconsvg.setAttribute('href', './img/icons.svg#icon-user-x')
            operationsIcon.className = 'operations__icon operations__icon--3'
            operationsHeader.innerText = 'No longer need your account? No problem! Close it instantly.'
            paragraph.innerText = `Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          `
          
      
        }

    })
})
//////////////////////////////////// Slider
let currSlide = 0;
const slides = document.querySelectorAll('.slide')
const dots = document.querySelectorAll('.dot')

const removeActiveDots = function(){
    dots.forEach(dot => {
        dot.classList.remove('dot--active')
     })
}

const renderSlides = function(){
    slides.forEach((s,i) => {
        s.style.transform = `translateX(${(i + currSlide) * 100}%)`
    })
}
const renderDots = function(){
    removeActiveDots()
   document.querySelector(`[data-num=dot${currSlide}]`).classList.add('dot--active')
}
renderSlides()
const sliderRight = document.querySelector('.slider__button--right')
const sliderLeft = document.querySelector('.slider__button--left')
sliderRight.addEventListener('click', function(){
    currSlide--
  
    if (currSlide <  -slides.length + 1 ) currSlide = 0
    renderSlides()
    renderDots()

})
sliderLeft.addEventListener('click', function(){
    
    currSlide++
    if (currSlide > 0) currSlide = -slides.length + 1
   
    renderSlides()
    renderDots()
})

dots.forEach(dot => {
    dot.addEventListener('click', function(e){
        const dataNum = e.target.getAttribute('data-num')
        const num = dataNum.length > 4 ? dataNum.slice(-2) : dataNum.slice(-1)      
        currSlide = +num
        renderSlides()
        renderDots()
    })
})

///////////////////// links hover 

const headerLinks = document.querySelector('.header__links')
const links  = Array.from(headerLinks.children)
const logo = document.querySelector('.header__logo')

links.forEach(link => {
    link.addEventListener('mouseenter', function(e){
        const target = e.target
        logo.style.opacity= '.6';
        links.forEach(link => {
            link.style.opacity = '0.6'
        })
        
        link.style.opacity = '1'

    })
    link.addEventListener('mouseleave', function(){
     
        logo.style.opacity= '1';
        links.forEach(link => {
            link.style.opacity = '1'
        }) 
        
        link.style.opacity = '1'
       
    })

})
///////////////////// Reveal sections 
const sections = document.querySelectorAll('.section')



const revealSection = function(entries, observer){
    const [entry] = entries
    
    if (entry.isIntersecting){
        entry.target.classList.remove('section--hidden')
        observer.unobserve(entry.target)    
    }
}
const sectionObserver = new IntersectionObserver(revealSection, {
    root:null,
    threshold: .15,
})

sections.forEach(sect => {
    sect.classList.add('section--hidden')
    sectionObserver.observe(sect)
})
///////////////////// Lazy load img
const lazyImages = document.querySelectorAll('.lazy--img')


const loadImg =function(entries){
    const [entry] = entries;

    if (!entry.isIntersecting)return 

    entry.target.src = entry.target.dataset.src


    entry.target.addEventListener('load', function(){
        entry.target.classList.remove('lazy--img')
    })
    observer.unobserve(entry.target)

    
}
const imgObserver = new IntersectionObserver(loadImg, {
    root:null,
    threshold:0,
    rootMargin: '-200px'
})

lazyImages.forEach(img => {
    imgObserver.observe(img)
})