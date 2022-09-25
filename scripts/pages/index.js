async function getPhotographers() {
    return fetch('../../data/photographers.json').then(response => {
        return response.json()
    }).then( data => {
       return data
    }).catch(error => {
        console.log('error', error)
    })
}

async function displayData(photographers) {
    const photographersSection = document.querySelector(".photographer_section");

    photographers.forEach((photographer) => {
        const photographerModel = photographerFactory(photographer);
        const userCardDOM = photographerModel.getUserCardDOM();
        photographersSection.appendChild(userCardDOM);
    });
}

async function init() {
    // Récupère les datas des photographes
    const { photographers } = await getPhotographers();

    // Affiche les datas des photographes
    await displayData(photographers);
}

await init();
    