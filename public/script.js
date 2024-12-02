// Funkcija za dohvat poruka
async function loadMessages() {
    try {
        const response = await fetch('/messages');
        const messages = await response.json();

        const messagesContainer = document.getElementById('notes');
        messagesContainer.innerHTML = ''; // Očisti prethodne poruke

        messages.forEach(message => {
            const messageElement = document.createElement('p');
            messageElement.textContent = message.text;
            messagesContainer.appendChild(messageElement);
        });
    } catch (error) {
        console.error("Error loading messages:", error);
    }
}

// Funkcija za slanje poruke
async function sendMessage(messageText) {
    try {
        await fetch('/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text: messageText
            })
        });
        console.log("Message sent!");
        loadMessages(); // Ponovno učitaj poruke nakon slanja
    } catch (error) {
        console.error("Error sending message:", error);
    }
}

// Event listener za slanje poruka
document.getElementById('sendMessage').addEventListener('click', () => {
    const messageText = document.getElementById('noteInput').value;
    if (messageText.trim() !== '') {
        sendMessage(messageText);
        document.getElementById('noteInput').value = ''; // Očisti input nakon slanja
    }
});

// Učitaj poruke kada se stranica učita
window.onload = loadMessages;
