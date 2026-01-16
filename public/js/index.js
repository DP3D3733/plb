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

//livros abreviados
const livrosBiblia = new Map([
    // Antigo Testamento
    ["Gênesis", "gn"],
    ["Êxodo", "ex"],
    ["Levítico", "lv"],
    ["Números", "nm"],
    ["Deuteronômio", "dt"],
    ["Josué", "js"],
    ["Juízes", "jz"],
    ["Rute", "rt"],
    ["1 Samuel", "1sm"],
    ["2 Samuel", "2sm"],
    ["1 Reis", "1rs"],
    ["2 Reis", "2rs"],
    ["1 Crônicas", "1cr"],
    ["2 Crônicas", "2cr"],
    ["Esdras", "ed"],
    ["Neemias", "ne"],
    ["Ester", "et"],
    ["Jó", "jó"],
    ["Salmos", "sl"],
    ["Provérbios", "pv"],
    ["Eclesiastes", "ec"],
    ["Cânticos", "ct"],
    ["Isaías", "is"],
    ["Jeremias", "jr"],
    ["Lamentações", "lm"],
    ["Ezequiel", "ez"],
    ["Daniel", "dn"],
    ["Oséias", "os"],
    ["Joel", "jl"],
    ["Amós", "am"],
    ["Obadias", "ob"],
    ["Jonas", "jn"],
    ["Miquéias", "mq"],
    ["Naum", "na"],
    ["Habacuque", "hc"],
    ["Sofonias", "sf"],
    ["Ageu", "ag"],
    ["Zacarias", "zc"],
    ["Malaquias", "ml"],

    // Novo Testamento
    ["Mateus", "mt"],
    ["Marcos", "mc"],
    ["Lucas", "lc"],
    ["João", "jo"],
    ["Atos", "at"],
    ["Romanos", "rm"],
    ["1 Coríntios", "1co"],
    ["2 Coríntios", "2co"],
    ["Gálatas", "gl"],
    ["Efésios", "ef"],
    ["Filipenses", "fp"],
    ["Colossenses", "cl"],
    ["1 Tessalonicenses", "1ts"],
    ["2 Tessalonicenses", "2ts"],
    ["1 Timóteo", "1tm"],
    ["2 Timóteo", "2tm"],
    ["Tito", "tt"],
    ["Filemom", "fm"],
    ["Hebreus", "hb"],
    ["Tiago", "tg"],
    ["1 Pedro", "1pe"],
    ["2 Pedro", "2pe"],
    ["1 João", "1jo"],
    ["2 João", "2jo"],
    ["3 João", "3jo"],
    ["Judas", "jd"],
    ["Apocalipse", "ap"]
]);


function getLogin() {
    return localStorage.getItem('login');
}

// Barra de progresso
function setProgress(valor) {
    document.querySelector('.progress-bar').style.width = valor + '%';
}

