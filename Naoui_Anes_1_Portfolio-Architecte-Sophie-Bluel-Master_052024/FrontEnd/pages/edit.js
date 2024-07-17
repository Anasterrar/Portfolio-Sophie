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

// Ouvrir la modal
function showWorksPopup() {
    const overlay = document.createElement('div');
    overlay.classList.add('overlay');
    document.body.appendChild(overlay);

    // Création de la popup
    const popup = document.createElement('div');
    popup.classList.add('popup');

    // Création du bouton de fermeture
    const closeButton = document.createElement('i');
    closeButton.classList.add("close-btn","fa-solid", "fa-xmark");
    closeButton.addEventListener('click', () => {
        document.body.removeChild(overlay);
        document.body.removeChild(popup);
        popUpDiv.innerHTML = ""
    });
    // Création du bouton du titre
    const titlePopUp = document.createElement("h2")
    titlePopUp.innerText="Galerie Photo"
    titlePopUp.classList.add('tittle__popUp');

    // Ajout
    popup.appendChild(titlePopUp);
    popup.appendChild(closeButton);

    // Ajout de la popup à la page
    document.body.appendChild(popup);

    // Génére les travaux dans la popup
    genererTravauxDansPopup(travaux);
    popup.appendChild(lignePopUp);
    popup.appendChild(buttonPopUp);

    buttonPopUp.addEventListener('click',() => {
        popup.innerHTML=""
        titlePopUp.innerText="Ajout Photo"
        const formAdd = document.createElement("form")
        formAdd.classList.add("formAdd")

        popup.appendChild(arrowBackIcon);
        popup.appendChild(closeButton);
        popup.appendChild(titlePopUp);
        popup.appendChild(form);
    });

    arrowBackIcon.addEventListener('click', () => {
        popUpDiv.innerHTML=""
        document.body.removeChild(overlay);
        document.body.removeChild(popup);
        showWorksPopup()
    });
}
// Ajoute un événement pour afficher les travaux dans la popup
const buttonModifier = document.querySelector('.btn__modif');
buttonModifier.addEventListener('click', showWorksPopup);

// Fonction pour générer les travaux dans la pop-up
function genererTravauxDansPopup(travaux) {

// Récupération de l'élément de la pop-up qui accueillera les travaux
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

// Récupére l'identifiant unique du travail à supprimer
const id = travail.id;
        
// Supprime le travail avec l'identifiant spécifié
travaux = travaux.filter(work => work.id !== id);
        
// Mettre à jour l'affichage
            sectionFigure.innerHTML = "";
            popUpDiv.innerHTML = "";
            lignePopUp.remove();
            buttonPopUp.remove();
            genererTravauxDansPopup(travaux);
            genererTravaux(travaux);
            // Appel à la fonction pour supprimer le travail dans l'API
            supprimerTravailDansAPI(id);
            // Appeler la nouvelle fonction de suppression
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
        // Définit la hauteur de l'image à 30px
        travailElement.appendChild(trashIcon);
        travailElement.appendChild(imageElement);

        // Ajout du travailElement à la popup
        popUpDiv.appendChild(travailElement);
     }
}

async function supprimerTravailDansAPI(id) {
    // Récupére le token JWT stocké côté client
    const token = localStorage.getItem('token'); // ou récupérez le token d'un cookie sécurisé
    
    // Vérifie si le token JWT est présent
    if (!token) {
        console.error('Token JWT non trouvé. Redirection vers la page de connexion.');
        return;
    }
    // Configuration de la requête avec le token JWT dans l'en-tête
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
    // Supprime le travail avec l'identifiant spécifié
    travaux = travaux.filter(work => work.id !== id);
    
    // Met à jour l'affichage dans la modale
    popUpDiv.innerHTML = "";
    genererTravauxDansPopup(travaux);

    // Appel à la fonction pour supprimer le travail dans l'API
    await supprimerTravailDansAPI(id);
}

// Création de l'élément div principal avec la classe "drop-it-hot" et l'ID "drop-area"
    const dropArea = document.createElement("div");
    dropArea.classList.add("drop-it-hot");
    dropArea.id = "drop-area";
    const form = document.createElement("form");
    
    // Création de l'étiquette pour la sélection d'image
    const labelImage = document.createElement("label");
    labelImage.setAttribute("for", "upload-image");
    labelImage.id = "preview-image";
    
    // Création de l'input pour télécharger l'image
    const inputImage = document.createElement("input");
    inputImage.type = "file";
    inputImage.id = "input-image";
    
    const buttonImage = document.createElement("button");
    buttonImage.id = "upload-image";
    buttonImage.innerText = " + Ajouter photo"

    const pImage = document.createElement("p");
    pImage.id = "p__Image";
    pImage.innerText = "jpg, png : 4mo max"

    // Création de l'icon
    const imageIcon = document.createElement('i');
    imageIcon.classList.add("imageIcon","fa-regular", "fa-image");
    
    // Création de l'image de prévisualisation
    const previewImage = document.createElement("img");
    previewImage.src = "";
    
    // Ajout de l'input et de l'image à l'étiquette de l'image
    labelImage.appendChild(imageIcon);
    labelImage.appendChild(inputImage);
    labelImage.appendChild(buttonImage);
    labelImage.appendChild(pImage);
    
    // Création de la zone pour le titre
    const divTitle = document.createElement("div");
    divTitle.classList.add("div__Title");
    const labelTitle = document.createElement("label");
    labelTitle.textContent = "Titre";
    const inputTitle = document.createElement("input");
    inputTitle.type = "text";
    inputTitle.id = "title";

    // Création de l'élément label
