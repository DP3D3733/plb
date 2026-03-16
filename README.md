# 📖 Projeto Toda Bíblia (Plano de Leitura Bíblica)

Aplicação web desenvolvida em **JavaScript** para organizar e facilitar a **leitura diária da Bíblia**, exibindo automaticamente as passagens programadas para cada dia.

O projeto foi criado com foco em **prática de desenvolvimento front-end**, manipulação de dados e controle de lógica baseado em datas.

---

## 🎯 Objetivo do Projeto

O objetivo deste sistema é fornecer uma forma simples e prática de **acompanhar um plano de leitura bíblica**, permitindo que o usuário visualize rapidamente as passagens designadas para o dia atual.

Além da utilidade prática, o projeto também serviu como exercício para desenvolver habilidades em:

- Estruturação de projetos JavaScript
- Manipulação do DOM
- Organização de dados em estruturas JavaScript
- Lógica baseada em datas

---

## 🧰 Tecnologias Utilizadas

- **JavaScript (Vanilla JS)**
- **Firebase**
- **HTML5**
- **CSS3**

O projeto foi desenvolvido **sem frameworks**, com o objetivo de reforçar fundamentos do desenvolvimento web.

---

## ⚙️ Funcionalidades

- 📅 Identificação automática da **data atual**
- 📖 Exibição das **leituras bíblicas programadas para o dia**
- 📚 Organização das passagens por **livro e capítulo**
- 🖥 Interface simples e direta para facilitar o acesso às leituras
- 🕰️ Meta de leitura baseada em quantidade de versículos

---

## 🏗 Arquitetura do Projeto

O sistema segue uma estrutura simples separando **interface, lógica e dados**.

```
public/
│── index.html # Estrutura da aplicação
├── login.html # Tela de login
├── style.css # Estilização da interface
├── index.js # Lógica principal da aplicação
└── login.js # Lógica de login
```

### Fluxo de funcionamento

1. O sistema obtém a **data atual** através do JavaScript, bem como quantos dias faltam para acabar o ano.
2. Busca na base de dados quantos capítulos o usuário já leu. 
3. Baseado na quantidade total de versículos que faltam para acabar toda a bíblia, calcula a meta diária.
4. As passagens são renderizadas dinamicamente na interface.

## 👨‍💻 Autor
Desenvolvido por **Calebe Ruivo** como projeto de prática em **JavaScript** e ferramenta auxiliar para leitura bíblica.
