
/* -------------------------------------------------------
|
| Definição de rankings
|
| -------------------------------------------------------*/
const ranks = [
    { rank: "Novato", pointsRequired: 0 },
    { rank: "Aspirante", pointsRequired: 180 },
    { rank: "Desbravador", pointsRequired: 360 },
    { rank: "Explorador", pointsRequired: 420 },
    { rank: "Aventureiro", pointsRequired: 670 },
    { rank: "Vanguardista", pointsRequired: 760 },
    { rank: "Gladiador", pointsRequired: 910 },
    { rank: "Mestre das Armas", pointsRequired: 1000 },
    { rank: "Sábio", pointsRequired: 1300 },
    { rank: "Senhor das Sombras", pointsRequired: 1600 },
    { rank: "Guardião", pointsRequired: 2000 },
    { rank: "Lenda Viva", pointsRequired: 2500 },
    { rank: "Herói", pointsRequired: 3000 },
    { rank: "Soberano", pointsRequired: 3500 },
    { rank: "Arcanista", pointsRequired: 4000 },
    { rank: "Venerável", pointsRequired: 5000 },
    { rank: "Fabuloso", pointsRequired: 6000 },
    { rank: "Celestial", pointsRequired: 7500 },
    { rank: "Divino", pointsRequired: 9000 },
    { rank: "Supremo", pointsRequired: 11000 },
    { rank: "Eterno", pointsRequired: 13000 },
    { rank: "Incompreensível", pointsRequired: 15000 },
    { rank: "Transcendental", pointsRequired: 18000 },
    { rank: "Mítico", pointsRequired: 21000 },
    { rank: "Épico", pointsRequired: 25000 },
    { rank: "Lendário", pointsRequired: 30000 },
    { rank: "Inigualável", pointsRequired: 35000 },
    { rank: "Imperador", pointsRequired: 40000 },
    { rank: "Eminente", pointsRequired: 45000 },
    { rank: "Excepcional", pointsRequired: 50000 },
    { rank: "Soberano Supremo", pointsRequired: 60000 },
    { rank: "Arquiteto das Estrelas", pointsRequired: 70000 },
    { rank: "Lendário Supremo", pointsRequired: 80000 },
    { rank: "Celestial Supremo", pointsRequired: 90000 },
    { rank: "Incrível", pointsRequired: 100000 },
    { rank: "Transcendente", pointsRequired: 120000 },
    { rank: "Criador de Mundos", pointsRequired: 140000 },
    { rank: "Guardião do Cosmo", pointsRequired: 160000 },
    { rank: "Supremo Eterno", pointsRequired: 180000 },
    { rank: "Deus Antigo", pointsRequired: 200000 }
];


// ------------------ Váriaveis globais ------------------
var currentPhase = 0;
var currentMessageIndex = 0;
let totalPoints = 0;
let currentRank = ranks[0].rank;
let completedMissions = 0;
let pendingMissions = 0;

const init = () => {
    // Inicia o Game
    loadMessagesAction();
    timerBoardAction();
    ClickButtonAction();
    backgroundGuideAction();
};

/* -------------------------------------------------------
|
| Sistema de carregar as mensagens
|
| -------------------------------------------------------*/
const loadMessagesAction =  async() => {
    try {
        const response = await fetch('messages.json');
        if (!response.ok) {
            throw new Error('Erro ao carregar o arquivo JSON.');
        }
        messages = await response.json();

        // Conta a quantidade de missões
        messages.forEach(element => {
            pendingMissions = pendingMissions + element.texts.length;
        });

        updateMissionsAction(); // Atualiza o sistema de missões


    } catch (error) {
        console.error(error);
    }
}

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