// Récupération des travaux depuis l'API
const reponse = await fetch ("http://localhost:5678/api/works")
const works = await reponse.json()

// Génération des travaux dans la galerie
function generateWorks(works) {
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

// Ajout des boutons de filtre des travaux
const divFilterButtons = document.createElement("div")
divFilterButtons.classList.add("filter-buttons")
document.querySelector("#portfolio").insertBefore(divFilterButtons, document.querySelector(".gallery"))


const buttonAll = document.createElement("button")
buttonAll.classList.add("all", "active")
buttonAll.innerText = "Tous"

const buttonObjects = document.createElement("button")
buttonObjects.classList.add("objects")
buttonObjects.innerText = "Objets"

const buttonAppartments = document.createElement("button")
buttonAppartments.classList.add("appartments")
buttonAppartments.innerText = "Appartements"

const buttonHotelsRestaurants = document.createElement("button")
buttonHotelsRestaurants.classList.add("hotels_restaurants")
buttonHotelsRestaurants.innerText = "Hotels & restaurants"

divFilterButtons.appendChild(buttonAll)
divFilterButtons.appendChild(buttonObjects)
divFilterButtons.appendChild(buttonAppartments)
divFilterButtons.appendChild(buttonHotelsRestaurants)

// Fonction filtres
function Filters (categoryName) {    
        const galleryFiltered = works.filter(function(work) {
            return work.category.name == categoryName
        })
        updateFilter()
        document.querySelector(".gallery").innerHTML = ""
        generateWorks(galleryFiltered)
    
}

let activeFilter = 0

// Boutons du filtre "Objets"
const btnFilterObjects = document.querySelector(".objects")

btnFilterObjects.addEventListener("click", function() {
    activeFilter = 1
    Filters ("Objets")
     })

// Bouton du filtre "Appartements"
const btnFilterAppartments = document.querySelector(".appartments")

btnFilterAppartments.addEventListener("click", function() {
    activeFilter = 2 
    Filters ("Appartements")
     })

// Bouton du filtre "Hotels & restaurants"
const btnFilterHR = document.querySelector(".hotels_restaurants")

btnFilterHR.addEventListener("click", function() {
    activeFilter = 3 
    Filters ("Hotels & restaurants")
     })

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

generateWorks(works)