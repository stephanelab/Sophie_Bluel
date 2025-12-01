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
    try {
        const response = await fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: loginDataJson
        })
        const Data = await response.json()
        const token = Data.token
        localStorage.setItem("token", token)
        window.location.href = "index.html"
    } catch (error) {
        console.error("Erreur lors de la requête :", error)
    }
})