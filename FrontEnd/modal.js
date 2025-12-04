// Récupération des travaux enregistrés dans le localStorage
// const imagesModalJSON = localStorage.getItem("works")
// let imagesModal = JSON.parse(imagesModalJSON)
import { fetchWorks } from "./script.js";

const imagesModal = await fetchWorks()

let modP = null
let pageModal = 0

// Fonction ouverture de la modale
export function openModal() {
    pageModal = 1
    modal.style.display = null
    modal.removeAttribute("aria-hidden")
    modal.setAttribute("aria-modal", "true")
    modP = modal
    modal.addEventListener("click", closeModal)
    modal.querySelector(".fa-xmark").addEventListener("click", closeModal)
    modal.querySelector(".modal-wrapper").addEventListener("click", stopPropagation)
    gestionPagesModal()
}

// Fonction fermeture de la modale
function closeModal() {
    if (!modP) return
    pageModal = 0
    modal.style.display = "none"
    modal.setAttribute("aria-hidden", "true")
    modal.removeAttribute("aria-modal")
    modal.removeEventListener("click", closeModal)
    modal.querySelector(".fa-xmark").removeEventListener("click", closeModal)
    modal.querySelector(".modal-wrapper").removeEventListener("click", stopPropagation)
    modP = null
}

// Empêcher la fermeture de la modale au clic dans la fenêtre modale
const stopPropagation = function (e) {
    e.stopPropagation()
}

// Fonction changement de page dans la modale
function changementDePage(index) {
    pageModal = index
    gestionPagesModal()
}

// Retour sur la 1ère page de la modale
const backModalIcon = document.querySelector(".leftArrow")
backModalIcon.addEventListener("click", function() {
    changementDePage(1)
})

// Création des éléments de la modale
function gestionPagesModal() {    
    switch (pageModal) {
        case 1:
            console.log (pageModal)
            const modalWrapper = document.querySelector(".modal-wrapper")

            // 🧹 Supprimer ANCIENNE liste d’images (si elle existe)
            const oldList = modalWrapper.querySelector(".liste-image-modal")
            if (oldList) oldList.remove()

            // 🧹 Supprimer ANCIEN bouton (si il existe)
            const oldBtn = modalWrapper.querySelector(".btn-add-photo")
            if (oldBtn) oldBtn.remove()

            // Création de la liste d’images dans la modale
            const imagesContainerModal = document.createElement("div")
            imagesContainerModal.classList.add("liste-image-modal")
            for (let i = 0; i < imagesModal.length; i++) {
                const figure = document.createElement("figure")
                figure.classList.add("figure-modal")

                // Création de l'image
                const img = document.createElement("img")
                img.src = imagesModal[i].imageUrl
                figure.appendChild(img)

                // Création de l'icône de suppression
                const icone = document.createElement("i")
                icone.classList.add("fa-solid", "fa-trash-can", "icon-delete")
                figure.appendChild(icone)

                imagesContainerModal.appendChild(figure)
            }
            modalWrapper.appendChild(imagesContainerModal)

            // Création du bouton Ajouter une photo
            const btnAddPhoto = document.createElement("button")
            btnAddPhoto.classList.add("btn-add-photo")
            btnAddPhoto.innerText = "Ajouter une photo"
            modalWrapper.appendChild(btnAddPhoto)

            // Effacement de la flèche gauche sur la première page de la modale
            backModalIcon.classList.remove("fa-arrow-left")

            // Ecoute du bouton Ajouter une photo pour changement de page
            btnAddPhoto.addEventListener("click", function() {
                changementDePage(2)
                imagesContainerModal.remove()
                btnAddPhoto.remove()
            })
            break
        case 2:
            console.log (pageModal)
            
            // Réaffichage de la flèche gauche sur la première page de la modale
            backModalIcon.classList.add("fa-arrow-left")

            // Modif du texte du h3
            const modalH3 = document.querySelector(".modal-wrapper h3")
            modalH3.innerText = "Ajout photo"

            //Création du formulaire d'ajout de photo
            const modalWrapperP2 = document.querySelector(".modal-wrapper")

            const formAddPhoto = document.createElement("form")
            formAddPhoto.classList.add("form-add-photo")
            modalWrapperP2.appendChild(formAddPhoto)

            // Champ input type fichier pour l'image
            const inputFile = document.createElement("input")
            inputFile.type = "file"
            inputFile.accept = "image/png, image/jpeg"
            inputFile.id = "image-file"
            formAddPhoto.appendChild(inputFile)

            // Champ input type texte pour le titre
            const divTitle = document.createElement("div")
            formAddPhoto.appendChild(divTitle)
            const labelTitle = document.createElement("label")
            labelTitle.innerText = "Titre"
            divTitle.appendChild(labelTitle)
            const inputTitle = document.createElement("input")
            inputTitle.type = "text"
            inputTitle.id = "image-title"
            divTitle.appendChild(inputTitle)

            break
        default:
            break
    }
}