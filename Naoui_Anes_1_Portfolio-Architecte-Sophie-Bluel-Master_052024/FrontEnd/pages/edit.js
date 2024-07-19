// Importation des fonctions nécessaires depuis le fichier index.js
import { showFiguresByCategory, filterWorksByCategory, genererTravaux } from "../index.js";

let travaux = [];
const sectionFigure = document.querySelector("#dynamicFigure");
const lignePopUp = document.createElement("div");
lignePopUp.classList.add('ligne');
const buttonPopUp = document.createElement("button");
buttonPopUp.innerText = "Ajouter une photo";
buttonPopUp.classList.add('button--green', "button--popup");
const popUpDiv = document.createElement("div");
const arrowBackIcon = document.createElement("i");
arrowBackIcon.classList.add("fa-solid", "fa-arrow-left", "arrowLeft__icon");

// Fonction asynchrone pour récupérer les travaux via l'API lors du chargement de la page
async function fetchAndGenerateWorks() {
    try {
        const reponse = await fetch('http://localhost:5678/api/works');
        travaux = await reponse.json(); // Assigner les travaux à la variable globale
    } catch (error) {
        console.error('Erreur lors de la récupération des travaux :', error);
    }
}
// Appele la fonction pour récupérer les travaux lorsque le chargement de la page est terminé
document.addEventListener('DOMContentLoaded', fetchAndGenerateWorks);

// Fonction pour afficher la modal des travaux
function showWorksPopup() {
    const overlay = document.createElement('div');
    overlay.classList.add('overlay');
    document.body.appendChild(overlay);

    // Création de la popup
    const popup = document.createElement('div');
    popup.classList.add('popup');

    // Création du bouton de fermeture
    const closeButton = document.createElement('i');
    closeButton.classList.add("close-btn", "fa-solid", "fa-xmark");
    closeButton.addEventListener('click', () => {
        document.body.removeChild(overlay);
        document.body.removeChild(popup);
        popUpDiv.innerHTML = "";
    });

    // Création du titre de la popup
    const titlePopUp = document.createElement("h2");
    titlePopUp.innerText = "Galerie Photo";
    titlePopUp.classList.add('tittle__popUp');

    // Ajout des éléments à la popup
    popup.appendChild(titlePopUp);
    popup.appendChild(closeButton);

    // Ajout de la popup à la page
    document.body.appendChild(popup);

    // Génère les travaux dans la popup
    genererTravauxDansPopup(travaux);
    popup.appendChild(lignePopUp);
    popup.appendChild(buttonPopUp);

    // Événement pour ajouter une photo
    buttonPopUp.addEventListener('click', () => {
        popup.innerHTML = "";
        titlePopUp.innerText = "Ajout Photo";
        const formAdd = document.createElement("form");
        formAdd.classList.add("formAdd");

        popup.appendChild(arrowBackIcon);
        popup.appendChild(closeButton);
        popup.appendChild(titlePopUp);
        popup.appendChild(form);
    });

    // Événement pour retourner à la galerie photo
    arrowBackIcon.addEventListener('click', () => {
        popUpDiv.innerHTML = "";
        document.body.removeChild(overlay);
        document.body.removeChild(popup);
        showWorksPopup();
    });
}

// Ajoute un événement pour afficher les travaux dans la popup
const buttonModifier = document.querySelector('.btn__modif');
buttonModifier.addEventListener('click', showWorksPopup);