// Verifica login
async function verificarLogin() {


    let usuarioLogado = JSON.parse(getLogin());

    if (!usuarioLogado) {
        window.location.replace('login.html');
    } else {
        const user = await getUser(usuarioLogado.nome.toLowerCase());
        delete user['senha'];
        localStorage.setItem('login', JSON.stringify(user));
        usuarioLogado = JSON.parse(getLogin());
        atualizaQtdPerm(usuarioLogado);
        document.querySelector('#saudacaoLbl').innerText = `Olá, ${usuarioLogado.nome}!`; //nome user

        let ordem;

        // baixa os dados se não houver
        if (!sessionStorage.getItem('ordem')) {
            ordem = await baixarDados("ordem-das-tabelas");

            sessionStorage.setItem('ordem', JSON.stringify(ordem));

        } else {
            ordem = JSON.parse(sessionStorage.getItem('ordem'));
        }

        //insere os lidos na lista detalhada
        if (ordem) {
            const dados = calculaMeta(parseInt(usuarioLogado.qtd_lidos || 0));
            let ul = '';
            dados.lidos.forEach((capitulo) => {
                let capituloNome = '';
                let capituloNumero = '';
                if (capitulo.split('-++-')[0].split(' ').length > 2) {
                    capituloNome = livrosBiblia.get(capitulo.split('-++-')[0].split(' ').slice(0, 2).join(' '));
                    capituloNumero = capitulo.split('-++-')[0].split(' ')[2];
                } else {
                    capituloNome = livrosBiblia.get(capitulo.split('-++-')[0].split(' ')[0]);
                    capituloNumero = capitulo.split('-++-')[0].split(' ')[1];
                }
                ul += `<li qtdVersiculos=${capitulo.split('-++-')[1]}><span class=spanCapitulo onclick="baixarCapitulo('${capituloNome}','${capituloNumero}')">${capitulo.split('-++-')[0]}</span><span class="lidoSinal">✔</span></li>`;
            });
            document.querySelector('#lidosLista').innerHTML = ul;

            ul = '';
            dados.meta.forEach((capitulo) => {
                let capituloNome = '';
                let capituloNumero = '';
                if (capitulo.split('-++-')[0].split(' ').length > 2) {
                    capituloNome = livrosBiblia.get(capitulo.split('-++-')[0].split(' ').slice(0, 2).join(' '));
                    capituloNumero = capitulo.split('-++-')[0].split(' ')[2];
                } else {
                    capituloNome = livrosBiblia.get(capitulo.split('-++-')[0].split(' ')[0]);
                    capituloNumero = capitulo.split('-++-')[0].split(' ')[1];
                }
                if (usuarioLogado.lidos_hoje) {
                    const marcado = usuarioLogado.lidos_hoje[usuarioLogado.lidos_hoje.length - 1]?.includes(capitulo.split('-++-')[0]) ? '<button onclick="marcarLido(this)" class="marcarLidoButton desmarcar">↺</button>' : '';
                    ul += `<li qtdVersiculos=${capitulo.split('-++-')[1]}><span class=spanCapitulo onclick="baixarCapitulo('${capituloNome}','${capituloNumero}')">${capitulo.split('-++-')[0]}</span><span class="lidoSinal">✔</span> ${marcado}</li>`;
                } else {
                    ul += `<li qtdVersiculos=${capitulo.split('-++-')[1]}><span class=spanCapitulo onclick="baixarCapitulo('${capituloNome}','${capituloNumero}')">${capitulo.split('-++-')[0]}</span><span class="lidoSinal">✔</span></li>`;
                }

            });
            document.querySelector('#metaLista ul').innerHTML = ul;

            ul = '';
            dados.nLidos.forEach((capitulo) => {
                let capituloNome = '';
                let capituloNumero = '';
                if (capitulo.split('-++-')[0].split(' ').length > 2) {
                    capituloNome = livrosBiblia.get(capitulo.split('-++-')[0].split(' ').slice(0, 2).join(' '));
                    capituloNumero = capitulo.split('-++-')[0].split(' ')[2];
                } else {
                    capituloNome = livrosBiblia.get(capitulo.split('-++-')[0].split(' ')[0]);
                    capituloNumero = capitulo.split('-++-')[0].split(' ')[1];
                }
                if (usuarioLogado.lidos_hoje) {
                    const marcado = usuarioLogado.lidos_hoje[usuarioLogado.lidos_hoje.length - 1]?.includes(capitulo.split('-++-')[0]) ? '<button onclick="marcarLido(this)" class="marcarLidoButton desmarcar">↺</button>' : '';
                    ul += `<li qtdVersiculos=${capitulo.split('-++-')[1]}><span class=spanCapitulo onclick="baixarCapitulo('${capituloNome}','${capituloNumero}')">${capitulo.split('-++-')[0]}</span><span class="lidoSinal">✔</span> ${marcado}</li>`;
                } else {
                    ul += `<li qtdVersiculos=${capitulo.split('-++-')[1]}><span class=spanCapitulo onclick="baixarCapitulo('${capituloNome}','${capituloNumero}')">${capitulo.split('-++-')[0]}</span><span class="lidoSinal">✔</span></li>`;
                }
            });
            document.querySelector('#aLerLista').innerHTML = ul;
            if (usuarioLogado.lidos_hoje) {
                usuarioLogado.lidos_hoje.forEach((capitulo) => {
                    Array.from(document.querySelectorAll(`#metaLista li, #aLerLista li`)).find((li) => li.innerHTML.includes(capitulo))?.classList.add('lido');
                });
            }
            if (document.querySelector('#metaLista li')) {
                if (!document.querySelector('#metaLista li:has(button.desmarcar)') && !document.querySelector('#aLerLista li:has(button.desmarcar)')) {
                    document.querySelector('#metaLista li').innerHTML += '<button onclick="marcarLido(this)" class="marcarLidoButton">✔</button>';
                } else if (document.querySelector('#metaLista li:has(button.desmarcar)') && document.querySelector('#metaLista li:has(button.desmarcar)').nextElementSibling) {
                    document.querySelector('#metaLista li:has(button.desmarcar)').nextElementSibling.innerHTML += '<button onclick="marcarLido(this)" class="marcarLidoButton">✔</button>';
                } else if (!document.querySelector('#aLerLista li:has(button.desmarcar)')) {
                    document.querySelector('#aLerLista li').innerHTML += '<button onclick="marcarLido(this)" class="marcarLidoButton">✔</button>';
                } else {
                    document.querySelector('#aLerLista li:has(button.desmarcar)').nextElementSibling.innerHTML += '<button onclick="marcarLido(this)" class="marcarLidoButton">✔</button>';
                }
            }



            if (usuarioLogado.historico_lidos) {
                atualizaHist(usuarioLogado.historico_lidos);
            }
            atualizaPaineis(dados);
        }
    }
}

