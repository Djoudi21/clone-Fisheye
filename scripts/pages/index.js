import photographersJSON from '../../data/photographers.json' assert {type: 'json'}

const photographersArray =  photographersJSON.photographers
    async function getPhotographers() {
        return ({
            photographers: [...(photographersArray)]})
    }

    async function displayData(photographers) {
        const photographersSection = document.querySelector(".photographer_section");

        photographers.forEach((photographer) => {
            const photographerModel = photographerFactory(photographer);
            const userCardDOM = photographerModel.getUserCardDOM();
            photographersSection.appendChild(userCardDOM);
        });
    };

    async function init() {
        // Récupère les datas des photographes
        const { photographers } = await getPhotographers();
        await displayData(photographers);
    };

    await init();
    