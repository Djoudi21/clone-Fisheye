export function mediaFactory(data) {
    const { image, title, likes, video } = data;

    let content


    function getMediaCardDOM() {
        // CARD DIV SETTING
        const article = document.createElement( 'div' );
        article.classList.add('card')

        if(video) {
            //VIDEO SETTING
            content = document.createElement('video')
            const source = document.createElement('source')
            const poster= `.././assets/film-and-vid.jpeg`
            source.src = `.././assets/images/${video}`
            source.type = `video/mp4`
            source.classList.add('source')
            content.appendChild(source)
            content.setAttribute('poster', poster)
            content.classList.add('card-img')
        } else {
            // IMG SETTING
            content = document.createElement('img')
            const picture = `.././assets/images/${image}`;
            content.setAttribute("src", picture)
            content.classList.add('card-img')
        }

        // FOOTER SETTING
        const footer = document.createElement( 'div' );
        footer.classList.add('card-footer')

        // TITLE SETTING
        const label = document.createElement( 'div' );
        label.classList.add('card-title')
        label.innerText = title


        // FAV SETTING
        const fav = document.createElement( 'div' );
        fav.classList.add('fav')

        // FAV SETTING
        const icon = setFavIcon()
        const number = setFavNumber()

        footer.appendChild(label)
        footer.appendChild(fav)
        fav.appendChild(number)
        fav.appendChild(icon)
        article.appendChild(content)
        article.appendChild(footer)
        return (article);
    }

    function getContentLightbox(media, type) {
        if(type === 'video') {
            const content = `.././assets/images/${media.video}`;
            const poster = `.././assets/film-and-vid.jpeg`;
            const video = document.createElement('video')
            const source = document.createElement('source')
            video.setAttribute("poster", poster)
            video.classList.add('card-img')
            video.controls = 'controls'
            source.setAttribute("src", content)
            source.setAttribute("type", 'video/mp4')
            video.appendChild(source)
            return video
        } else {
            const picture = `.././assets/images/${media.image}`;
            const image = document.createElement('img')
            image.setAttribute("src", picture)
            image.classList.add('card-img')
            return image
        }
    }

    function setFavIcon(color) {
        const favIcon = document.createElement( 'img' );
        favIcon.setAttribute('src', ".././assets/heart.png")
        favIcon.style.marginLeft = "15px"
        color === 'black' ? favIcon.classList.add('fav-icon__black') : favIcon.classList.add('fav-icon__red')
        return favIcon
    }

    function setFavNumber() {
        const favNumber = document.createElement( 'span' );
        favNumber.classList.add('fav-number')
        favNumber.innerText = likes
        return favNumber
    }


    return { likes, getMediaCardDOM, getContentLightbox, setFavIcon }
}