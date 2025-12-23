// Récupération des travaux et des catégories via l'API'
import { fetchWorks, generateWorks } from "./script.js";
let imagesModal = await fetchWorks()

import { fetchCategories } from "./script.js";
const categories = await fetchCategories()

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
    const formP2 = document.querySelector(".form-add-photo")
    if (formP2) formP2.remove()
    const successMessage = document.querySelector(".success-message")
    if (successMessage) successMessage.remove()
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
    const formP2 = document.querySelector(".form-add-photo")
    if (formP2) formP2.remove()
    const successMessage = document.querySelector(".success-message")
    if (successMessage) successMessage.remove()
    const modalH3 = document.querySelector(".modal-wrapper h3")
    modalH3.innerText = "Galerie photo"
    changementDePage(1)
})

// Fonction de suppression d'un travail via l'API
async function deleteWork(workId) {
    const token = sessionStorage.getItem("token")    
    const response = await fetch(`http://localhost:5678/api/works/${workId}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
    if (!response.ok) {
        throw new Error("Erreur lors de la suppression du travail")
    }
    imagesModal = await fetchWorks()
    gestionPagesModal()
    
    // Rechargement des travaux dans la galerie principale
    const oldgallery = document.querySelector(".gallery")
    oldgallery.innerHTML = ""
    generateWorks(imagesModal)
}


// fonction envoi du formulaire
async function submitForm(token, formData) {
    try {
        // Suppression du message de succès d'ajout de projet s'il existe
        const oldMessage = document.querySelector(".success-message")
        if (oldMessage) oldMessage.remove()

        const response = await fetch("http://localhost:5678/api/works", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: formData
        })
        const data = await response.json()
        
        //Effacement du formulaire d'ajout de photo
        const formP2 = document.querySelector(".form-add-photo")
        if (formP2) formP2.remove()
        
        // Actualisation de la page
        imagesModal = await fetchWorks()
        gestionPagesModal()

        // Rechargement des travaux dans la galerie principale après fermeture de la modale
        const oldgallery = document.querySelector(".gallery")
        oldgallery.innerHTML = ""
        generateWorks(imagesModal)

        // Ajout du message de succès
        const modalWrapper = document.querySelector(".modal-wrapper")
        const successMessage = document.createElement("p")
        successMessage.classList.add("success-message")
        successMessage.innerText = "Photo "  + data.title + " ajoutée avec succès !"
        modalWrapper.appendChild(successMessage)
        
    } catch (error) {
        console.error("Erreur :", error)
    }
}

// Fonction de validation de formulaire
function validateForm() {
    const inputFile = document.getElementById("image-file")
    const inputTitle = document.getElementById("image-title")
    const selectCategory = document.getElementById("image-category")
    const btnSubmit = document.querySelector(".btn-submit-photo")
    if (inputFile.files.length > 0 && inputTitle.value.trim() !== "" && selectCategory.value !== "") {
        console.log(selectCategory.value)
        btnSubmit.disabled = false
    } else {
        btnSubmit.disabled = true
    }
    // Écoute des changements dans les champs du formulaire
    inputFile.addEventListener("change", validateForm)
    inputTitle.addEventListener("input", validateForm)
    selectCategory.addEventListener("change", validateForm)
}

// Création des éléments de la modale
function gestionPagesModal() {    
    switch (pageModal) {
        case 1:
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
                icone.dataset.id = imagesModal[i].id // Ajout de l'ID du travail à l'icône
                icone.addEventListener("click", () => {
                    const workId = icone.dataset.id
                    deleteWork(workId)
                })
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

            // Zone complète de l'upload
            const divUpload = document.createElement("div")
            divUpload.classList.add("upload-zone")
            formAddPhoto.appendChild(divUpload)

            // Icône image
            const uploadIcon = document.createElement("i")
            uploadIcon.classList.add("fa-regular", "fa-image")
            uploadIcon.classList.add("upload-icon")
            divUpload.appendChild(uploadIcon)

            // Bouton "Ajouter photo"
            const btnAddPhotoUp = document.createElement("label")
            btnAddPhotoUp.innerText = "+ Ajouter photo"
            btnAddPhotoUp.classList.add("but-add-photo")
            btnAddPhotoUp.setAttribute("for", "image-file")
            divUpload.appendChild(btnAddPhotoUp)

            // Info formats
            const infoText = document.createElement("p")
            infoText.innerText = "jpg, png : 4mo max"
            infoText.classList.add("info-text")
            divUpload.appendChild(infoText)

            // L'input file (invisible)
            const inputFile = document.createElement("input")
            inputFile.type = "file"
            inputFile.accept = "image/png, image/jpeg"
            inputFile.id = "image-file"
            inputFile.style.display = "none"
            formAddPhoto.appendChild(inputFile)

            // Image de preview (invisible au début)
            const previewImg = document.createElement("img")
            previewImg.classList.add("preview-img")
            previewImg.style.display = "none"
            divUpload.appendChild(previewImg)


            // Gestion de l'affichage du preview
            inputFile.addEventListener("change", () => {
                const file = inputFile.files[0]
                if (!file) return

                if (file.size > 4 * 1024 * 1024) {
                    alert("Le fichier est trop volumineux. La taille maximale est de 4 Mo.")
                    inputFile.value = "" // Réinitialiser le champ input
                } else {
                    const reader = new FileReader()
                    reader.onload = e => {
                        previewImg.src = e.target.result
                        previewImg.style.display = "block"

                        // On cache les éléments inutiles après l'upload
                        uploadIcon.style.display = "none"
                        btnAddPhotoUp.style.display = "none"
                        infoText.style.display = "none"
                    }
                    reader.readAsDataURL(file)
                }
            })

            // Champ input type texte pour le titre
            const divTitle = document.createElement("div")
            divTitle.classList.add("field")
            formAddPhoto.appendChild(divTitle)
            const labelTitle = document.createElement("label")
            labelTitle.innerText = "Titre"
            divTitle.appendChild(labelTitle)
            const inputTitle = document.createElement("input")
            inputTitle.type = "text"
            inputTitle.id = "image-title"
            divTitle.appendChild(inputTitle)

            // Champ select pour la catégorie
            const divCategory = document.createElement("div")
            divCategory.classList.add("field", "category-field")
            formAddPhoto.appendChild(divCategory)
            const labelCategory = document.createElement("label")
            labelCategory.innerText = "Catégorie"
            divCategory.appendChild(labelCategory)
            const selectCategory = document.createElement("select")
            selectCategory.id = "image-category"
            divCategory.appendChild(selectCategory)
            for (let i = 0; i < categories.length; i++) {
                const category = categories[i]
                const optionCategory = document.createElement("option")
                optionCategory.value = category.id
                optionCategory.innerText = category.name
                selectCategory.appendChild(optionCategory)
            }

            selectCategory.selectedIndex = -1 // Pas de sélection par défaut

            // Bouton Valider
            const btnSubmit = document.createElement("button")
            btnSubmit.type = "submit"
            btnSubmit.classList.add("btn-submit-photo")
            btnSubmit.innerText = "Valider"
            formAddPhoto.appendChild(btnSubmit)
            
            // Envoi du formulaire d'ajout de photo vers l'API
            const form = document.querySelector(".form-add-photo")
            validateForm() // Initialisation de l'état du bouton submit
            form.addEventListener("submit", async (event) => {
                event.preventDefault()
                const token = sessionStorage.getItem("token")
                const formData = new FormData()
                formData.append("image", document.getElementById("image-file").files[0])
                formData.append("title", document.getElementById("image-title").value)
                formData.append("category", document.getElementById("image-category").value)
                await submitForm(token, formData)
            })

            break
        default:
            break
    }
}