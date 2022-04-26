const firebaseConfig = {
    apiKey: "<El vostre apiKey>",
    authDomain: "pizzeria-????.firebaseapp.com",
    projectId: "pizzeria-????",
    storageBucket: "pizzeria-????.appspot.com",
    messagingSenderId: "????????????",
    appId: "1:????????????:web:26bebfd8cd07c42ca59e7f"
};

// S'inicialitza l'aplicació de Firebase
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

// S'inicialitza Cloud Firestore i s'oté una referència al servei
// db.collection('recipes').get()
//     .then(snapshot => {
//         // console.log(snapshot.docs[0].data());
//         snapshot.forEach(doc => {
//             console.log(doc.data());
//         });
//     })
//     .catch(err => console.log(err));

// db.collection('recipes').get()
// .then(snapshot => {
//     // to do when data is recieved
//     console.log(snapshot);
// })
// .catch(err => console.log(err));


const list = document.querySelector('ul');

const addRecipe = (recipe, id) => {
    let formattedTime = recipe.created_at.toDate();
    let html = `
    <li data-id="${id}">
        <div><strong>${recipe.title}</strong></div>
        <div>${formattedTime}</div>
        <button class="btn btn-danger btn-sm my-2">Esborrar</button>
    </li>
        `;
    list.innerHTML += html;
};

// // Obtenir documents
// db.collection('recipes').get()
//     .then(snapshot => {
//         // console.log(snapshot.docs[0].data());
//         snapshot.forEach(doc => {
//             // console.log(doc.id);
//             addRecipe(doc.data(),doc.id);
//         });
//     })
//     .catch(err => console.log(err));

db.collection('recipes').onSnapshot(snapshot => {
    // console.log(snapshot.docChanges());
    snapshot.docChanges().forEach(change => {
        // console.log(change);
        const doc = change.doc;
        if(change.type === 'added') {
            addRecipe(doc.data(), doc.id);
        } else if (change.type === 'removed') {
            deleteRecipe(doc.id);
        }
    });
});

const form = document.querySelector('form');


// Per afegir documents
form.addEventListener('submit', e => {
    e.preventDefault();
    let now = new Date();
    const recipe = {
        title: form.recipe.value,
        created_at: firebase.firestore.Timestamp.fromDate(now)
    };
    db.collection('recipes').add(recipe)
    .then(() => console.log('Recepta afegida correctament!'))
    .catch(err => console.log(err))
    e.target[0].value = "";
});


// Esborrar documents
list.addEventListener('click', e => {
    // console.log(e.target.tagName);
    if (e.target.tagName === 'BUTTON') {
        // Delete recipe
        const id = e.target.parentElement.getAttribute('data-id');
        console.log(id);
        db.collection('recipes').doc(id).delete()
        .then(() => console.log('Recepta esborrada correctament!'))
        .catch((err) => console.log(err));
    }
});

const deleteRecipe = id => {
    const recipes = document.querySelectorAll('li');
    recipes.forEach(recipe => {
        if(recipe.getAttribute('data-id') === id) {
            recipe.remove();
        }
    });
};
