

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

        // Conta a quantidade de missões
        messages.forEach(element => {
            pendingMissions += element.texts.length;
        });

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

        let currentPhaseMessages = messages[currentPhase].texts;

        document.querySelector(".texts-container").innerHTML += `<p class="titulo">${currentPhaseMessages[currentMessageIndex]}</p>`; 

        let element = document.querySelector(".texts-container");

        element.scrollTop = element.scrollHeight;

        currentMessageIndex++;

        // Remove um missão das pendetes
        pendingMissions--;
        // Adiciona uma missão das completas
        completedMissions++

        chargeBoardAction('level', (currentPhase + 1)); // Sistema de troca de level
        updatePointsAction(messages[currentMessageIndex].points); // Sistema de aumento de pontos
        updateRankAction(); // Sistema de classificação de ranking
        updateMissionsAction(); // Atualiza o sistema de missões
        updateCaptionAction(messages[currentMessageIndex - 1].capitulo); // Atualiza o sistema de capítulos

        if (currentMessageIndex >= currentPhaseMessages.length) {
            currentMessageIndex = 0;
            currentPhase++;
            if (currentPhase >= messages.length) {
                currentPhase = 0;
            }
        }
    });
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