// Fonction pour générer les travaux dans la pop-up
function genererTravauxDansPopup(travaux) {
    const popup = document.querySelector(".popup");

    popUpDiv.className = "popUpDiv";
    popup.appendChild(popUpDiv);
    for (let i = 0; i < travaux.length; i++) {
        const travail = travaux[i];

        // Création d'une balise dédiée à un travail   
        const travailElement = document.createElement("div");
        travailElement.classList.add("travail__popup");

        // Création de l'icône de poubelle
        const trashIcon = document.createElement("i");
        const id = travaux[i].id;
        trashIcon.classList.add("fa-solid", "fa-trash-can", "trash__icon");

        // Ajout d'un écouteur d'événements pour la suppression du travail associé
        trashIcon.addEventListener('click', async () => {
            const id = travail.id;
            travaux = travaux.filter(work => work.id !== id);
            sectionFigure.innerHTML = "";
            popUpDiv.innerHTML = "";
            lignePopUp.remove();
            buttonPopUp.remove();
            genererTravauxDansPopup(travaux);
            genererTravaux(travaux);
            await supprimerTravailDansModal(id);
            popup.appendChild(lignePopUp);
            popup.appendChild(buttonPopUp);

            // Affiche un message de succès
            const divSuccesUpload = document.createElement('div');
            divSuccesUpload.classList.add("div__success", "div__success--delet");
            const pSucces = document.createElement('p');
            pSucces.innerText = "Le travail a été supprimé🗑️";
            divSuccesUpload.appendChild(pSucces);

            popUpDiv.appendChild(divSuccesUpload);

            // Affiche le message de succès et le faire disparaître après 2 secondes
            setTimeout(() => {
                divSuccesUpload.classList.add('show');
            }, 100);

            setTimeout(() => {
                divSuccesUpload.classList.remove('show');
                setTimeout(() => {
                    divSuccesUpload.remove();
                }, 500);
            }, 2100);
        });

        // Création de la balise img pour afficher l'image
        const imageElement = document.createElement("img");
        imageElement.src = travail.imageUrl;
        travailElement.appendChild(trashIcon);
        travailElement.appendChild(imageElement);

        // Ajout du travailElement à la popup
        popUpDiv.appendChild(travailElement);
    }
}

// Fonction pour supprimer un travail dans l'API
async function supprimerTravailDansAPI(id) {
    const token = localStorage.getItem('token');

    if (!token) {
        console.error('Token JWT non trouvé. Redirection vers la page de connexion.');
        return;
    }

    const requestOptions = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    };

    try {
        const response = await fetch(`http://localhost:5678/api/works/${id}`, requestOptions);
        if (!response.ok) {
            throw new Error('Erreur lors de la suppression du travail dans l\'API');
        }
        console.log('Le travail a été supprimé avec succès dans l\'API');
    } catch (error) {
        console.error('Erreur:', error);
    }
}

// Fonction pour supprimer un travail dans la modale et mettre à jour l'affichage
async function supprimerTravailDansModal(id) {
    travaux = travaux.filter(work => work.id !== id);

    popUpDiv.innerHTML = "";
    genererTravauxDansPopup(travaux);

    await supprimerTravailDansAPI(id);
}

// Création des éléments pour le formulaire d'ajout de photo
const dropArea = document.createElement("div");
dropArea.classList.add("drop-it-hot");
dropArea.id = "drop-area";
const form = document.createElement("form");

const labelImage = document.createElement("label");
labelImage.setAttribute("for", "upload-image");
labelImage.id = "preview-image";

const inputImage = document.createElement("input");
inputImage.type = "file";
inputImage.id = "input-image";

const buttonImage = document.createElement("button");
buttonImage.id = "upload-image";
buttonImage.innerText = " + Ajouter photo";

const pImage = document.createElement("p");
pImage.id = "p__Image";
pImage.innerText = "jpg, png : 4mo max";

const imageIcon = document.createElement('i');
imageIcon.classList.add("imageIcon", "fa-regular", "fa-image");

const previewImage = document.createElement("img");
previewImage.src = "";

labelImage.appendChild(imageIcon);
labelImage.appendChild(inputImage);
labelImage.appendChild(buttonImage);
labelImage.appendChild(pImage);

const divTitle = document.createElement("div");
divTitle.classList.add("div__Title");
const labelTitle = document.createElement("label");
labelTitle.textContent = "Titre";
const inputTitle = document.createElement("input");
inputTitle.type = "text";
inputTitle.id = "title";

const labelSelect = document.createElement("label");
labelSelect.textContent = "Catégorie";
labelSelect.classList.add("select");

