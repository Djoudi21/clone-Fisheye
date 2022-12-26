function photographerFactory(data) {
    const { name, portrait, city, country, tagline, price, id } = data;
    const picture = `assets/photographers/${portrait}`;
    // const origin = new URL(document.location).origin
    const url = `./photographer.html?id=${id}`

    function getUserCardDOM() {
        const article = document.createElement( 'article' );
        const a = document.createElement( 'a' );
        a.href = url;
        const sectionContent = document.createElement('div')
        const sectionInfos = document.createElement('div')
        sectionContent.classList.add('photographer-img-container')
        sectionInfos.classList.add('center')
        sectionInfos.classList.add('column')
        const img = document.createElement( 'img' );
        img.setAttribute("src", picture)
        const h2 = document.createElement( 'h2' );
        h2.textContent = name;
        const location = document.createElement('div')
        location.innerText = `${city}/${country}`
        location.classList.add('location')
        const tagLine = document.createElement('div')
        tagLine.innerText = tagline
        tagLine.classList.add('tagline')
        const rate = document.createElement('div')
        rate.classList.add('rate')
        rate.innerText = `${price}$/Jour`
        sectionContent.appendChild(img);
        sectionContent.appendChild(h2);
        sectionInfos.appendChild(location)
        sectionInfos.appendChild(tagLine)
        sectionInfos.appendChild(rate)
        a.appendChild(sectionContent)
        a.appendChild(sectionInfos)
        article.appendChild(a)
        return (article);
    }
    return { name, picture, city, country, getUserCardDOM }
}
