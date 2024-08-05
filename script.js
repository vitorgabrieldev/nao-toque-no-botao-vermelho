

let messages = [];
let ranks = [];
let captions = [];

const init = async () => {
    await loadGameData(); // Carrega todos os dados do jogo
    timerBoardAction();
    ClickButtonAction();
    backgroundGuideAction();
};

const loadGameData = async () => {
    try {
        const messagesResponse = await fetch('json/history.json');
        if (!messagesResponse.ok) throw new Error('Erro ao carregar o arquivo de mensagens.');
        messages = await messagesResponse.json();
        
        const ranksResponse = await fetch('json/rankings.json');
        if (!ranksResponse.ok) throw new Error('Erro ao carregar o arquivo de rankings.');
        ranks = await ranksResponse.json();

        const captionsResponse = await fetch('json/captions.json');
        if (!captionsResponse.ok) throw new Error('Erro ao carregar o arquivo de capítulos.');
        captions = await captionsResponse.json();

        // Verifique se messages é um array
        if (Array.isArray(messages.phases)) {
            // Conta a quantidade de missões
            messages.phases.forEach(phase => {
                pendingMissions += phase.texts.length;
            });
        } else {
            console.error('A estrutura de messages não é um array ou está incorreta.');
        }

        updateMissionsAction(); // Atualiza o sistema de missões

    } catch (error) {
        console.error(error);
    }
};
// ------------------ Váriaveis globais ------------------
var currentPhase = 0;
var currentMessageIndex = 0;
let totalPoints = 0;
let completedMissions = 0;
let pendingMissions = 0;

/* -------------------------------------------------------
|
| Sistema de evento de click no botão
|
| -------------------------------------------------------*/

const ClickButtonAction = () => {
    $("#soundClick").click(() => {
        document.getElementById('hoverSound').play();

        // Acessa as mensagens da fase atual
        let currentPhaseMessages = messages.phases[currentPhase].texts;
        let currentPhaseMessagesPoints = messages.phases[currentPhase].points;
        let currentPhaseMessagesCaption = messages.phases[currentPhase].capitulo;
        let currentCaracteres = messages.phases[currentPhase].texts[currentMessageIndex].characterId;

        if ( currentCaracteres ) {

            let pathPerosnagem = getCharacterImageAction(currentCaracteres);

            // Adiciona a mensagem ao container de textos
            document.querySelector(".texts-container").innerHTML += `
                <p class="titulo titulo-persona">
                    <img src="${pathPerosnagem}" alt="Imagem do Personagem">
                    ${currentPhaseMessages[currentMessageIndex].text}
                </p>
            `;
        } else {
            // Adiciona a mensagem ao container de textos
            document.querySelector(".texts-container").innerHTML += `
            <p class="titulo">${currentPhaseMessages[currentMessageIndex].text}</p>`;
        }; 

        let element = document.querySelector(".texts-container");
        element.scrollTop = element.scrollHeight;

        // Incrementa o índice da mensagem
        currentMessageIndex++;

        // Remove uma missão das pendentes
        pendingMissions--;
        // Adiciona uma missão às completas
        completedMissions++;

        chargeBoardAction('level', (currentPhase + 1)); // Sistema de troca de level
        updatePointsAction(currentPhaseMessagesPoints); // Atualiza o sistema de pontos
        updateRankAction(); // Sistema de classificação de ranking
        updateMissionsAction(); // Atualiza o sistema de missões
        updateCaptionAction(currentPhaseMessagesCaption); // Atualiza o sistema de capítulos

        // Verifica se o índice da mensagem excedeu o comprimento da fase
        if (currentMessageIndex >= currentPhaseMessages.length) {
            currentMessageIndex = 0;
            currentPhase++;

            // Se a fase atual exceder o número de fases, reinicie para a primeira fase
            if (currentPhase >= messages.phases.length) {
                currentPhase = 0;
            }
        }
    });
};


/* -------------------------------------------------------
|
| Sistema de inserção de imagem de face dos personagens
|
// | -------------------------------------------------------*/
const getCharacterImageAction = (characterId) => {
    const characters = {
        0: 'resources/persona/protagonista-face.png',
        1: 'resources/persona/protagonista-face.png',
        2: 'resources/persona/protagonista-face.png',
        3: 'resources/persona/protagonista-face.png',
        4: 'resources/persona/protagonista-face.png',
        5: 'resources/persona/protagonista-face.png'
    };
    return characters[characterId] || 'resources/persona/default-persona.jpg';
};

