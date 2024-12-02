// script.js

// Funkcija za učitavanje poruka iz localStorage
function loadNotes() {
    const notesContainer = document.getElementById('notes');
    const savedNotes = JSON.parse(localStorage.getItem('loveNotes')) || []; // Učitaj poruke iz localStorage, ili praznu listu ako nema
    savedNotes.forEach(note => {
        const newNote = document.createElement('div');
        newNote.classList.add('note');
        newNote.textContent = note;
        notesContainer.appendChild(newNote);
    });
}

// Funkcija za spremanje poruka u localStorage
function saveNoteToLocalStorage(noteText) {
    const savedNotes = JSON.parse(localStorage.getItem('loveNotes')) || []; // Učitaj postojeće poruke ili praznu listu
    savedNotes.push(noteText); // Dodaj novu poruku
    localStorage.setItem('loveNotes', JSON.stringify(savedNotes)); // Spremi ažuriranu listu u localStorage
}

// Kada korisnik klikne na gumb za slanje poruke
document.getElementById('submitNote').addEventListener('click', function () {
    const noteInput = document.getElementById('noteInput');
    const noteText = noteInput.value.trim();

    if (noteText) {
        // Dodaj poruku na stranicu
        const notesContainer = document.getElementById('notes');
        const newNote = document.createElement('div');
        newNote.classList.add('note');
        newNote.textContent = noteText;
        notesContainer.appendChild(newNote);

        // Spremi poruku u localStorage
        saveNoteToLocalStorage(noteText);

        // Očisti input polje
        noteInput.value = '';
        noteInput.focus();
    }
});

// Učitaj sve poruke prilikom učitavanja stranice
window.onload = function () {
    loadNotes();
};
