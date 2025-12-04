import { openModal } from "./modal.js";

// Récupération des travaux depuis l'API
const reponse = await fetch ("http://localhost:5678/api/works")
const works = await reponse.json()

// Enregistrement des travaux en local pour la modale
localStorage.setItem("works", JSON.stringify(works))

// Génération des travaux dans la galerie
export function generateWorks(works) {
    // const imagesModal = []
    for (let i = 0; i < works.length; i++) {
        const work = works[i]

        // Récupération de l'élément du DOM qui acceuillera la galerie
        const gallery = document.querySelector(".gallery")

        // Création des éléments HTML pour chaque travail
        const workElement = document.createElement("figure")
        workElement.dataset.id = work.id

        // Création des balises image et figcaption
        const imageElement = document.createElement("img")
        const captionElement = document.createElement("figcaption")
        
        // Insertion des images et figcaption
        imageElement.src = work.imageUrl
        captionElement.innerText = work.title

        // Ajout des éléments dans le DOM
        gallery.appendChild(workElement)
        workElement.appendChild(imageElement)
        workElement.appendChild(captionElement)
    }
}

// Récupération des catégories depuis l'API
const reponseCategories = await fetch ("http://localhost:5678/api/categories")
const categories = await reponseCategories.json()

// Fonction d'affichage des boutons de filtre des travaux
function createFilterButtons() {
    const divFilterButtons = document.createElement("div")
    divFilterButtons.classList.add("filter-buttons")
    document.querySelector("#portfolio").insertBefore(divFilterButtons, document.querySelector(".gallery"))

    const buttonAll = document.createElement("button")
    buttonAll.classList.add("all", "active")
    buttonAll.innerText = "Tous"    
    divFilterButtons.appendChild(buttonAll)

    for (let i = 0; i < categories.length; i++) {
        const category = categories[i]
        const buttonCategory = document.createElement("button")
        buttonCategory.classList.add("category_" + category.id)
        buttonCategory.innerText = category.name
        divFilterButtons.appendChild(buttonCategory)
    }
}

createFilterButtons()

// Fonction filtres
function filters (categoryId) {    
    const galleryFiltered = works.filter(function(work) {
        return work.category.id == categoryId
    })
    updateFilter()
    document.querySelector(".gallery").innerHTML = ""
    generateWorks(galleryFiltered)    
}

let activeFilter = 0

// Ajout des écouteurs d'événements aux boutons de filtre selon les catégories récupérées
for (let j = 0; j < categories.length; j++) {
    const category = categories[j]
    const buttonCategory = document.querySelector(".category_" + category.id)

    buttonCategory.addEventListener("click", function() {
        activeFilter = j + 1
        filters (category.id)
    })
}

// Bouton du filtre "Tous"
const btnFilterAll = document.querySelector(".all");

btnFilterAll.addEventListener("click", function() {
    activeFilter = 0
    updateFilter()
    document.querySelector(".gallery").innerHTML = ""
    generateWorks(works)
})

// Apparence du filtre sélectionné
const filterButtons = document.querySelectorAll("button")

function updateFilter() {
    filterButtons.forEach((button,index) => {
        if (index === activeFilter) {
            button.classList.add("active")
        } else {
            button.classList.remove("active")
        }
    })
}

const token = sessionStorage.getItem("token")
if (token) {
    // Ajout de la barre "Mode édition"
    const modeEditionBar = document.createElement("div")
    modeEditionBar.innerHTML = `<i class="fa-regular fa-pen-to-square"></i> Mode édition`
    modeEditionBar.classList.add("mode-edition-bar")
    document.querySelector("header").insertBefore(modeEditionBar, document.querySelector(".header-container"))

    // Modification de login en logout
    const loginText = document.getElementById("loginLink")
    loginText.innerText = "logout"
    loginText.href = "#"

    // Effacement des filtres
    const filterDiv = document.querySelector(".filter-buttons")
    filterDiv.style.display = "none"

    // Ajout du bouton de modification
    const modificationButton = document.createElement("button")
    modificationButton.classList.add("modification-button")
    modificationButton.innerHTML = `<i class="fa-regular fa-pen-to-square"></i> modifier`
    const projectDiv= document.querySelector(".projects")
    projectDiv.appendChild(modificationButton)
    
    // Ouverture de la modale au clic sur le bouton de modification
    modificationButton.addEventListener("click", openModal)

    console.log(token)
} else {
    console.log("Pas de token")
}

// Déconnexion
const loginLink = document.getElementById("loginLink")
loginLink.addEventListener("click", function(event) {
    if (token) {
        sessionStorage.removeItem("token")
        window.location.href = "index.html"
    }
})


generateWorks(works)