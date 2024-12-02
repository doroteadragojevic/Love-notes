// Importanje potrebnih paketa
const express = require('express');
const firebaseAdmin = require('firebase-admin');
require('dotenv').config(); // Učitavanje environment varijabli iz .env

// Inicijalizacija Firebase Admin SDK
const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_KEY);
firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount),
    databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`
});

// Kreiranje Express aplikacije
const app = express();
app.use(express.json()); // Za parsiranje JSON podataka
app.use(express.static('public')); // Poslužitelj za statičke datoteke

// Postavljanje port-a
const port = process.env.PORT || 3000;

// Ruta za dohvat poruka iz Firestore
app.get('/messages', async (req, res) => {
    try {
        const snapshot = await firebaseAdmin.firestore().collection('messages').orderBy('timestamp').get();
        const messages = snapshot.docs.map(doc => doc.data());
        res.json(messages); // Vraća poruke kao JSON
    } catch (error) {
        console.error('Error getting messages:', error);
        res.status(500).send('Error getting messages');
    }
});

// Ruta za slanje poruka u Firestore
app.post('/messages', async (req, res) => {
    const {
        text
    } = req.body;
    if (!text) {
        return res.status(400).send('Message text is required');
    }

    try {
        await firebaseAdmin.firestore().collection('messages').add({
            text: text,
            timestamp: firebaseAdmin.firestore.FieldValue.serverTimestamp() // Pohranjuje vrijeme poruke
        });
        res.status(201).send('Message sent');
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).send('Error sending message');
    }
});

// Pokretanje servera
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
