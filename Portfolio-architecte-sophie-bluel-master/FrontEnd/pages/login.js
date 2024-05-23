document.addEventListener('DOMContentLoaded', () => {
    const submitButton = document.getElementById('submit');

    // Fonction pour gérer le clic et la pression de touche Entrée
    const handleClickOrEnter = async () => {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
    
        // Création de l'objet de données à envoyer
        const data = {
            email: email,
            password: password
        };
    
        try {
            // Requête POST vers l'API pour se connecter
            const response = await fetch('http://localhost:5678/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
    
            if (response.ok) {
                // Si la connexion réussit, récupérez le token JWT de la réponse
                const jsonResponse = await response.json();
                const token = jsonResponse.token;
    
                // Stockez le token JWT dans le stockage local
                localStorage.setItem('token', token);
    
                // Redirigez vers la page d'édition
                window.location.href = './edit.html';
            } else {
                // Si la connexion échoue, affiche un message d'erreur "E-mail ou mot de passe incorrect"
                const divError = document.getElementById("div__error__message")
                const errorMessageHtml = document.createElement("p");
                divError.innerHTML=""
                divError.classList.add("error__message");
                errorMessageHtml.textContent = "E-mail ou mot de passe incorrect"
                divError.appendChild(errorMessageHtml)
                divError.classList.add('shake');
                setTimeout(() => {
                    divError.classList.remove('shake');
                }, 500);
            }
        } catch (error) {
            console.error('Erreur lors de la connexion :', error);
        }
    };

    // Ajout de l'événement de clic
    submitButton.addEventListener('click', handleClickOrEnter);

    // Ajout de l'événement de pression de touche Entrée
    document.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            handleClickOrEnter();
        }
    });
});



