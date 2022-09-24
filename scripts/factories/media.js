export function mediaFactory(data, name) {
    const { image, title, likes } = data;
    const picture = `.././assets/images/${image}`;
    function getMediaCardDOM() {
        // CARD DIV SETTING
        const article = document.createElement( 'div' );
        article.classList.add('card')

        // LINK SETTING
        const a = document.createElement( 'a' );
        // a.href = `./photographers/${id}.html`;

        // IMG SETTING
        const image = document.createElement('img')
        image.setAttribute("src", picture)
        image.classList.add('card-img')

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
        const favNumber = document.createElement( 'span' );
        favNumber.classList.add('fav-number')
        const favIcon = document.createElement( 'span' );
        favNumber.innerText = likes
        favIcon.innerHTML = '<span class="mdi mdi-heart" aria-hidden="true">toto</span>';


        footer.appendChild(label)
        footer.appendChild(fav)
        fav.appendChild(favNumber)
        fav.appendChild(favIcon)
        article.appendChild(image)
        article.appendChild(footer)
        return (article);
    }


    return { likes, getMediaCardDOM }
}