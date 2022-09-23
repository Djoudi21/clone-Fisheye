function photographerFactory(data) {
    const { name, portrait, city, country, tagline, price } = data;
console.log('DATa', data)
    const picture = `assets/photographers/${portrait}`;

    function getUserCardDOM() {
        const article = document.createElement( 'article' );
        const sectionContent = document.createElement('div')
        const sectionInfos = document.createElement('div')
        sectionInfos.classList.add('center')
        const img = document.createElement( 'img' );
        img.setAttribute("src", picture)
        const h2 = document.createElement( 'h2' );
        document.createElement('div')
        h2.textContent = name;
        const location = document.createElement('span')
        location.innerText = `${city}/${country}`
        const tagLine = document.createElement('span')
        tagLine.innerText = tagline
        const rate = document.createElement('span')
        rate.innerText = `${price}$/Jour`
        sectionContent.appendChild(img);
        sectionContent.appendChild(h2);
        sectionInfos.appendChild(location)
        sectionInfos.appendChild(tagLine)
        sectionInfos.appendChild(rate)
        article.appendChild(sectionContent)
        article.appendChild(sectionInfos)
        return (article);
    }
    return { name, picture, city, country, getUserCardDOM }
}