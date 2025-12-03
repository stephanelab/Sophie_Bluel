// Récupération des travaux enregistrés dans le localStorage
const imagesModalJSON = localStorage.getItem("works")
let imagesModal = JSON.parse(imagesModalJSON)

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

const stopPropagation = function (e) {
    e.stopPropagation()
}

function changementDePage(index) {
    pageModal = index
    gestionPagesModal()
}

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

            const imagesContainerModal = document.createElement("div")
            imagesContainerModal.classList.add("liste-image-modal")
            for (let i = 0; i < imagesModal.length; i++) {
                const figure = document.createElement("figure")
                figure.classList.add("figure-modal")

                const img = document.createElement("img")
                img.src = imagesModal[i].imageUrl
                figure.appendChild(img)

                const icone = document.createElement("i")
                icone.classList.add("fa-solid", "fa-trash-can", "icon-delete")
                figure.appendChild(icone)

                imagesContainerModal.appendChild(figure)
            }
            modalWrapper.appendChild(imagesContainerModal)
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
            break
        default:
            break
    }
}