const labelSelect = document.createElement("label");
labelSelect.textContent = "Catégorie";
labelSelect.classList.add("select");

// Création de l'élément select
const select = document.createElement("select");
const arrowSelect = document.createElement("img");
arrowSelect.src = "../assets/icons/Arrow-down.svg.png"
divTitle.appendChild(arrowSelect)


select.addEventListener('click', (event) => {
    // Empêche le comportement par défaut du bouton
    event.preventDefault();

    // Vérifie si la classe "reversArrow" est présente
    if (arrowSelect.classList.contains('reversArrow')) {
        // Si oui, supprime la classe "reversArrow"
        arrowSelect.classList.remove('reversArrow');
    } else {
        // Sinon, ajoute la classe "reversArrow"
        arrowSelect.classList.add('reversArrow');
    }
});

// Ajout des options à la liste déroulante
const options = ["Objets", "Appartements", "Hotels & restaurants"];
options.forEach((option, index) => {
    const optionElement = document.createElement("option");
    optionElement.value = index + 1;
    optionElement.textContent = option;
    select.appendChild(optionElement);
});


// Ajout de l'élément select à l'élément label
    labelSelect.appendChild(select);
    
    // Ajout du label et de l'input pour le titre à la zone du titre
    divTitle.appendChild(labelTitle);
    divTitle.appendChild(inputTitle);
    divTitle.appendChild(labelSelect);
    divTitle.appendChild(select);
    
    // Ajout de l'étiquette de l'image et de la zone du titre au formulaire
    dropArea.appendChild(labelImage);
    form.appendChild(dropArea);
    form.appendChild(divTitle);

    const ligneAdd = document.createElement("div");
    ligneAdd.classList.add('ligne', "add");

    const buttonSubmit = document.createElement("button");
    buttonSubmit.innerText = "Valider";
    buttonSubmit.classList.add("button--green", "buttonSubmit");
    form.appendChild(ligneAdd)
    form.appendChild(buttonSubmit)

    const previewImageA = () => {
        const file = inputImage.files[0];
        labelImage.innerHTML = ""
        labelImage.appendChild(previewImage);
     
        if (file) {
            const fileReader = new FileReader();
            fileReader.onload = event => {
                previewImage.src = event.target.result;
            }
            fileReader.readAsDataURL(file);
        }
    }
    
    inputImage.addEventListener("change", previewImageA);
    

// Ajoute un gestionnaire d'événements pour l'événement click
buttonImage.addEventListener('click', (event) => {
    event.preventDefault();
    inputImage.click();
});

// Ajoute un gestionnaire d'événements pour l'événement click sur le bouton de soumission
buttonSubmit.addEventListener('click', async (event) => {
    event.preventDefault();
    try {
        const newWork = await ajouterTravailDansAPI();
        if (newWork) {
            travaux.push(newWork); // Ajoutez le nouvel élément à la liste des travaux
            sectionFigure.innerHTML = "";
            popUpDiv.innerHTML = "";
            genererTravaux(travaux); // Mettez à jour l'affichage avec la nouvelle liste
        }
    } catch (error) {
        console.error('Erreur lors de l\'ajout du travail :', error);
    }
});

// Fonction pour ajouter un travail dans l'API et retourner le nouvel élément
async function ajouterTravailDansAPI() {
    // Récupérer le token JWT stocké côté client
    const token = localStorage.getItem('token');
    
    // Vérifie si le token JWT est présent
    if (!token) {
        console.error('Token JWT non trouvé. Redirection vers la page de connexion.');
        return;
    }
    
    // Récupére les valeurs des inputs
    const file = inputImage.files[0];
    const title = inputTitle.value;
    const category = select.value;
    
    // Vérifie si le champ de titre est vide
    if (title.trim() === '') {
        // Affiche un message d'erreur
        const inputTitle = document.getElementById("title")
        inputTitle.placeholder = "Ajouter un titre";
        return;
    }
    
    // Crée un objet FormData pour envoyer les données
    const formData = new FormData();
    formData.append('image', file);
    formData.append('title', title);
    formData.append('category', category);
    
    // Configuration de la requête avec le token JWT dans l'en-tête et les données du formulaire
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

        // Supprime les éléments overlay et popup s'ils existent
        const overlay = document.querySelector('.overlay');
        const popup = document.querySelector('.popup');
        if (overlay) overlay.remove();
        if (popup) popup.remove();

        // Affiche un message de succès
        const divSuccesUpload = document.createElement('div');
        divSuccesUpload.classList.add("div__success");
        const pSucces = document.createElement('p');
        pSucces.innerText = "Le travail a été ajouté✅";
        divSuccesUpload.appendChild(pSucces);
        const body = document.querySelector("body");
        body.appendChild(divSuccesUpload);

        // Affiche le message de succès
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