//atualiza os quantitativos baseado na qtd capítulos lidos do user
function atualizaPaineis(dados) {

    const usuarioLogado = JSON.parse(getLogin());
    const lidos_hoje = usuarioLogado.lidos_hoje ? usuarioLogado.lidos_hoje.length : 0;
    document.querySelector('#qtdProgresso span').innerText = `${dados.lidos.length + lidos_hoje} de 1189 capítulos lidos`;
    const percentual = ((dados.lidos.length + lidos_hoje) / 1189 * 100).toFixed(2).replace('.', ',');
    document.querySelector('#percentProgresso').innerText = `${percentual}%`;
    document.querySelector('div.progress-bar').setAttribute('style', `width:${percentual.replace(',', '.')}%`);
    document.querySelector('#totalProgresso h2').innerText = dados.lidos.length + lidos_hoje;
    document.querySelector('#hojeProgresso h2').innerText = lidos_hoje;
    document.querySelector('#restantesProgresso h2').innerText = 1189 - dados.lidos.length - lidos_hoje;
}

//atualiza o quantitativo permanente
function atualizaQtdPerm(usuarioLogado) {
    if (!usuarioLogado.atualizadoEm || usuarioLogado.atualizadoEm == '-') return;

    const atualizadoEm = new Date(usuarioLogado.atualizadoEm)
        .toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo" });

    const hoje = new Date()
        .toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo" });
    if (atualizadoEm != hoje) {
        const historicoLidos = usuarioLogado.historico_lidos || [];
        historicoLidos.push({
            data: usuarioLogado.atualizadoEm,
            capitulos: usuarioLogado.lidos_hoje || []
        });
        usuarioLogado.historico_lidos = historicoLidos;
        usuarioLogado.qtd_lidos = (usuarioLogado.qtd_lidos || 0) + (usuarioLogado.qtdLidosHoje || 0);
        usuarioLogado.qtdLidosHoje = 0;
        usuarioLogado.lidos_hoje = [];
        usuarioLogado.atualizadoEm = '-';
        localStorage.setItem('login', JSON.stringify(usuarioLogado));
    }
    enviarLidos();
}



//retorna os capítulos lidos e a meta de hoje
function calculaMeta(lidos) {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const dataFinal = new Date(2027, 0, 1);
    dataFinal.setHours(0, 0, 0, 0);

    const difDias = Math.ceil( //retorna quantos dias faltam pra acabar o ano
        (dataFinal - hoje) / (1000 * 60 * 60 * 24)
    );

    let qtdVersiculosMeta = (31102 - lidos) / difDias; //razão entre a qtd de versículos faltantes pela quantidade de dias faltantes
    const capitulos = JSON.parse(sessionStorage.getItem('ordem')).ordem;

    let a = lidos;

    const capitulosLidos = [];
    const metaCap = [];
    const capNLidos = [];

    for (const id of Object.keys(capitulos)) {
        const partes = capitulos[id].split('-++-');
        const qtdVersiculosCap = parseInt(partes[1], 10); //

        if (a >= qtdVersiculosCap) {
            a -= qtdVersiculosCap;
            capitulosLidos.push(capitulos[id]); //separa os capítulos lidos
        } else if (qtdVersiculosMeta > 0) {

            if (qtdVersiculosMeta > (qtdVersiculosCap / 2)) {

                metaCap.push(capitulos[id]); //separa os capítulos da meta
            } else {
                capNLidos.push(capitulos[id]);
            }
            qtdVersiculosMeta -= qtdVersiculosCap;
        } else {
            capNLidos.push(capitulos[id]);
        }
    }
    return {
        lidos: capitulosLidos,
        meta: metaCap,
        nLidos: capNLidos
    }




}

