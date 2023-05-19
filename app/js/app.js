const images = [
    {
        src: './images/dest/more1.jpg'
    },
    {
        src: './images/dest/more2.jpg'
    },
    {
        src: './images/dest/more3.jpg'
    },
    {
        src: './images/dest/more4.jpg'
    },
    {
        src: './images/dest/more5.jpg'
    }
]
const body = document.querySelector('body');
const menuBtn = document.querySelector('.menu__btn');
const menu = document.querySelector('.top__list');
const topContactBtn = document.querySelector('.top__list-btn');
const contactBtn = document.querySelector('.contact-me-btn');
const modal = document.querySelector('.modal');
const closeBtn = document.querySelector('.close-modal');
const contactForm = document.querySelector('.form');
const loadMoreBtn = document.querySelector('.load-more-btn');
const gallery = document.querySelector('.gallery');
const galleryRight = document.querySelector('.gallery__right');
const galleryLeft = document.querySelector('.gallery__left');

// modal
contactBtn.addEventListener('click', onContactBtn);
topContactBtn.addEventListener('click', onContactBtn);
function onContactBtn () {
    modal.classList.add('open');
    body.classList.add('hidden');
}


// close
closeBtn.addEventListener('click', () => {
    modal.classList.remove('open');
    body.classList.remove('hidden');
})

window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        modal.classList.remove('open');
        body.classList.remove('hidden');
    }
})

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.remove('open');
        body.classList.remove('hidden');
    }
})


// form
const getData = async (url) => {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`error adress ${url}, status ${response.status}`)
    }
    return await response.json();
};

const sendData = async (url, data) => {
    const response = await fetch(url, {
        method: 'POST',
        body: data
    })

    if (!response.ok) {
        throw new Error(`error adress ${url}, status ${response.status}`)
    }
    return await response.json();
}

const sendFormData = () => {

    contactForm.addEventListener('submit', e => {
        e.preventDefault();
        modal.classList.remove('open');
        const dataForomForm = new FormData(contactForm)

        sendData('https://jsonplaceholder.typicode.com/posts', dataForomForm)
            .then(() => {
                contactForm.reset();
            })
            .catch((err) => {
                console.log('error- ', err)
            })
    })
}
sendFormData();


// mobile menu 
menuBtn.addEventListener('click', () => {
    menu.classList.toggle('top__list--active');

    if (menu.classList.contains('top__list--active')) {
        body.classList.toggle('hidden');
    }
    
    else if (body.classList.contains('hidden')) {
        body.classList.remove('hidden');
    }
})


// animation
gsap.registerPlugin(ScrollTrigger, ScrollSmoother)
if (ScrollTrigger.isTouch !== 1) {

    ScrollSmoother.create({
        wrapper: '.wrapper',
        content: '.content',
        smooth: 1.5,
        effects: true,
    })

    gsap.fromTo('.hero-section', { opacity: 1 }, {
        opacity: 0,
        scrollTrigger: {
            trigger: '.hero-section',
            start: 'center',
            end: '1050',
            scrub: true
        }
    })

    animateItems()
}

function animateItems() {
    let itemsL = gsap.utils.toArray('.gallery__left .gallery__item')
    itemsL.forEach(item => {
        gsap.fromTo(item, { x: -100, opacity: 0 }, {
            opacity: 1, x: 0,
            scrollTrigger: {
                trigger: item,
                start: '-850',
                end: '-100',
                scrub: true
            }
        })
    })

    let itemsR = gsap.utils.toArray('.gallery__right .gallery__item')
    itemsR.forEach(item => {
        gsap.fromTo(item, { x: 100, opacity: 0 }, {
            opacity: 1, x: 0,
            scrollTrigger: {
                trigger: item,
                start: '-850',
                end: '-100',
                scrub: true
            }
        })
    })
}


// Media
const mediaQuery = window.matchMedia('(min-width: 625px)');
console.log(!mediaQuery.matches)


// load More / media
if (mediaQuery.matches) {
    console.log('Media Query Matched!');
    loadMoreBtn.addEventListener('click', onLoadMoreBtn);
    function onLoadMoreBtn() {
        for (let i = 0; i < images.length; i++) {
            if (i % 2 == 0) {
                const markup = createMarkup(images[i]);
                galleryRight.insertAdjacentHTML("beforeend", markup);
                console.log('right');
                console.log(markup);
            }
            else if (i % 2 !== 0) {
                const markup = createMarkup(images[i]);
                galleryLeft.insertAdjacentHTML("beforeend", markup);
                console.log('left');
                console.log(markup);
            }
        }
        setTimeout(() => {
            ScrollTrigger.refresh();
        }, 1000);
        ScrollTrigger.refresh();
        animateItems();
        refreshFsLightbox();
        loadMoreBtn.classList.remove('load-more-btn');
        loadMoreBtn.classList.add('disabled');
    }
} else
    if (!mediaQuery.matches) {
        console.log('624px');
        loadMoreBtn.addEventListener('click', onLoadMoreBtn);
        function onLoadMoreBtn() {
            for (const image of images) {
                const markup = createMarkup(image);
                console.log(markup)
                galleryRight.insertAdjacentHTML("beforeend", markup);
            }

            setTimeout(() => {
                ScrollTrigger.refresh();
            }, 1000);
            refreshFsLightbox();
            loadMoreBtn.classList.remove('load-more-btn');
            loadMoreBtn.classList.add('disabled');
        }

    }

function createMarkup(img) {
    return `<div class="gallery__item">
        <a data-fslightbox="gallery" href=${img.src}>
            <img class="gallery__img" src=${img.src}>
        </a>
    </div>
    `;
}