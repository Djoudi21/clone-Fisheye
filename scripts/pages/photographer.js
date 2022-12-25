import {mediaFactory} from '../factories/media.js'
let activeEl
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
let isCustomSelectFocused = false


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
    const taglineEl = document.querySelector('.tagline')
    const location = document.querySelector('.location')
    const infosContainer = document.querySelector('.infos-container')
    const imgContainer = document.querySelector('.img-container')
    const cardImg = document.createElement('img')
    const nameEl = document.createElement('h2')
    infosContainer.prepend(nameEl)
    nameEl.classList.add('name')
    cardImg.src = `./assets/photographers/${photographer.portrait}`
    cardImg.alt = `${photographer.title}`
    cardImg.classList.add('photographer-img')
    location.innerText = `${photographer.city}/${photographer.country}`
    nameEl.innerText = photographer.name
    nameEl.classList.add('name')
    taglineEl.innerText = photographer.tagline
    imgContainer.appendChild(cardImg)
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
function setLikesCounter(media) {

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
}

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
        img.addEventListener('click', function (event) {
            event.preventDefault();

            activeEl = document.activeElement

            //Assignation du titre de l'element cliqué a la variable cardTitle
            cardTitle = media.querySelector('.card-title').textContent

            //Affichage de l'element dans la modale
            displayLightbox(media)
        })

        img.addEventListener('keypress', function (event) {
            if (event.key === "Enter") {
                // Cancel the default action, if needed
                event.preventDefault();
                activeEl = document.activeElement
                //Assignation du titre de l'element cliqué a la variable cardTitle
                cardTitle = media.querySelector('.card-title').textContent

                //Affichage de l'element dans la modale
                displayLightbox(media)
            }
        })


        //Ajout d'un event listener sur l'icone
        icon.addEventListener('click', function () {
            setLikesCounter(media)
        })

        icon.addEventListener('keypress', function (event) {
            // If the user presses the "Enter" key on the keyboard
            if (event.key === "Enter") {
                // Cancel the default action, if needed
                event.preventDefault();
                setLikesCounter(media)
            }
        })

    })
}