// Logout
function logout() {
    localStorage.removeItem('login');
    verificarLogin();
}

async function baixarDados(colecao) {
    const snapshot = await db
        .collection(colecao)
        .get();

    const dados = {};

    snapshot.forEach(doc => {
        dados[doc.id] = doc.data();
    });

    return dados;
}

async function enviarDados(ordem) {
    const ref = db
        .collection('ordem-das-tabelas')
        .doc('ordem');

    await ref.set(ordem, { merge: true });
}


async function baixarLivroComCapitulos() {
    const snapshot = await db.collection('livros').get();
    const dados = {};

    for (const doc of snapshot.docs) {
        const livro = doc.data();

        const capitulosSnap = await db
            .collection('livros')
            .doc(doc.id)
            .collection('capitulos')
            .get();

        const capitulos = {};

        capitulosSnap.forEach(cap => {
            capitulos[cap.id] = cap.data();
        });

        dados[doc.id] = {
            ...livro,
            capitulos
        };
    }

    return dados;
}

function normalizarTexto(texto) {
    return texto
        .normalize("NFD")                 // separa acentos
        .replace(/[\u0300-\u036f]/g, "")  // remove acentos
        .replace(/\s+/g, "_")             // espaços → _
        .toLowerCase();                   // opcional
}

function separarLivroCapitulo(texto) {
    const match = texto.match(/^(.*?)(?:\s+)(\d+)$/);

    if (!match) return null;

    return {
        livro: match[1],
        capitulo: Number(match[2])
    };
}

//insere no sistema os capítulos lidos
function marcarLido(button) {
    const lido = button.innerText == '✔' ? true : false; //se false é pra Desmarcar
    const qtd = parseInt(button.parentNode.getAttribute('qtdversiculos'));
    const capitulo = button.parentNode.querySelector('span.spanCapitulo').innerText.trim();
    const usuarioLogado = JSON.parse(getLogin());
    const lidos_hoje = usuarioLogado.lidos_hoje || [];
    let qtdLidosHoje = usuarioLogado.qtdLidosHoje || 0;
    if (lido) {
        qtdLidosHoje += parseInt(button.parentNode.getAttribute('qtdversiculos'));
        lidos_hoje.push(capitulo);
        if (document.querySelector('button.desmarcar')) {
            document.querySelector('button.desmarcar').remove();
        }
        button.innerText = '↺';
        button.classList.add('desmarcar');
        if (button.closest('div.subBloco').id == 'metaLista') {
            if (button.parentNode.nextElementSibling) {
                button.parentNode.nextElementSibling.innerHTML += '<button onclick="marcarLido(this)" class="marcarLidoButton">✔</button>';
            } else {
                document.querySelector('#aLerLista li').innerHTML += '<button onclick="marcarLido(this)" class="marcarLidoButton">✔</button>';
            }
        } else if (button.parentNode.nextElementSibling) {
            button.parentNode.nextElementSibling.innerHTML += '<button onclick="marcarLido(this)" class="marcarLidoButton">✔</button>';
        }
    } else {
        qtdLidosHoje -= parseInt(button.parentNode.getAttribute('qtdversiculos'));
        button.innerText = '✔';
        button.classList.remove('desmarcar');
        lidos_hoje.splice(lidos_hoje.indexOf(capitulo), 1);
        if (button.closest('div.subBloco').id == 'metaLista') {
            if (button.parentNode.nextElementSibling) {
                button.parentNode.nextElementSibling.querySelector('button').remove();
            } else {
                document.querySelector('#aLerLista li button').remove();
            }
            if (button.parentNode.previousElementSibling) {
                button.parentNode.previousElementSibling.innerHTML += '<button onclick="marcarLido(this)" class="marcarLidoButton desmarcar">↺</button>';
            }
        } else {
            if (button.parentNode.nextElementSibling) {
                button.parentNode.nextElementSibling.querySelector('button').remove();
            }
            if (button.parentNode.previousElementSibling) {
                button.parentNode.previousElementSibling.innerHTML += '<button onclick="marcarLido(this)" class="marcarLidoButton desmarcar">↺</button>';
            } else {
                document.querySelector('#metaLista li:last-of-type').innerHTML += '<button onclick="marcarLido(this)" class="marcarLidoButton desmarcar">↺</button>';
            }
        }
    }
    usuarioLogado.qtdLidosHoje = qtdLidosHoje;
    usuarioLogado.lidos_hoje = lidos_hoje;
    usuarioLogado.atualizadoEm = new Date();
    localStorage.setItem('login', JSON.stringify(usuarioLogado));
    enviarLidos();
    verificarLogin();
}

