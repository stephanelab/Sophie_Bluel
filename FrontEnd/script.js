// Récupération des travaux depuis l'API
const reponse = await fetch ("http://localhost:5678/api/works")
const works = await reponse.json()

// Transformation des travaux en JSON
// const worksJSON = JSON.stringify(works)

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
generateWorks(works)
