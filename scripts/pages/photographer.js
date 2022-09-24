import photographersJSON from '../../data/photographers.json' assert {type: 'json'}
import mediaJSON from '../../data/photographers.json' assert {type: 'json'}
import {mediaFactory} from '../factories/media.js'
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
let dynamicLikes
let total = 0


async function getMedias() {
    return ({ medias: mediaFiltered})
}

function insertHeaderData() {
    const nameEl = document.querySelector('.name')
    const taglineEl = document.querySelector('.tagline')
    const location = document.querySelector('.location')
    // const cardImg = document.querySelector('.card-img')
    // cardImg.src = photographer
    location.innerText = `${photographer.city}/${photographer.country}`
    nameEl.innerText = photographer.name
    taglineEl.innerText = photographer.tagline

}

async function displayMedias(medias) {
    const photographersCardsSection = document.querySelector(".cards");
    medias.forEach((media) => {
        const mediaModel = mediaFactory(media);
        const card = mediaModel.getMediaCardDOM();
        photographersCardsSection.appendChild(card);
    });

    const mediaToCLick = document.querySelectorAll('.card')
    mediaToCLick.forEach(el => {
        const img = el.querySelector('.card-img')
        const icon = el.querySelector('.mdi')
        img.addEventListener('click', function () {
            cardTitle = el.querySelector('.card-title').textContent
            displayLightbox(el)
        })
        icon.addEventListener('click', function () {
            const favNumber = el.querySelector('.fav-number')
            dynamicLikes = convertToString(favNumber.innerText)
            dynamicLikes += 1
            const newLikesSpan = document.createElement('p')
            newLikesSpan.classList.add('fav-number')
            newLikesSpan.innerText = dynamicLikes
            favNumber.remove()
            el.querySelector('.fav').prepend(newLikesSpan)
            setTotalLikes()
        })
    })
}

async function insertCounterData() {
    const count = document.querySelector('.count')
    const icon = document.querySelector('.icon-counter')
    const rate = document.querySelector('.rate-counter')
    mediaFiltered.forEach(media => {
        total = total+= media.likes
    })
    rate.innerText = `${photographer.price}$ / jour`
    icon.innerText = 'icon'
    count.innerText = `${total}`
}

async function init() {
    insertHeaderData()
    const { medias } = await getMedias();
    await displayMedias(medias);
    await insertCounterData()
    await sortMedias()
}

await init();

function setTotalLikes() {
    total += 1
    const count = document.querySelector('.count')
    const counter = document.querySelector('.counter')
    const newCount = document.createElement('div')
    count.remove()
    newCount.classList.add('count')
    newCount.innerText = total
    counter.prepend(newCount)
}

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

async function sortMedias() {
    // TODO: sort array
    const { medias } = await getMedias();
    console.log('media', medias)
    medias.sort()
    const select = document.getElementById('filters')
    select.addEventListener('change', async function (){
        // console.log('select', select.options[0].selected)
        if(select.options[0].selected){
            console.log('toto')
        } else {
            console.log('tutu')
            await displayMedias(medias)
        }
    })
}