// LIGHTBOX FUNCTIONS
function displayLightbox(mediaCard) {
    const indexedElements = document.querySelectorAll("[tabindex='0']");
    indexedElements.forEach(el => {
        el.setAttribute('tabIndex', "-1")
    })
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

    //Recuperation du container de la modal
    const modalContainer = document.querySelector('.lightbox-container')

    // Suppression du container si deja present dans la modal et creation d'un nouveau container
    if(modal.contains(modalContainer)) modalContainer.remove()
    newModalContainer = document.createElement('div')
    modal.style.display = 'inline-flex'
    modal.classList.add('center')
    newModalContainer.classList.add('lightbox-container')
    modal.append(newModalContainer)


    // Creation des elements de navigation et du titre et de l'image
    const rightContainer = document.createElement('div')
    const centerContainer = document.createElement('div')
    const leftContainer = document.createElement('div')

    const nextImg = document.createElement('img')
    nextImg.setAttribute('src', '.././assets/chevron-right.png')
    nextImg.setAttribute('alt', "icone revenir a l'élement suivant")
    nextImg.setAttribute('tabindex', "0")
    nextImg.classList.add('fav-icon__red')

    let link = document.createElement('div')
    const previousImg = document.createElement('img')
    link.appendChild(previousImg)
    previousImg.setAttribute('src', '.././assets/chevron-left.png')
    previousImg.setAttribute('alt', "icone revenir a l'élement précedent")
    previousImg.setAttribute('tabindex', "0")
    previousImg.classList.add('fav-icon__red')


    const close = document.createElement('img')
    close.setAttribute('src', '.././assets/window-close.png')
    close.setAttribute('alt', "icone fermer la modale")
    // close.setAttribute('tabindex', "0")
    close.classList.add('fav-icon__red')
    close.classList.add('close')
    const title = document.createElement('span')
    title.classList.add('title-img')
    title.innerText = mediaCard.querySelector('.card-title').textContent

    // leftContainer.append(previousImg)
    leftContainer.append(link)
    centerContainer.append(clonedImg)
    centerContainer.append(title)
    rightContainer.append(close)
    rightContainer.append(nextImg)

    leftContainer.classList.add('left')
    centerContainer.classList.add('center-image')
    rightContainer.classList.add('right')
    close.classList.add('close')
    close.innerText = 'close'

    // EventListeners
    nextImg.addEventListener('click',function (){
        nextMedia()
    })
    nextImg.addEventListener('keypress',function (event){
        // If the user presses the "Enter" key on the keyboard
        if (event.key === "Enter") {
            // Cancel the default action, if needed
            event.preventDefault();
            nextMedia()
        }
    })
    link.addEventListener('click', function() {
        previousMedia()
    })
    link.addEventListener('keypress',function (event){
        // If the user presses the "Enter" key on the keyboard
        if (event.key === "Enter") {
            // Cancel the default action, if needed
            event.preventDefault();
            previousMedia()
        }
    })
    close.addEventListener('click', function() {
        closeLightboxModal()
    })
    close.addEventListener('keypress',function (event){
        // If the user presses the "Enter" key on the keyboard
        if (event.key === "Enter") {
            // Cancel the default action, if needed
            event.preventDefault();
            closeLightboxModal()
            activeEl.focus()
        }
    })

    // Append
    newModalContainer.appendChild(leftContainer)
    newModalContainer.appendChild(centerContainer)
    newModalContainer.appendChild(rightContainer)
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

function closeLightboxModal() {
    const modal = document.getElementById("lightbox_modal");
    modal.style.display = "none";
}

function displayFilterCustom() {
    const filters = document.querySelectorAll('.filter')
    const iconUp = document.querySelector('.chevron-up')
    const iconDown = document.querySelector('.chevron-down')
    const customFilter = document.querySelector('.custom-filter')

    customFilter.addEventListener('keypress', function (event){
        if(event.key === 'Enter') {
            filters[1].style.display === 'block' ? filters[1].style.display = 'none' : filters[1].style.display = 'block'
            filters[0].style.display = 'flex'
            isCustomSelectFocused = !isCustomSelectFocused
            filters[0].setAttribute('tabindex', "0")
            filters[1].setAttribute('tabindex', "0")
            iconDown.setAttribute('tabindex', "0")
            iconUp.setAttribute('tabindex', "0")
        }
    })

    iconDown.addEventListener('click', function () {
        filters[0].style.display === 'block' ? filters[0].style.display = 'none' : filters[0].style.display = 'block'
        iconDown.style.display = 'none'
        iconUp.style.display = 'block'
        filters[0].style.display = 'flex'
    })

    iconUp.addEventListener('click', function () {
        filters[0].style.display === 'block' ? filters[0].style.display = 'none' : filters[0].style.display = 'block'
        iconUp.style.display = 'none'
        iconDown.style.display = 'block'
        filters[0].style.display = 'flex'
    })

    iconDown.addEventListener('keypress', function (event) {
        if(event.key === 'Enter') {
            if(iconDown.style.display === 'block') {
                iconUp.style.display = 'block'
                iconDown.style.display = 'none'
            } else {
                iconDown.style.display = 'block'
                iconUp.style.display = 'none'
            }
        }
    })

    iconUp.addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {
            if(iconUp.style.display === 'block') {
                iconUp.style.display = 'none'
                iconDown.style.display = 'block'
            }  else {
                iconUp.style.display = 'none'
                iconDown.style.display = "block"
            }
        }
    })

    filters.forEach(filter => {
        const photographersCardsSection = document.querySelector(".cards");
        filter.addEventListener('click', async function () {
            photographersCardsSection.innerHTML = ''
            if(filter.innerHTML === 'Titre') {
                const [...options] = document.querySelector('#filters').options
                const titleOption = options.find(o => o.value === 'title')
                titleOption.selected = true
                photographersCardsSection.innerHTML = ''
                await displayData(mediaFiltered)
            } else {
                const [...options] = document.querySelector('#filters').options
                const likesOption = options.find(o => o.value === 'likes')
                likesOption.selected = true
                photographersCardsSection.innerHTML = ''
                await displayData(mediaFiltered)
            }
        })
        filter.addEventListener('keypress', async function (event) {
            if(event.key === 'Enter') {
                if(filter.innerHTML === 'Titre') {
                    const [...options] = document.querySelector('#filters').options
                    const titleOption = options.find(o => o.value === 'title')
                    titleOption.selected = true
                    photographersCardsSection.innerHTML = ''
                    await displayData(mediaFiltered)
                } else {
                    const [...options] = document.querySelector('#filters').options
                    const likesOption = options.find(o => o.value === 'likes')
                    likesOption.selected = true
                    photographersCardsSection.innerHTML = ''
                    await displayData(mediaFiltered)
                }
            }
        })
    })
}

// UTILS
function convertToString(str) {
    return parseInt(str, 10)
}
