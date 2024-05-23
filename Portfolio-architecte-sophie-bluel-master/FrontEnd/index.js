// Définir la liste des travaux en tant que variable globale
let travaux = [];

// Fonction asynchrone pour récupérer les travaux via l'API
async function fetchAndGenerateWorks() {
    try {
        const reponse = await fetch('http://localhost:5678/api/works');
        travaux = await reponse.json(); // Assigner les travaux à la variable globale
        genererTravaux(travaux); // Appel de la fonction pour générer les travaux une fois qu'ils ont été récupérés
    } catch (error) {
        console.error('Erreur lors de la récupération des travaux :', error);
    }
};

// Appeler la fonction pour récupérer les travaux lorsque le chargement de la page est terminé
document.addEventListener('DOMContentLoaded', fetchAndGenerateWorks);

function genererTravaux(travaux){
    // Récupération de l'élément du DOM qui accueillera les travaux
    const sectionFigure = document.querySelector("#dynamicFigure");

    for (let i = 0; i < travaux.length; i++) {
        const figure = travaux[i];
        // Création d’une balise dédiée à un travail
        const figureElement = document.createElement("figure");
        // Création des balises 
        const imageElement = document.createElement("img");
        imageElement.src = figure.imageUrl;
        const nomElement = document.createElement("figcaption");
        nomElement.innerText = figure.title;
        
        // Generayion de la balise figure de l'image et du nom
        sectionFigure.appendChild(figureElement);
        figureElement.appendChild(imageElement);
        figureElement.appendChild(nomElement);
     }
}

// Fonction pour filtrer les travaux par catégorie
function filterWorksByCategory(works, categoryId) {
    return works.filter(work => work.categoryId === categoryId);
}

// Fonction pour afficher les travaux filtrés par catégorie
function showFiguresByCategory(category, activeButton) {
    const sectionFigure = document.querySelector("#dynamicFigure");
    sectionFigure.innerHTML = "";
    const filteredWorks = category === 'all' ? travaux : filterWorksByCategory(travaux, category);
    genererTravaux(filteredWorks);

    // Mettre à jour les classes des boutons
    objetButton.classList.toggle("button--green", activeButton === objetButton);
    appartementButton.classList.toggle("button--green", activeButton === appartementButton);
    hotelButton.classList.toggle("button--green", activeButton === hotelButton);
    tousButton.classList.toggle("button--green", activeButton === tousButton);
}

// Boutons
const objetButton = document.getElementById('Objet');
const appartementButton = document.getElementById('Appartement');
const hotelButton = document.getElementById('Hotel');
const tousButton = document.getElementById('Tous');

// Assignation des événements aux boutons
objetButton.addEventListener('click', () => showFiguresByCategory(1, objetButton));
appartementButton.addEventListener('click', () => showFiguresByCategory(2, appartementButton));
hotelButton.addEventListener('click', () => showFiguresByCategory(3, hotelButton));
tousButton.addEventListener('click', () => showFiguresByCategory('all', tousButton));

export {showFiguresByCategory, filterWorksByCategory, genererTravaux};