async function enviarLidos() {
    const usuarioLogado = JSON.parse(getLogin());

    const ref = db
        .collection('usuarios')
        .doc(usuarioLogado.nome.toLowerCase());

    await ref.set(usuarioLogado, { merge: true });
}

//atualiza o histórico de lidos
function atualizaHist(historico_lidos) {
    if (!historico_lidos) return;

    const datas = [];

    //insere a data de leitura de cada capítulo lido
    const capLidos = document.querySelectorAll('#lidosLista li');

    capLidos.forEach((li) => {
        const capitulo = li.querySelector('span.spanCapitulo').innerHTML;
        for (const registro of historico_lidos) {
            if (registro.capitulos.includes(capitulo)) {
                const dateStr = new Date(registro.data).toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo" }).split('/').map(d => parseInt(d));
                const data = new Date(dateStr[2], dateStr[1] - 1, dateStr[0]);
                if (!datas.some(d => d.getTime() === data.getTime())) {
                    datas.push(data);
                }
                li.innerHTML += `<span class="data-lido">${dateStr.join('/')}</span>`;
                break;
            }
        }
    });

    //atualiza o recorde de constância
    datas.sort((a, b) => b - a); //ordena as datas

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const ontem = new Date(hoje);
    ontem.setDate(hoje.getDate() - 1);

    let constanciaAtual = 0;

    if (datas[0].getTime() == ontem.getTime()) {
        for (let i = 0; i < datas.length; i++) {
            if (i === 0) {
                constanciaAtual = 1;
            } else {

                const diffTime = Math.abs(datas[i] - datas[i - 1]);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                if (diffDays === 1) {
                    constanciaAtual++;
                } else {
                    i = datas.length;
                }
            }
        }
    }
    if (document.querySelector('#metaLista li.lido')) {
        constanciaAtual++;
    }


    const badges = ['⚪', '🔥', '🌿', '🛡️', '⚒️', '🏗️', '📜', '🏅', '👑', '🏛️'];
    const titulosMasc = ['Não Iniciado', 'Chamado - Mt 22:14', 'Discípulo - Lc 9:23', 'Servo Fiel - Mt 25:21', 'Obreiro - 2 Tm 2:15', 'Cooperador - 1 Co 3:9', 'Aprovado - Rm 16:10', 'Homem de Fé - Hq 2:4', 'Mordomo Fiel - 1 Co 4:2', 'Coluna da Obra - Gl 2:9'];
    const titulosFem = ['Não Iniciada', 'Chamada - Mt 22:14', 'Discípula - Lc 9:23', 'Serva Fiel - Mt 25:21', 'Obreira - 2 Tm 2:15', 'Cooperadora - 1 Co 3:9', 'Aprovada - Rm 16:10', 'Mulher de Fé - Hq 2:4', 'Mordoma Fiel - 1 Co 4:2', 'Coluna da Obra - Gl 2:9'];

    const usuarioLogado = JSON.parse(getLogin());
    const sexo = usuarioLogado.sexo || 'Masculino';
    if (1 <= constanciaAtual && constanciaAtual <= 6) {
        document.querySelector('#recordeConstancia span').innerText = `${badges[1]} Constância`;
        document.querySelector('#recordeConstancia h3').innerText = `${sexo === 'Feminino' ? titulosFem[1] : titulosMasc[1]}`;
    } else if (7 <= constanciaAtual && constanciaAtual <= 20) {
        document.querySelector('#recordeConstancia span').innerText = `${badges[2]} Constância`;
        document.querySelector('#recordeConstancia h3').innerText = `${sexo === 'Feminino' ? titulosFem[2] : titulosMasc[2]}`;
    } else if (21 <= constanciaAtual && constanciaAtual <= 49) {
        document.querySelector('#recordeConstancia span').innerText = `${badges[3]} Constância`;
        document.querySelector('#recordeConstancia h3').innerText = `${sexo === 'Feminino' ? titulosFem[3] : titulosMasc[3]}`;
    } else if (50 <= constanciaAtual && constanciaAtual <= 89) {
        document.querySelector('#recordeConstancia span').innerText = `${badges[4]} Constância`;
        document.querySelector('#recordeConstancia h3').innerText = `${sexo === 'Feminino' ? titulosFem[4] : titulosMasc[4]}`;
    } else if (90 <= constanciaAtual && constanciaAtual <= 119) {
        document.querySelector('#recordeConstancia span').innerText = `${badges[5]} Constância`;
        document.querySelector('#recordeConstancia h3').innerText = `${sexo === 'Feminino' ? titulosFem[5] : titulosMasc[5]}`;
    } else if (120 <= constanciaAtual && constanciaAtual <= 149) {
        document.querySelector('#recordeConstancia span').innerText = `${badges[6]} Constância`;
        document.querySelector('#recordeConstancia h3').innerText = `${sexo === 'Feminino' ? titulosFem[6] : titulosMasc[6]}`;
    } else if (150 <= constanciaAtual && constanciaAtual <= 179) {
        document.querySelector('#recordeConstancia span').innerText = `${badges[7]} Constância`;
        document.querySelector('#recordeConstancia h3').innerText = `${sexo === 'Feminino' ? titulosFem[7] : titulosMasc[7]}`;
    } else if (180 <= constanciaAtual && constanciaAtual <= 200) {
        document.querySelector('#recordeConstancia span').innerText = `${badges[8]} Constância`;
        document.querySelector('#recordeConstancia h3').innerText = `${sexo === 'Feminino' ? titulosFem[8] : titulosMasc[8]}`;
    } else if (constanciaAtual > 200) {
        document.querySelector('#recordeConstancia span').innerText = `${badges[9]} Constância`;
        document.querySelector('#recordeConstancia h3').innerText = `${sexo === 'Feminino' ? titulosFem[9] : titulosMasc[9]}`;
    }
    console.log()
    document.querySelector('#recordeConstancia h2').innerText = constanciaAtual;
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

async function baixarCapitulo(livro, capitulo) {
    // doc do livro
    const livroRef = db
        .collection("biblia")
        .doc("nvi")
        .collection("livros")
        .doc(livro);

    // doc do capítulo
    const capituloRef = livroRef
        .collection("capitulos")
        .doc(capitulo);

    // busca em paralelo 🚀
    const [livroSnap, capituloSnap] = await Promise.all([
        livroRef.get(),
        capituloRef.get()
    ]);
    if (livroSnap.exists) {
        const livroNome = livroSnap.data().name;
        const versos = capituloSnap.data().versos;
        document.getElementById('tituloCapitulo').innerText = `${livroNome} ${capitulo}`;
        versos.forEach((verso, index) => {
            const elemento = document.createElement('div');
            elemento.setAttribute('class', 'verso');
            elemento.innerHTML = `<span class=nrVerso>${index + 1}</span><span class=versiculo>${verso}</span>`;
            document.querySelector('#versos').appendChild(elemento);
            let cancelarClick = false;

            onLongPress(elemento, () => {
                cancelarClick = true;
                elemento.classList.toggle('selecionado');
                navigator.vibrate?.(30);
                if (document.querySelector('#versos div.selecionado')) {
                    document.querySelector('#buttonCopiar').style.display = 'inline-flex';
                } else {
                    document.querySelector('#buttonCopiar').style.display = 'none';
                }
                atualizarReferencia();
            }, 500);

            elemento.addEventListener('click', (e) => {
                if (cancelarClick) {
                    e.preventDefault();
                    e.stopPropagation();
                    cancelarClick = false; // limpa aqui, NÃO por timeout
                    return;
                }

                const existeSelecionado = document.querySelector('#versos div.selecionado');

                // clicou em algo já selecionado → desmarca
                if (elemento.classList.contains('selecionado')) {
                    elemento.classList.remove('selecionado');
                    if (!document.querySelector('#versos div.selecionado')) {
                        document.querySelector('#buttonCopiar').style.display = 'none';
                    }
                    atualizarReferencia();
                    return;
                }

                // já existe algum selecionado → seleciona este também
                if (existeSelecionado) {
                    elemento.classList.add('selecionado');
                    document.querySelector('#buttonCopiar').style.display = 'inline-flex';
                } else {
                    document.querySelector('#buttonCopiar').style.display = 'none';
                }
                atualizarReferencia();
            });

        })
        document.getElementById('modalLeituraFundo').style.display = 'flex';
        document.body.classList.add('modal-open');
    } else {
        return null; // usuário não existe
    }
}

function fecharModal() {
    document.getElementById('modalLeituraFundo').style.display = 'none';
    document.body.classList.remove('modal-open');
}

function onLongPress(element, callback, delay = 600, moveTolerance = 10) {
    let timer = null;
    let startX = 0;
    let startY = 0;
    let moved = false;

    const start = (e) => {
        moved = false;

        if (e.touches) {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        } else {
            startX = e.clientX;
            startY = e.clientY;
        }

        timer = setTimeout(() => {
            if (!moved) {
                callback(e);
            }
        }, delay);
    };

    const move = (e) => {
        if (!timer) return;

        let x, y;
        if (e.touches) {
            x = e.touches[0].clientX;
            y = e.touches[0].clientY;
        } else {
            x = e.clientX;
            y = e.clientY;
        }

        if (Math.abs(x - startX) > moveTolerance || Math.abs(y - startY) > moveTolerance) {
            moved = true;
            clearTimeout(timer);
            timer = null;
        }
    };

    const cancel = () => {
        if (timer) {
            clearTimeout(timer);
            timer = null;
        }
    };

    element.addEventListener("mousedown", start);
    element.addEventListener("touchstart", start, { passive: true });

    element.addEventListener("mousemove", move);
    element.addEventListener("touchmove", move, { passive: true });

    element.addEventListener("mouseup", cancel);
    element.addEventListener("mouseleave", cancel);
    element.addEventListener("touchend", cancel);
    element.addEventListener("touchcancel", cancel);
}

function copiarPassagem() {
    const versiculos = Array.from(document.querySelectorAll('div.selecionado')).map(versiculo => `${toSuperscript(versiculo.querySelector('span.nrVerso').innerText)} ${versiculo.querySelector('span.versiculo').innerText}`).join('\n');
    const referencia = document.querySelector('#buttonCopiar').innerText.split('(')[1].split(')')[0];

    navigator.clipboard.writeText(referencia+'\n'+versiculos);
}

const superscripts = {
    '0': '⁰',
    '1': '¹',
    '2': '²',
    '3': '³',
    '4': '⁴',
    '5': '⁵',
    '6': '⁶',
    '7': '⁷',
    '8': '⁸',
    '9': '⁹'
};

function toSuperscript(num) {
    return String(num)
        .split('')
        .map(n => superscripts[n] ?? n)
        .join('');
}

function atualizarReferencia() {
    const button = document.getElementById('buttonCopiar');
    const capitulo = document.getElementById('tituloCapitulo').innerText;
    const versiculos = Array.from(document.querySelectorAll('div.selecionado span.nrVerso')).map(versiculo => parseInt(versiculo.innerText));
    // garante números únicos e ordenados
    const versos = [...new Set(versiculos)]
        .map(Number)
        .sort((a, b) => a - b);

    let partes = [];
    let inicio = versos[0];
    let anterior = versos[0];

    for (let i = 1; i <= versos.length; i++) {
        const atual = versos[i];

        // quebra a sequência
        if (atual !== anterior + 1) {
            if (inicio === anterior) {
                partes.push(`${inicio}`);
            } else {
                partes.push(`${inicio}-${anterior}`);
            }
            inicio = atual;
        }
        anterior = atual;
    }

    button.innerText = `📋 Copiar (${capitulo}:${partes.join(',')})`;
}


// Executa após carregar o DOM
document.addEventListener('DOMContentLoaded', verificarLogin);


