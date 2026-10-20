# 🏡 FamilyTask - Gestão Familiar & Gamificação

![Firebase](https://img.shields.io/badge/Firebase-ffca28?style=for-the-badge&logo=firebase&logoColor=black)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![PWA](https://img.shields.io/badge/PWA-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white)

O **FamilyTask** é uma aplicação web completa desenvolvida para organizar tarefas, hábitos e a rotina da família de maneira simples e engajadora. Integrantes da família podem acompanhar suas atividades, registrar conclusões e visualizar metas e progresso em um painel interativo. 

O projeto conta com mecanismos de **gamificação**, como pontos, conquistas/insígnias, gestão financeira familiar (carteiras e recompensas) e acompanhamento diário de hábitos (ex: hidratação), além de um fluxo de aprovação de tarefas por responsáveis.

---

## 📌 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades Principais](#-funcionalidades-principais)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Pré-requisitos](#-pré-requisitos)
- [Como Executar o Projeto](#-como-executar-o-projeto)
- [Configuração do Firebase](#-configuração-do-firebase)
- [Executando os Testes](#-executando-os-testes)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Deploy / Implantação](#-deploy--implantação)
- [Autora](#-autora)

---

## 🚀 Funcionalidades Principais

- 📊 **Painel Familiar (Dashboard):** Visão geral do desempenho, indicadores de conclusão de tarefas e registro diário de hidratação.
- 👥 **Gestão de Integrantes:** Cadastro e personalização de perfil dos membros da família.
- 📋 **Gestão de Tarefas:** Criação de atividades recorrentes ou pontuais, definição de categorias, horários, responsáveis e sistema de rodízio.
- ✅ **Fluxo de Aprovação:** Envio de comprovantes de conclusão das tarefas pelos integrantes para validação e revisão dos responsáveis.
- 💰 **Pontuação e Finanças:** Cálculo automático de pontuações mensais, inclusão de bônus e penalidades, conversão em valores e histórico financeiro detalhado.
- 🎁 **Carteira e Recompensas:** Saldo individualizado por integrante e loja para resgate de recompensas configuradas.
- 🏆 **Gamificação:** Sistema de insígnias e conquistas atreladas ao cumprimento de metas e atividades.
- 📱 **Suporte a PWA (Progressive Web App):** Manifesto e Service Worker configurados para permitir a instalação da aplicação no dispositivo e cache offline de recursos.
- ☁️ **Autenticação e Nuvem:** Integração com **Firebase Authentication** e **Realtime Database**, além de suporte a backup local em `localStorage`.

---

## 🛠️ Tecnologias Utilizadas

### **Frontend & Interface**
- **HTML5, CSS3 & JavaScript (ES6+)**
- **[Tailwind CSS](https://tailwindcss.com/):** Estilização ágil e responsiva via CDN.
- **[Font Awesome](https://fontawesome.com/):** Ícones da interface via CDN.
- **[Chart.js](https://www.chartjs.org/):** Visualização de dados e gráficos no dashboard.

### **Backend & Serviços de Nuvem**
- **[Firebase v8 (Web SDK)](https://firebase.google.com/):** 
  - **Authentication:** Gestão de acesso via e-mail e senha.
  - **Realtime Database:** Armazenamento e sincronização de dados em tempo real.

### **Tipagem & Qualidade de Código**
- **TypeScript:** Utilizado na camada do domínio (`src/domain/`) para tipagem estática, definição dos modelos e schemas de validação.
- **Node.js Test Runner (`node:test`):** Execução de suítes de testes unitários e de integração sem dependências externas.

> ℹ️ *Nota: A aplicação é servida como arquivos estáticos (sem necessidade de bundlers ou `package.json` para execução da interface).*

---

## 💻 Pré-requisitos

Para executar o projeto localmente, você precisará de:

- Um navegador moderno com suporte a JavaScript.
- Conexão com a internet (para o carregamento das dependências via CDN e conexão ao Firebase).
- Um servidor HTTP local (como Python `http.server`, extensão *Live Server* do VS Code ou Node `http-server`).
- **Node.js 18+** (apenas caso deseje rodar a suíte de testes automatizados).

---

## 🔧 Como Executar o Projeto

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/LeticiaMS89/family-task.git
   cd family-task
   ```

2. **Inicie um servidor HTTP local:**
   
   - *Utilizando Python 3:*
     ```bash
     python -m http.server 8000
     ```
   - *Utilizando a extensão **Live Server** (VS Code):*
     Clique com o botão direito sobre o arquivo `index.html` e selecione **"Open with Live Server"**.

3. **Acesse no navegador:**
   Abra a URL `http://localhost:8000` (ou a porta indicada pelo seu servidor).

> ⚠️ **Atenção:** Abrir o arquivo `index.html` diretamente pelo protocolo de arquivo local (`file://`) não é recomendado, pois funcionalidades como autenticação Firebase e Service Workers dependem de uma origem HTTP/HTTPS.

---

## 🔥 Configuração do Firebase

A aplicação utiliza o nó `familyTasksApp` no **Firebase Realtime Database**. Para conectar seu próprio projeto Firebase:

1. Acesse o [Console do Firebase](https://console.firebase.google.com/) e crie um novo projeto Web.
2. Ative o módulo **Authentication** habilitando o provedor **E-mail / Senha**.
3. Crie uma instância do **Realtime Database** e ajuste as regras de segurança para os usuários autenticados.
4. Abra o arquivo `index.html` no projeto e substitua as credenciais do objeto `firebaseConfig`:
   ```javascript
   const firebaseConfig = {
     apiKey: "SUA_API_KEY",
     authDomain: "SEU_PROJECT_ID.firebaseapp.com",
     databaseURL: "https://SEU_PROJECT_ID-default-rtdb.firebaseio.com",
     projectId: "SEU_PROJECT_ID",
     storageBucket: "SEU_PROJECT_ID.appspot.com",
     messagingSenderId: "SEU_SENDER_ID",
     appId: "SEU_APP_ID"
   };
   ```
5. Adicione o domínio da sua hospedagem aos domínios autorizados no painel do Firebase Authentication.

---

## 🧪 Executando os Testes

Os testes unitários e de serviços foram escritos utilizando o módulo nativo de testes do Node.js. Para executá-los, rode o comando abaixo na raiz do projeto:

```bash
node --test tests/base-service.test.cjs tests/finance-service.test.cjs tests/task-query-service.test.cjs
```

Os testes cobrem a integridade do histórico financeiro, a lógica de cálculo de valores-base e a filtragem/consulta de ocorrências de tarefas.

---

## 📂 Estrutura do Projeto

```text
family-task/
├── index.html                  # Ponto de entrada HTML e inicialização do Firebase
├── style.css                   # Arquivo de estilos complementares
├── manifest.json               # Configuração da PWA (manifesto da aplicação)
├── sw.js                       # Service Worker para estratégias de cache offline
├── app.js                      # Funções auxiliares independentes da interface
├── img/                        # Imagens, logotipos e acervo de insígnias
├── src/
│   ├── domain/
│   │   ├── models.ts           # Definição das interfaces e tipos de dados
│   │   └── schema.ts           # Esquema de normalização e dados iniciais
│   └── services/               # Módulos de lógica de negócios (tarefas, finanças, carteira)
└── tests/                      # Testes automatizados dos serviços
```

---

## 🌐 Deploy / Implantação

Por se tratar de uma aplicação de arquivos estáticos, o deploy pode ser feito de forma simples em plataformas de hospedagem como:

- **GitHub Pages**
- **Firebase Hosting**
- **Vercel / Netlify**

Apenas certifique-se de realizar o deploy a partir da raiz do repositório para manter a integridade dos caminhos relativos de imagens, scripts e do `sw.js`.

---

## 👩‍💻 Autora

Desenvolvido por **Leticia Moreira Silva**. Entre em contato ou acompanhe meus outros projetos através das redes abaixo:

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/ltc-moreira-silva)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/LeticiaMS89)

---
*Sinta-se à vontade para contribuir com sugestões, reportar problemas ou enviar pull requests!*