/* -------------------------------------------------------
|
| Sistema de troca de capítulo
|
// | -------------------------------------------------------*/
const updateCaptionAction = (caption) => {
    $(".caption-jogo").html(`${captions[caption - 1]}`);
};

/* -------------------------------------------------------
|
| Sistema de aumento de pontos
|
| -------------------------------------------------------*/
const updatePointsAction = (value) => {
    let currentPointsText = $(".pontos-jogo").html();
    let currentPoints = parseInt(currentPointsText.replace(/^\D+/g, ''), 10) || 0;
    let newPoints = currentPoints + value;
    $(".pontos-jogo").html(`Pontos: ${newPoints}`);
};

/* -------------------------------------------------------
|
| Sistema de aumento de ranking
|
| -------------------------------------------------------*/
const updateRankAction = () => {
    
    // Busca a quantidade de pontos do sistema
    let currentPointsText = $(".pontos-jogo").html();
    let currentPoints = parseInt(currentPointsText.replace(/^\D+/g, ''), 10) || 0;

    for (let i = ranks.length - 1; i >= 0; i--) {
        if (currentPoints >= ranks[i].pointsRequired) {
            currentRank = ranks[i].rank;
            break;
        }
    }
    document.querySelector(".rank-jogo").textContent = `Rank: ${currentRank}`;
};

/* -------------------------------------------------------
|
| Sistema de contagem de tempo do painel
|
| -------------------------------------------------------*/

const timerBoardAction = () => {
    let textTimer = $(".time-jogo");
    let totalSeconds = 0;

    setInterval(() => {
        totalSeconds++;
        let hours = Math.floor(totalSeconds / 3600);
        let minutes = Math.floor((totalSeconds % 3600) / 60);
        let seconds = totalSeconds % 60;

        let formattedTime = '';

        if (hours > 0) {
            formattedTime += `${hours}h `;
        }
        if (minutes > 0 || hours > 0) {
            formattedTime += `${minutes}m `;
        }
        formattedTime += `${seconds}s`;

        textTimer.text(`Tempo de jogo : ${formattedTime}`);
    }, 1000);
};


/* -------------------------------------------------------
|
| Sistema de segurança para recargas acidentais
|
| -------------------------------------------------------*/
// window.addEventListener('beforeunload', function (e) {
//     const confirmationMessage = 'Você tem certeza de que deseja sair desta página?';
//     e.preventDefault();
//     e.returnValue = confirmationMessage;
//     return confirmationMessage;
// });


/* -------------------------------------------------------
|
| Sistema de guia em segundo plano
|
| -------------------------------------------------------*/
const backgroundGuideAction = () => {
    const originalTitle = document.title;
    const hiddenTitle = 'Volte nos ajudar o quanto antes!';
    const visibleTitle = 'Seja bem-vindo jogador!';

    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            document.title = hiddenTitle; 
        } else {

            document.title = visibleTitle; 
            setTimeout(() => {
                document.title = originalTitle; 
            }, 1000);
        }
    });
};

/* -------------------------------------------------------
|
| Sistema de troca de level
|
| -------------------------------------------------------*/

const chargeBoardAction = (type, value) => {
    switch (type) {
        case 'level':
            let level = $(".level-jogo");
            level.html(`Level : ${value}`);
            break;
    }
};

/* -------------------------------------------------------
|
| Sistema de atualização de missões
|
| -------------------------------------------------------*/
const updateMissionsAction = () => {
    // Atualiza o número de missões completas e pendentes
    $(".missao-completa").text(`Missões Completas: ${completedMissions}`);
    $(".missao-pendente").text(`Missões Pendentes: ${pendingMissions}`);
};

/* -------------------------------------------------------
|
| Sistema de play do game
|
| -------------------------------------------------------*/

$("#play").click(() => {
    $("#play").addClass('hidden');

    const audioElement = document.getElementById('backgroundSound');
    audioElement.volume = 0.3;
    audioElement.play();

    $(document).ready(init);
});