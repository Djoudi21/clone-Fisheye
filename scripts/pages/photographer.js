import {mediaFactory} from '../factories/media.js'

let mediaFiltered
let photographer
let cardTitle
let currentIndex
let dynamicLikes
let total = 0
let initialLikes
let newModalContainer
let source
let mediaModel
let select

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
    const cardImg = document.querySelector('.photographer-img')
    cardImg.src = `./assets/photographers/${photographer.portrait}`
    location.innerText = `${photographer.city}/${photographer.country}`
    nameEl.innerText = photographer.name
    taglineEl.innerText = photographer.tagline
}

async function displayData(medias) {
    // Récupération de la section pour afficher les cards
    const photographersCardsSection = document.querySelector(".cards");

    // Récupération des options du select ayant pour id filters
    const [...options] = document.querySelector('#filters').options

    //Itération sur ces options afin des trier les cards
    options.map(o => {
        if(o.value === 'likes' && o.selected === true) {
            //Tri par nombre de likes de façon ascending
            const likesSortedMedias = medias.sort((a, b) => parseFloat(b.likes) - parseFloat(a.likes))

            //Creation de la card et injection
            likesSortedMedias.forEach((media) => {
                mediaModel = mediaFactory(media);
                const card = mediaModel.getMediaCardDOM();
                photographersCardsSection.appendChild(card);
            });

            //Fonction permettant d'ajouter un listener sur les medias
            handleLightboxListener()
        } else if (o.value === 'title' && o.selected === true) {
            //Tri par titre de façon ascending
            const titleAscendingMedia = medias.sort((a,b) => (a.title > b.title) ? 1 : ((b.title > a.title) ? -1 : 0))
            titleAscendingMedia.forEach((media) => {
                const mediaModel = mediaFactory(media);
                const card = mediaModel.getMediaCardDOM();
                photographersCardsSection.appendChild(card);
            });

            //Fonction permettant d'ajouter un listener sur les medias
            handleLightboxListener()
        }
    })
}

// HANDLE SELECT LISTENER
select = document.querySelector('#filters')
select.addEventListener('change', async function () {
    const photographersCardsSection = document.querySelector(".cards");
    photographersCardsSection.innerHTML = ''
    await displayData(mediaFiltered)
})

// HANDLE MODAL LIGHTBOX LISTENER
function handleLightboxListener() {

    //Recuperation des cards
    const medias = document.querySelectorAll('.card')

    //Iteration sur les cards
    medias.forEach((media) => {

        //Pour chaque card je recupere l'image et l'icone
        const img = media.querySelector('.card-img')
        const icon = media.querySelector('.fav-icon__red')

        //Ajout d'un event listener sur l'image
        img.addEventListener('click', function () {

            //Assignation du titre de l'element cliqué a la variable cardTitle
            cardTitle = media.querySelector('.card-title').textContent

            //Affichage de l'element dans la modale
            displayLightbox(media)
        })

        //Ajout d'un event listener sur l'icone
        icon.addEventListener('click', function () {

            //Appel de la fonction de recuperer le nombre de likes initiaux
            getInitialLikes(media)

            //Recuperation de la div qui permet d'afficher les likes
            const favNumber = media.querySelector('.fav-number')

            //Convertion du nombre de likes present sur la card from string to integer
            dynamicLikes = convertToString(favNumber.innerText)

            //Si nombre de likes initiaux est egal a celui affiché sur la card
            if(initialLikes === dynamicLikes) {

                //Ajout d'un like
                dynamicLikes += 1

                //Suppresion de l'ancien element affichant les likes et ajout du nouveau comportant la nopuvelle valeur
                const newLikesSpan = document.createElement('p')
                newLikesSpan.classList.add('fav-number')
                newLikesSpan.style.margin = '0px'
                newLikesSpan.innerText = dynamicLikes
                favNumber.remove()
                const newFavIcon = media.querySelector('.fav')
                newFavIcon.prepend(newLikesSpan)

                //Appel de la foinction permettant d'incrementer le total de likes
                setTotalLikes()
            }
        })
    })
}

function getPhotographer(media, photographers) {
    const queryString = window.location.search
    const params = new URLSearchParams(queryString)
    const id = params.get('id')
    const photographersArrayFiltered = photographers.filter(el => el.id === parseInt(id, 10))
    const mediaFiltered = media.filter(el => {
        return el.photographerId === parseInt(id, 10)
    })
    const photographer = photographersArrayFiltered[0]
    return {
        mediaFiltered,
        photographer
    }
}

async function insertCounterData(medias, photographer) {
    const count = document.querySelector('.count')
    const rate = document.querySelector('.rate-counter')
    const iconContainer = document.querySelector('.icon-counter')
    const icon = mediaModel.setFavIcon('black');
    iconContainer.appendChild(icon)
    iconContainer.classList.add('center')
    medias.forEach(media => {
        total = total+= media.likes
    })
    rate.innerText = `${photographer.price}$ / jour`
    count.innerText = `${total}`
}

async function init() {
    const { media, photographers } = await getMedias();
    mediaFiltered = getPhotographer(media, photographers).mediaFiltered
    photographer = getPhotographer(media, photographers).photographer
    insertHeaderData(photographer)
    await displayData(mediaFiltered);
    await displayFilterCustom()
    await insertCounterData(mediaFiltered, photographer)
}

await init();

