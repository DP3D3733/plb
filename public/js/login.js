// Configuração Firebase
const firebaseConfig = {
    apiKey: "AIzaSyD4LE8K80mboFECAnjD1JLK-ylMb0nvgRs",
    authDomain: "projeto-plb.firebaseapp.com",
    projectId: "projeto-plb",
    storageBucket: "projeto-plb.firebasestorage.app",
    messagingSenderId: "434773401872",
    appId: "1:434773401872:web:38ef41f673e649a1d6c595"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

//login
async function login() {
    const login = document.querySelector('#login').value;
    const senha = document.querySelector('#senha').value;

    //prevalida os campos
    if (login == '' || senha == '') {
        alert('Preencha todos os campos!');
        return;
    }

    const user = await getUser(login);
    if (user == null) {
        alert('Usuário inexistente');
    } else if (user.senha != senha) {
        alert('Senha incorreta');
    } else {
        delete user[senha];
        sessionStorage.setItem('login',JSON.stringify(user));
        window.location.href = 'index.html';
    }
}

//baixa user
async function getUser(login) {
    const snapshot = await db
        .collection("usuarios")
        .doc(login)
        .get();

    if (snapshot.exists) {
        return snapshot.data(); // retorna os dados do usuário
    } else {
        return null; // usuário não existe
    }
}