// const firebaseConfig = {
//     apiKey: "<El vostre apiKey>",
//     authDomain: "pizzeria-????.firebaseapp.com",
//     projectId: "pizzeria-????",
//     storageBucket: "pizzeria-????.appspot.com",
//     messagingSenderId: "????????????",
//     appId: "1:????????????:web:26bebfd8cd07c42ca59e7f"
// };


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

let idAModificar = "";
let titolAModificar = "";
let dataAModificar = "";
let autorAModificar = "";

let modeAfegir = true;
const formAfegir = document.getElementById("formAfegir");
const formModificar = document.getElementById("formModificar");

const txtModifica = document.getElementById("txtModifica");
const llista = document.getElementById('llista');
// const llista = document.querySelector('ul');

formAfegir.style.visibility = 'visible';
formModificar.style.visibility = 'hidden';

const afegirElementALlista = (recipe, id) => {
    llista.innerHTML += tornaElementLlista(recipe, id);
};

db.collection('recipes').onSnapshot(snapshot => {
    // console.log(snapshot.docChanges());
    debugger;
    snapshot.docChanges().forEach(change => {
        // console.log(change);
        const doc = change.doc;
        console.log("change.type = " + change.type);
        if (change.type === 'added') {
            afegirElementALlista(doc.data(), doc.id);
        } else if (change.type === 'removed') {
            esborraElementLlista(doc.id);
        } else if (change.type === 'modified') {
            actualitzaElementALlista(doc.data(), doc.id);
        }
    });
});

// Per afegir documents
formAfegir.addEventListener('submit', e => {
    e.preventDefault();
    let now = new Date();
    const recipe = {
        title: formAfegir.recipe.value,
        created_at: firebase.firestore.Timestamp.fromDate(now),
        author: "Joan"
    };
    db.collection('recipes')
        .add(recipe)
        .then(() => console.log('Recepta afegida correctament!'))
        .catch(err => console.log(err))
    e.target[0].value = "";
});

// Per modificar documents
formModificar.addEventListener('submit', e => {
    e.preventDefault();
    const recipeEditada = {
        title: formModificar.txtModifica.value,
    };
    debugger;
    db.collection('recipes')
        .doc(idAModificar)
        .set(recipeEditada, { merge: true })
        .then(() => console.log('Recepta modificada correctament!'))
        .catch(err => console.log(err))
    e.target[0].value = ""; 
});


// Esborrar documents
llista.addEventListener('click', e => {
    const id = e.target.parentElement.getAttribute('data-id');
    console.log(e.target.tagName);
    if (e.target.tagName === 'BUTTON' && e.target.id === 'esborrar') {
        // Delete recipe
        console.log("esborra id = " + id);
        db.collection('recipes').doc(id).delete()
        .then(() => console.log('Recepta esborrada correctament!'))
        .catch((err) => console.log(err));
    }
});


llista.addEventListener('click', e => {
    const id = e.target.parentElement.getAttribute('data-id');
    alert("modificar = " + modificar);
    if (e.target.tagName === 'BUTTON' && e.target.id === 'modificar') {
        const recipeEditada = {
            title: titolAModificar
        };
        db.collection('recipes').doc(id).set(recipeEditada)
            .then(function (doc) {
                console.log("doc.data().title = " + doc.data().title);
                document.getElementById("txtModifica").value = doc.data().title;
                titolAModificar = doc.data().title;
                dataAModificar = doc.data().created_at;
                autorAModificar = doc.data().author;
                console.log("titolAModificar " + titolAModificar);
                console.log("dataAModificar  " + dataAModificar);
                console.log("autorAModificar " + autorAModificar);
            })
            .catch((err) => console.log(err));
    }
});

const esborraElementLlista = id => {
    debugger;
    const recipes = document.querySelectorAll('li');
    recipes.forEach(recipe => {
        if (recipe.getAttribute('data-id') === id) {
            recipe.remove();
        }
    });
};

const actualitzaElementALlista = (recipe, id) => {
    debugger;
    let elementDeLaLlista = document.getElementById(id);
    let elementAmbNovesDades = document.createElement('li');
    document.getElementById("txtModifica").value = recipe.title;
    for (let i = 0; i < llista.childElementCount; i++) {
        if (llista.children[i].getAttribute('data-id') == id) {
            elementDeLaLlista = llista.children[i];
            break;
        }
    }

    let dataCreacio = new Date(docBaseDades.created_at.toDate());
    let dia = dataCreacio.getDate();
    let mes = dataCreacio.getMonth();
    let any = dataCreacio.getFullYear();

    // (condicio)?cert:fals
    dia = (dia < 10) ? "0" + dia : dia;
    mes = (mes < 10) ? "0" + mes : mes;
    
    var newEl = document.createElement('li');
    newEl.setAttribute("data-id",id)
    newEl.innerHTML = `
    
    <div><strong>${recipe.title}</strong></div>
    <div>${dia + "/" + mes + "/" + any}</div>
    <button class="btn btn-danger btn-sm my-2" id="esborrar">Esborrar</button>
    <button class="btn btn-success btn-sm my-2" id="modificar">Modificar</button>
    
        `;
        
	
    llista.replaceChild(newEl,elementDeLaLlista);


    // elementAmbNovesDades.innerHTML = tornaElementLlista(recipe, id);

    canviaVisible();
    document.getElementById("txtModifica").value = "";
};

function canviaVisible() {
    if (modeAfegir) {
        formAfegir.style.visibility = 'hidden';
        formModificar.style.visibility = 'visible';
        modeAfegir = false;
    } else {
        formAfegir.style.visibility = 'visible';
        formModificar.style.visibility = 'hidden';
        modeAfegir = true;
    }
}


function tornaElementLlista(docBaseDades, identificador) {
    let dataCreacio = new Date(docBaseDades.created_at.toDate());
    let dia = dataCreacio.getDate();
    let mes = dataCreacio.getMonth();
    let any = dataCreacio.getFullYear();

    // (condicio)?cert:fals
    dia = (dia < 10) ? "0" + dia : dia;
    mes = (mes < 10) ? "0" + mes : mes;

    return `<li data-id="${identificador}">
    <div><strong>${docBaseDades.title}</strong></div>
    <div>${dia + "/" + mes + "/" + any}</div>
    <button class="btn btn-danger btn-sm my-2" id="esborrar">Esborrar</button>
    <button class="btn btn-success btn-sm my-2" id="modificar">Modificar</button>
    </li>
    `;
}