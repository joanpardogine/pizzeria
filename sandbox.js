const firebaseConfig = {
    apiKey: "AIzaSyCSHOK3w-PLxY0vNrM7ioSztmsca2pGQ2w",
    authDomain: "pizzeria-f0b67.firebaseapp.com",
    projectId: "pizzeria-f0b67",
    storageBucket: "pizzeria-f0b67.appspot.com",
    messagingSenderId: "644402833518",
    appId: "1:644402833518:web:26bebfd8cd07c42ca59e7f"
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
const addRecipe = recipe => {
    let html = `
        <li>
            <div>${recipe.title}</div>
        </li>
    `;
    // console.log(html);
    list.innerHTML += html;
};
db.collection('recipes').get()
    .then(snapshot => {
        // console.log(snapshot.docs[0].data());
        snapshot.forEach(doc => {
            // console.log(doc.data());
            addRecipe(doc.data());
        });
    })
    .catch(err => console.log(err));