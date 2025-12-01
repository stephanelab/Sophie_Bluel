const connexion = document.getElementById("login-section")
connexion.addEventListener("submit", async function(event) {
    event.preventDefault()
    // Création de l'objet de login
    const loginData = {
        email: document.getElementById("email").value,
        password: document.getElementById("password").value
    }
    // Transformation de l'objet en JSON
    const loginDataJson = JSON.stringify(loginData)

    // Envoi de la requête POST au serveur
    let token = ""
    try {
        const response = await fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: loginDataJson
        })
        if (!response.ok) {
            throw new Error("Utilisateur ou mot de passe incorrect")
        }
        const Data = await response.json()
        token = Data.token
        localStorage.setItem("token", token)
        window.location.href = "index.html"
    } catch (error) {
        console.error("Erreur lors de la requête :", error)
        // Ajout du message d'erreur dans le DOM
        let texteErreur = document.createElement("p")
        if (!document.querySelector(".messageErreur")) {        
            texteErreur.style.color = "red"
            texteErreur.style.fontSize = "18px"
            texteErreur.style.textDecoration = "none"
            texteErreur.classList.add("messageErreur")
            texteErreur.innerText = "Utilisateur ou mot de passe incorrect"
            document.querySelector("#login-section").insertBefore(texteErreur, document.querySelector("p"))
        }
    }
})