// Korištenje varijabli iz .env datoteke
const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: "G-X66116E4K7"
};

// Inicijalizacija Firebase (modularna sintaksa za Firebase 9+)
import {
    initializeApp
} from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js';
import {
    getFirestore,
    collection,
    addDoc,
    query,
    orderBy,
    getDocs,
    onSnapshot
} from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js';

// Inicijalizacija aplikacije
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Funkcija za slanje poruke na Firestore
async function sendMessage(messageText) {
    try {
        await addDoc(collection(db, "messages"), {
            text: messageText,
            timestamp: new Date() // Pohranjuje vrijeme poruke
        });
        console.log("Message sent!");
    } catch (error) {
        console.error("Error sending message:", error);
    }
}

// Funkcija za dohvat poruka s Firestore
async function loadMessages() {
    const messagesContainer = document.getElementById('notes');
    messagesContainer.innerHTML = ''; // Očisti prethodne poruke

    try {
        const q = query(collection(db, "messages"), orderBy("timestamp"));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {
            const message = doc.data();
            const messageElement = document.createElement('p');
            messageElement.textContent = message.text;
            messagesContainer.appendChild(messageElement);
        });
    } catch (error) {
        console.error("Error loading messages:", error);
    }
}

// Automatsko ažuriranje poruka u stvarnom vremenu
const unsubscribe = onSnapshot(query(collection(db, "messages"), orderBy("timestamp")), (snapshot) => {
    const messagesContainer = document.getElementById('notes');
    messagesContainer.innerHTML = ''; // Očisti prethodne poruke

    snapshot.forEach(doc => {
        const message = doc.data();
        const messageElement = document.createElement('p');
        messageElement.textContent = message.text;
        messagesContainer.appendChild(messageElement);
    });
});

// Event listener za slanje poruka
document.getElementById('sendMessage').addEventListener('click', () => {
    const messageText = document.getElementById('noteInput').value;
    if (messageText.trim() !== '') { // Provjeri je li unos nije prazan
        sendMessage(messageText);
        document.getElementById('noteInput').value = ''; // Očisti input nakon slanja
    }
});

// Učitaj poruke kada se stranica učita
window.onload = loadMessages;
