import photographersJSON from '../../data/photographers.json' assert {type: 'json'}
import mediaJSON from '../../data/photographers.json' assert {type: 'json'}
const photographersArray =  photographersJSON.photographers
const mediaArray =  mediaJSON.media

const path = window.location.pathname;
const page = path.split("/").pop();
const idStringed = page.replace('.html', '').trim()
const idNumbered = convertToString(idStringed)
const photographersArrayFiltered = photographersArray.filter(el => el.id === idNumbered)
const mediaFiltered = mediaArray.filter(el => el.photographerId === idNumbered)
const photographer = photographersArrayFiltered[0]
let cardTitle
let currentIndex

async function getMedias() {
    return ({ medias: mediaFiltered})
}

function insertHeaderData() {
    const nameEl = document.querySelector('.name')
    const taglineEl = document.querySelector('.tagline')
    const location = document.querySelector('.location')
    const cardImg = document.querySelector('.card-img')
    // cardImg.src = photographer
    location.innerText = `${photographer.city}/${photographer.country}`
    nameEl.innerText = photographer.name
    taglineEl.innerText = photographer.tagline

}

async function displayMedias(medias) {
    const photographersCards = document.querySelector(".cards");
    medias.forEach((media) => {
        const mediaModel = mediaFactory(media);
        const card = mediaModel.getMediaCardDOM();
        photographersCards.appendChild(card);
    });
    const mediaToCLick = document.querySelectorAll('.card')
    mediaToCLick.forEach(el => {
        el.addEventListener('click', function () {
            cardTitle = el.querySelector('.card-title').textContent
            displayLightbox(el)
        })
    })
}

async function init() {
    insertHeaderData()
    const { medias } = await getMedias();
    await displayMedias(medias);
}

await init();


function displayLightbox(media) {
    currentIndex = mediaFiltered.findIndex(el => el.title === cardTitle)
    const el = document.querySelector('#lightbox_modal')
    const elToDisplay = media.querySelector('.card-img')
    const next = document.createElement('span')
    const previous = document.createElement('span')
    const close = document.createElement('span')
    next.innerText = 'Next'
    previous.innerText = 'previous'
    close.innerText = 'close'
    el.style.display = 'block'
    el.style.position = 'fixed'
    el.appendChild(elToDisplay)
    el.appendChild(next)
    el.appendChild(close)
    el.appendChild(previous)
    next.addEventListener('click',function (){
        nextMedia()
    })
    previous.addEventListener('click', function() {
        previousMedia()
    })
    close.addEventListener('click', function() {
        closeModal()
    })
}

function  displayNewPicture(media) {
    const el = document.querySelector('#lightbox_modal')
    const oldPic = el.querySelector('.card-img')
    el.removeChild(oldPic)
    const picture = `.././assets/images/${media.image}`;
    const image = document.createElement('img')
    image.setAttribute("src", picture)
    image.classList.add('card-img')
    el.appendChild(image)
}

function nextMedia() {
    if (currentIndex === 9) {
        currentIndex = 0
        const nextMedia = mediaFiltered[0]
        displayNewPicture(nextMedia)
    } else {
        currentIndex+=1
        const nextMedia = mediaFiltered[currentIndex]
        displayNewPicture(nextMedia)
    }
}

function previousMedia() {
    if (currentIndex === 0) {
        currentIndex = 9
        const nextMedia = mediaFiltered[mediaFiltered.length - 1]
        displayNewPicture(nextMedia)
    } else {
        currentIndex-=1
        const nextMedia = mediaFiltered[currentIndex]
        displayNewPicture(nextMedia)
    }
}

function closeModal() {
    const modal = document.getElementById("lightbox_modal");
    modal.style.display = "none";
}

function convertToString(str) {
    return parseInt(str, 10)
}