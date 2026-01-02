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
    const login = document.querySelector('#login').value.toLowerCase();
    const senha = document.querySelector('#senha').value;


    //prevalida os campos
    if (login == '' || senha == '') {
        alert('Preencha todos os campos!');
        return;
    }
    const senhaCriptografada = criptografarSenha(senha);
    const user = await getUser(login);
    if (user == null) {
        alert('Usuário inexistente!');
    } else if (user.senha != senhaCriptografada && user.senha != senha) {
        alert('Senha incorreta!');
    } else if (user.senha == '12345') {
        document.querySelector('#loginDiv').style.display = 'none';
        document.querySelector('#primeiroAcessoDiv').style.display = 'flex';
    } else {
        delete user['senha'];
        localStorage.setItem('login', JSON.stringify(user));
        window.location.href = 'index.html';
    }
}

//atualizar a senha
async function atualizarSenha() {
    const senhaAtualCerta = document.querySelector('#senha').value;
    const senhaAtualDigitada = document.querySelector('#senhaAtual').value;
    const novaSenha = document.querySelector('#novaSenha').value;
    const senhaRepetida = document.querySelector('#repetirNovaSenha').value;
    const login = document.querySelector('#login').value;

    if (Array.from(document.querySelectorAll('#primeiroAcessoDiv input')).find(input => input.value == '')) {
        alert('Preencha todos os campos!');
        return;
    }
    if (senhaAtualCerta != senhaAtualDigitada) {
        alert('Senha atual incorreta!');
        return;
    }
    if (novaSenha != senhaRepetida) {
        alert('Senha novas diferentes!');
        return;
    }

    const senhaCriptografada = criptografarSenha(novaSenha);
    const ref = db
        .collection('usuarios')
        .doc(login);

    try {
        await ref.set(
            { senha: senhaCriptografada },
            { merge: true }
        );

        console.log("Senha registrada com sucesso no Firestore");
        document.querySelector('#loginDiv').style.display = 'flex';
        document.querySelector('#primeiroAcessoDiv').style.display = 'none';
        document.querySelectorAll('input').forEach(input => {
            input.value = '';
        })
    } catch (error) {
        console.error("Erro ao salvar no Firestore:", error);

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

//criptografar senha
function criptografarSenha(senha) {
    const senhaHash = CryptoJS.SHA256(senha).toString();
    return senhaHash;
}