// LIKES FUNCTIONS
function getInitialLikes(media) {
    const mediaTitle = media.querySelector('.card-title').textContent
    initialLikes =  mediaFiltered.filter(el => el.title === mediaTitle)[0].likes
}

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

// LIGHTBIX FUCNTIONS
function displayLightbox(mediaCard) {

    //Recuperation de l'image depuis la card passée en argument
    const img = mediaCard.querySelector('.card-img')

    //Clonage de l'image ou video
    const clonedImg = img.cloneNode()

    //Si source element, clonage de l'element source et injection dans le clone de l'element video et ajout de 'controls'
    if(mediaCard.querySelector('.source')) {
        source = mediaCard.querySelector('.source')
        const clonedSource = source.cloneNode()
        clonedImg.appendChild(clonedSource)
        clonedImg.controls = 'controls'
    }

    //Recuperation de la modal
    const modal = document.querySelector('#lightbox_modal')

    //Récuperation du container de la modal
    const modalContainer = document.querySelector('.lightbox-container')

    //Si la modal contient déja un lightbox-container
    if(modal.contains(modalContainer)) {
        //Suppression du conatiner puis recréation d'un nouveau
        modalContainer.remove()
        newModalContainer = document.createElement('div')
        modal.style.display = 'inline-flex'
        modal.classList.add('center')
        newModalContainer.classList.add('lightbox-container')
        modal.append(newModalContainer)
    } else {
        //Sinon creation d'un nouveau
        newModalContainer = document.createElement('div')
        modal.style.display = 'inline-flex'
        modal.classList.add('center')
        newModalContainer.classList.add('lightbox-container')
        modal.append(newModalContainer)
    }

    // Creation des elements de navigation et du titre et de l'image
    const right = document.createElement('div')
    const center = document.createElement('div')
    const left = document.createElement('div')
    const next = document.createElement('img')
    next.setAttribute('src', '.././assets/chevron-right.png')
    next.setAttribute('alt', "icone revenir a l'élement suivant")
    next.classList.add('fav-icon__red')
    const previous = document.createElement('img')
    previous.setAttribute('src', '.././assets/chevron-left.png')
    previous.setAttribute('alt', "icone revenir a l'élement précedent")
    previous.classList.add('fav-icon__red')

    const title = document.createElement('span')
    title.classList.add('title-img')
    title.innerText = mediaCard.querySelector('.card-title').textContent
    const close = document.createElement('img')
    close.setAttribute('src', '.././assets/window-close.png')
    close.setAttribute('alt', "icone fermer la modale")
    close.classList.add('fav-icon__red')
    close.classList.add('close')

    left.append(previous)
    center.append(clonedImg)
    center.append(title)
    right.append(close)
    right.append(next)
    // next.classList.add('next')
    left.classList.add('left')
    center.classList.add('center-image')
    right.classList.add('right')
    close.classList.add('close')
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
    newModalContainer.appendChild(left)
    newModalContainer.appendChild(center)
    newModalContainer.appendChild(right)
}

function displayNewPicture(media) {
    let newTitle = document.createElement('span')
    let content

    //Récuperation du container de la modal
    const modalContainer = document.querySelector('.lightbox-container')
    const centerContainer = modalContainer.querySelector('.center-image')
    const oldContent = modalContainer.querySelector('.card-img')
    const oldTitleImg = modalContainer.querySelector('.title-img')
    oldContent.remove()
    oldTitleImg.remove()
    cardTitle = media.title

    if(media.image) {
        content = mediaModel.getContentLightbox(media)

    } else {
        content = mediaModel.getContentLightbox(media, 'video')
    }

    //Ajout du media et de son titre dans le container
    newTitle.innerText = media.title
    newTitle.classList.add('title-img')
    centerContainer.append(content)
    centerContainer.append(newTitle)
}

function nextMedia() {
    currentIndex = mediaFiltered.findIndex(el => el.title === cardTitle)
    if (currentIndex === mediaFiltered.length - 1) {
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
    currentIndex = mediaFiltered.findIndex(el => el.title === cardTitle)
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

function displayFilterCustom() {
    const filters = document.querySelectorAll('.filter')
    const iconUp = document.querySelector('.chevron-up')
    const iconDown = document.querySelector('.chevron-down')
    iconDown.addEventListener('click', function () {
        filters[1].style.display === 'block' ? filters[1].style.display = 'none' : filters[1].style.display = 'block'
        iconDown.style.display = 'none'
        iconUp.style.display = 'block'
        filters[0].style.display = 'flex'
    })

    iconUp.addEventListener('click', function () {
        filters[1].style.display === 'block' ? filters[1].style.display = 'none' : filters[1].style.display = 'block'
        iconUp.style.display = 'none'
        iconDown.style.display = 'block'
        filters[0].style.display = 'flex'
    })

    filters.forEach(filter => {
        filter.addEventListener('click', async function () {
            const photographersCardsSection = document.querySelector(".cards");
            photographersCardsSection.innerHTML = ''
            if(filter.innerHTML === 'Titre') {
                const [...options] = document.querySelector('#filters').options
                const titleOption = options.find(o => o.value === 'title')
                titleOption.selected = true
                await displayData(mediaFiltered)
            } else {
                const [...options] = document.querySelector('#filters').options
                const likesOption = options.find(o => o.value === 'likes')
                likesOption.selected = true
                await displayData(mediaFiltered)
            }
        })
    })
}

// UTILS
function convertToString(str) {
    return parseInt(str, 10)
}