const select = document.createElement("select");
const arrowSelect = document.createElement("img");
arrowSelect.src = "../assets/icons/Arrow-down.svg.png";
divTitle.appendChild(arrowSelect);

select.addEventListener('click', (event) => {
    event.preventDefault();
    if (arrowSelect.classList.contains('reversArrow')) {
        arrowSelect.classList.remove('reversArrow');
    } else {
        arrowSelect.classList.add('reversArrow');
    }
});

const options = ["Objets", "Appartements", "Hotels & restaurants"];
options.forEach((option, index) => {
    const optionElement = document.createElement("option");
    optionElement.value = index + 1;
    optionElement.textContent = option;
    select.appendChild(optionElement);
});

labelSelect.appendChild(select);

divTitle.appendChild(labelTitle);
divTitle.appendChild(inputTitle);
divTitle.appendChild(labelSelect);
divTitle.appendChild(select);

dropArea.appendChild(labelImage);
form.appendChild(dropArea);
form.appendChild(divTitle);

const ligneAdd = document.createElement("div");
ligneAdd.classList.add('ligne', "add");

const buttonSubmit = document.createElement("button");
buttonSubmit.innerText = "Valider";
buttonSubmit.classList.add("button--green", "buttonSubmit");
form.appendChild(ligneAdd);
form.appendChild(buttonSubmit);

const previewImageA = () => {
    const file = inputImage.files[0];
    labelImage.innerHTML = "";
    labelImage.appendChild(previewImage);

    if (file) {
        const fileReader = new FileReader();
        fileReader.onload = event => {
            previewImage.src = event.target.result;
        };
        fileReader.readAsDataURL(file);
    }
};

inputImage.addEventListener("change", previewImageA);

buttonImage.addEventListener('click', (event) => {
    event.preventDefault();
    inputImage.click();
});

buttonSubmit.addEventListener('click', async (event) => {
    event.preventDefault();
    try {
        const newWork = await ajouterTravailDansAPI();
        if (newWork) {
            travaux.push(newWork);
            sectionFigure.innerHTML = "";
            popUpDiv.innerHTML = "";
            genererTravaux(travaux);
        }
    } catch (error) {
        console.error('Erreur lors de l\'ajout du travail :', error);
    }
});

// Fonction pour ajouter un travail dans l'API et retourner le nouvel élément
async function ajouterTravailDansAPI() {
    const token = localStorage.getItem('token');

    if (!token) {
        console.error('Token JWT non trouvé. Redirection vers la page de connexion.');
        return;
    }

    const file = inputImage.files[0];
    const title = inputTitle.value;
    const category = select.value;

    if (title.trim() === '') {
        const inputTitle = document.getElementById("title");
        inputTitle.placeholder = "Ajouter un titre";
        return;
    }

    const formData = new FormData();
    formData.append('image', file);
    formData.append('title', title);
    formData.append('category', category);

    const requestOptions = {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: formData
    };

    try {
        const response = await fetch('http://localhost:5678/api/works', requestOptions);
        if (!response.ok) {
            throw new Error('Erreur lors de l\'ajout du travail dans l\'API');
        }
        const newWork = await response.json();
        console.log('Le travail a été ajouté avec succès dans l\'API');

        const overlay = document.querySelector('.overlay');
        const popup = document.querySelector('.popup');
        if (overlay) overlay.remove();
        if (popup) popup.remove();

        const divSuccesUpload = document.createElement('div');
        divSuccesUpload.classList.add("div__success");
        const pSucces = document.createElement('p');
        pSucces.innerText = "Le travail a été ajouté✅";
        divSuccesUpload.appendChild(pSucces);
        const body = document.querySelector("body");
        body.appendChild(divSuccesUpload);

        setTimeout(() => {
            divSuccesUpload.classList.add('show');
        }, 100);

        setTimeout(() => {
            divSuccesUpload.classList.remove('show');
            setTimeout(() => {
                divSuccesUpload.remove();
            }, 500);
        }, 2100);

        return newWork;
    } catch (error) {
        console.error('Erreur:', error);
        return null;
    }
}
