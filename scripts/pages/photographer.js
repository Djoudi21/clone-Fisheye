import {mediaFactory} from '../factories/media.js'
let mediaFiltered
let photographer
let cardTitle
let currentIndex
let dynamicLikes
let total = 0
let initialLikes



async function getMedias() {
    return fetch('../../data/photographers.json').then(response => {
        return response.json()
    }).then( data => {
        return data
    }).catch(error => {
        console.log('error', error)
    })
}

function insertHeaderData(photographer) {
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
    const [...options] = document.querySelector('#filters').options
    options.map(o => {
        if(o.value === 'likes' && o.selected === true) {
            const likesAscendingMedias = medias.sort((a, b) => parseFloat(b.likes) - parseFloat(a.likes))
            likesAscendingMedias.forEach((media) => {
                const mediaModel = mediaFactory(media);
                const card = mediaModel.getMediaCardDOM();
                photographersCardsSection.appendChild(card);
            });
            handleLightboxListener()
        } else if (o.value === 'title' && o.selected === true) {
            const titleAscendingMedia = medias.sort((a,b) => (a.title > b.title) ? 1 : ((b.title > a.title) ? -1 : 0))
            titleAscendingMedia.forEach((media) => {
                const mediaModel = mediaFactory(media);
                const card = mediaModel.getMediaCardDOM();
                photographersCardsSection.appendChild(card);
            });
            handleLightboxListener()
        }
    })
}

// HANDLE SELECT LISTENER
const select = document.querySelector('#filters')
select.addEventListener('change', async function () {
    const photographersCardsSection = document.querySelector(".cards");
    photographersCardsSection.innerHTML = ''
    await displayMedias(mediaFiltered)
})

// HANDLE MODAL LIGHTBOX LISTENER
function handleLightboxListener(likes) {
    const mediaToCLick = document.querySelectorAll('.card')
    mediaToCLick.forEach((el) => {
        const img = el.querySelector('.card-img')
        const icon = el.querySelector('.mdi')
        img.addEventListener('click', function () {
            cardTitle = el.querySelector('.card-title').textContent
            displayLightbox(el)
        })
        icon.addEventListener('click', function () {
            getInitialLikes(el)
            const favNumber = el.querySelector('.fav-number')
            dynamicLikes = convertToString(favNumber.innerText)
            if(initialLikes === dynamicLikes) {
                dynamicLikes += 1
                const newLikesSpan = document.createElement('p')
                newLikesSpan.classList.add('fav-number')
                newLikesSpan.innerText = dynamicLikes
                favNumber.remove()
                el.querySelector('.fav').prepend(newLikesSpan)
                setTotalLikes()
            }
        })
    })
}

function getPhotographer(media, photographers) {
    const path = window.location.pathname;
    const page = path.split("/").pop();
    const idStringed = page.replace('.html', '').trim()
    const idNumbered = convertToString(idStringed)
    const photographersArrayFiltered = photographers.filter(el => el.id === idNumbered)
    const mediaFiltered = media.filter(el => el.photographerId === idNumbered)
    const photographer = photographersArrayFiltered[0]
    return {
        mediaFiltered,
        photographer
    }
}
async function insertCounterData(medias, photographer) {
    const count = document.querySelector('.count')
    const icon = document.querySelector('.icon-counter')
    const rate = document.querySelector('.rate-counter')
    medias.forEach(media => {
        total = total+= media.likes
    })
    rate.innerText = `${photographer.price}$ / jour`
    icon.innerText = 'icon'
    count.innerText = `${total}`
}

async function init() {
    const { media, photographers } = await getMedias();
    mediaFiltered = getPhotographer(media, photographers).mediaFiltered
    photographer = getPhotographer(media, photographers).photographer
    insertHeaderData(photographer)
    await displayMedias(mediaFiltered);
    await insertCounterData(mediaFiltered, photographer)
}

await init();

// LIGHTBIX FUCNTIONS
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

// Get INITALLIKES
function getInitialLikes(media) {
    const mediaTitle = media.querySelector('.card-title').textContent
    initialLikes =  mediaFiltered.filter(el => el.title === mediaTitle)[0].likes
}

function displayLightbox(media) {
    console.log('MEDIA', media)
    const id = document.getElementById('lightbox_modal')
    console.log('id', id)
    const img = id.querySelector('.card-img-lightbox')
    const img2 = id.querySelector('.card-img')
    console.log('img', img)
    console.log('img2', img2)
    // TODO: verifier bug double affichade l'image apres filtrage
    if(!img || !img2) {
        // Recuperation de la balise img depuis media et creation d'une copie
        const elToDisplay = media.querySelector('.card-img')
        const src = elToDisplay.src
        const copiedElToDisplay = document.createElement('img')
        copiedElToDisplay.setAttribute('src', src)
        copiedElToDisplay.classList.add('card-img-lightbox')

        // Recupertaion de l'index
        currentIndex = mediaFiltered.findIndex(el => el.title === cardTitle)

        // Recuperation des differents elements
        const modal = document.querySelector('#lightbox_modal')
        const modalContainer = document.createElement('div')
        modal.style.display = 'block'
        modal.classList.add('lightbox_modal')
        modalContainer.classList.add('lightbox-container')
        modal.append(modalContainer)

        // Creation des elements de navigation
        const next = document.createElement('span')
        const previous = document.createElement('span')
        const close = document.createElement('span')
        next.classList.add('next')
        previous.classList.add('previous')
        close.classList.add('close')
        next.innerText = 'Next'
        previous.innerText = 'previous'
        close.innerText = 'close'
        next.addEventListener('click',function (){
            nextMedia()
        })
        previous.addEventListener('click', function() {
            previousMedia()
        })
        close.addEventListener('click', function() {
            closeModal()
        })

        // Append
        modalContainer.appendChild(copiedElToDisplay)
        modalContainer.appendChild(next)
        modalContainer.appendChild(close)
        modalContainer.appendChild(previous)
    }
}

function  displayNewPicture(media) {
    const el = document.querySelector('.lightbox-container')
    const oldPic = el.querySelector('.card-img-lightbox')
    el.removeChild(oldPic)
    const picture = `.././assets/images/${media.image}`;
    const image = document.createElement('img')
    image.setAttribute("src", picture)
    image.classList.add('card-img-lightbox')
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


// UTILS
function convertToString(str) {
    return parseInt(str, 10)
}