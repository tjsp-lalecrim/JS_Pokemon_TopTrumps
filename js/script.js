// DOM Elements
const getElement = (id) => document.getElementById(id);
const getQuerySelector = (selector) => document.querySelector(selector);

const elements = {
    gameLog: getElement('game-log'),
    yourPoints: getQuerySelector('#your-points'),
    opponentPoints: getQuerySelector('#opponent-points'),
    yourCards: getQuerySelector('#your-cards'),
    opponentCards: getQuerySelector('#opponent-cards'),
    yourName: getQuerySelector('#your-label'),
    opponentName: getQuerySelector('#opponent-label'),
    yourType: getQuerySelector('#your-type'),
    yourTypeName: getQuerySelector('#your-type-name'),
    opponentType: getQuerySelector('#opponent-type'),
    opponentTypeName: getQuerySelector('#opponent-type-name'),
    yourImg: getElement('your-img'),
    opponentImg: getElement('opponent-img'),
    yourOptions: getQuerySelector('#your-options'),
    opponentOptions: getQuerySelector('#opponent-options'),
    selectedStat: getQuerySelector('#selected-stat'),
    yourStatValue: getQuerySelector('#your-stat-value'),
    opponentStatValue: getQuerySelector('#opponent-stat-value'),
    typeMultiplier: getQuerySelector('#type-multiplier'),
    result: getQuerySelector('#result'),
    nextTurnButton: getElement('next-turn')
};

// Global variables
let currentPack = [...lastStagePack];
let deckLength = currentPack.length / 2;
let yourDeck = [];
let opponentDeck = [];
let yourCard = null;
let opponentCard = null;
let yourStat = '';
let yourValue = 0;
let typeMultiplier = 1;
let yourValueWithMultiplier = 0;
let opponentStat = '';
let opponentValue = 0;
let yourTurn = true;

// Game Initialization
function startGame() {
    hideElements('.menu');
    showElement('table');
    resetVariables();
    mountDecks();
}

function resetVariables() {
    yourDeck = [];
    opponentDeck = [];
    yourCard = null;
    opponentCard = null;
    yourStat = '';
    yourValue = 0;
    yourValueWithMultiplier = 0;
    typeMultiplier = 1;
    opponentStat = '';
    opponentValue = '';
}

// Deck Handling
function mountDecks() {
    const cards = currentPack.slice(0, currentPack.length);
    const shuffledCards = cards.sort(() => Math.random() - 0.5);

    yourDeck = shuffledCards.slice(0, deckLength);
    opponentDeck = shuffledCards.slice(deckLength, deckLength * 2);

    popCards();
}

function popCards() {
    if (yourDeck.length === 0 || opponentDeck.length === 0) {
        return handleGameOver();
    }

    yourCard = yourDeck.pop();
    opponentCard = opponentDeck.pop();

    hideNextTurnButton();
    resetLog();
    updateDecksLength();
    resetCardsAnimations();
    updateImgs();
    updateNameAndType();
    updateStatsButtons();
    addLog(yourTurn ? 'Your turn' : 'Opponent turn');

    if (!yourTurn) {
        setTimeout(() => opponentChooseStat(), 2000);
    }
}

function hideNextTurnButton() {
    elements.nextTurnButton.style.visibility = 'hidden';
}

function showNextTurnButton() {
    elements.nextTurnButton.style.visibility = 'visible';
}

function resetCardsAnimations() {
    ['your-current-card', 'opponent-current-card'].forEach(id => {
        getElement(id).classList.remove('shake', 'fade');
    });
}

function addLog(message) {
    const logElement = document.createElement('span');
    logElement.classList.add('log');
    logElement.innerText = message;
    elements.gameLog.append(logElement);
}

function resetLog() {
    elements.gameLog.innerHTML = '';
}

function updateDecksLength() {
    elements.yourCards.innerText = yourDeck.length + 1;
    elements.opponentCards.innerText = opponentDeck.length + 1;
}

function updateImgs() {
    if (yourTurn) {
        elements.yourImg.src = `img/pokemons/${yourCard.name}.png`;
        elements.opponentImg.src = 'img/pokeball.png';
    } else {
        elements.yourImg.src = 'img/pokeball.png';
        elements.opponentImg.src = `img/pokemons/${opponentCard.name}.png`;
    }
}

function updateNameAndType() {
    let typeHint;

    if (yourTurn) {
        typeHint = getHintByType(opponentCard.type).join(' or ');

        elements.yourName.innerText = yourCard.name;
        elements.yourType.src = `img/types/${yourCard.type}.png`;
        elements.yourType.alt = `${yourCard.type} Type`;
        elements.yourTypeName.innerText = `${yourCard.type}`;

        elements.opponentName.innerText = '???';
        elements.opponentType.src = `img/types/${opponentCard.type}.png`;
        elements.opponentType.alt = `${opponentCard.type} Type`;
        elements.opponentTypeName.innerText = `${typeHint}`;
    } else {
        typeHint = getHintByType(yourCard.type).join(' or ');

        elements.yourName.innerText = '???';
        elements.yourType.src = `img/types/${opponentCard.type}.png`;
        elements.yourType.alt = `${opponentCard.type} Type`;
        elements.yourTypeName.innerText = `${typeHint}`;
        elements.opponentName.innerText = opponentCard.name;

        elements.opponentName.src = `img/types/${opponentCard.type}.png`;
        elements.opponentName.alt = `${opponentCard.type} Type`;
        elements.opponentName.innerText = `${opponentCard.type}`;
    }
}

function updateStatsButtons() {
    elements.yourOptions.innerHTML = '';
    elements.opponentOptions.innerHTML = '';

    stats.forEach(stat => {
        const yourStatButton = createStatButton(stat, `${stat}`, yourCard, yourTurn, yourTurn);
        elements.yourOptions.append(yourStatButton);

        const opponentStatButton = createStatButton(stat, `opp-${stat}`, opponentCard, !yourTurn, false);
        elements.opponentOptions.append(opponentStatButton);
    });
}

function createStatButton(stat, id, card, showStatValue, isClickable) {
    const statButton = document.createElement('button');
    statButton.id = id;

    const statDescription = document.createElement('span');
    statDescription.innerText = stat;

    const statValue = document.createElement('span');
    statValue.classList.add('stat-value');
    statValue.innerText = showStatValue ? getStatValue(card, stat) : '???';

    statButton.append(statDescription);
    statButton.append(statValue);

    if (isClickable) {
        statButton.addEventListener('click', e => chooseStat(e));
    }

    return statButton;
}

// Gameplay Functions
function chooseStat(e) {
    yourStat = e.target.id;
    opponentStat = getOpponentStat(yourStat);

    disableYourButtons();
    revealCard();
    highlightStats();
    compareStats();
}

function opponentChooseStat() {
    opponentStat = getHighestStat(opponentCard);
    yourStat = getOpponentStat(opponentStat);

    revealCard();
    highlightStats();
    compareStats();
}



function disableYourButtons() {
    const yourButtons = elements.yourOptions.querySelectorAll('button');
    yourButtons.forEach(button => button.style.pointerEvents = 'none');
}

function revealCard() {
    if (yourTurn) {
        elements.opponentImg.src = `img/pokemons/${opponentCard.name}.png`;
        elements.opponentName.innerText = opponentCard.name;
    } else {
        elements.yourImg.src = `img/pokemons/${yourCard.name}.png`;
        elements.yourName.innerText = yourCard.name;
    }

    revealOpponentStats();
}

function revealOpponentStats() {
    if (yourTurn) {
        elements.opponentOptions.innerHTML = '';
        elements.opponentTypeName.innerText = opponentCard.type;

        stats.forEach(stat => {
            const opponentStat = createStatButton(stat, `opp-${stat}`, opponentCard, true, false);
            elements.opponentOptions.append(opponentStat);
        });
    } else {
        elements.yourOptions.innerHTML = '';
        elements.yourTypeName.innerText = yourCard.type;

        stats.forEach(stat => {
            const yourStat = createStatButton(stat, `${stat}`, yourCard, true, false);
            elements.yourOptions.append(yourStat);
        });
    }
}

function highlightStats() {
    [yourStat, `opp-${opponentStat}`].forEach(id => {
        getElement(id).classList.add('active');
    });
}

function compareStats() {
    yourValue = getStatValue(yourCard, yourStat);
    typeMultiplier = calculateTypeMultiplier(yourCard.type, opponentCard.type);
    yourValueWithMultiplier = calculateStatMultiplier(yourCard, opponentCard, yourStat);
    opponentValue = getStatValue(opponentCard, opponentStat);

    updateCompareStatsLog();
    updateChosenStatValue(yourStat, yourValue, yourValueWithMultiplier);
}

function updateCompareStatsLog() {
    // log stats values
    if (yourValue === yourValueWithMultiplier) {
        addLog(`${yourStat} VS. ${opponentStat}`);
        addLog(`${yourValue} VS. ${opponentValue}`);
    } else if (yourValueWithMultiplier === 0) {
        addLog(`${yourCard.type} ${yourStat} is cancelled against ${opponentCard.type} ${opponentStat}`);
        addLog(`${yourStat} VS. ${opponentStat}`);
        addLog(`${yourValueWithMultiplier} VS. ${opponentValue}`);
    } else if (yourValueWithMultiplier < yourValue) {
        addLog(`${yourCard.type} ${yourStat} is reduced against ${opponentCard.type} ${opponentStat}`);
        addLog(`${yourStat} VS. ${opponentStat}`);
        addLog(`${yourValueWithMultiplier} VS. ${opponentValue}`);
    } else if (yourValueWithMultiplier > yourValue) {
        addLog(`${yourCard.type} ${yourStat} is increased against ${opponentCard.type} ${opponentStat}`);
        addLog(`${yourStat} VS. ${opponentStat}`);
        addLog(`${yourValueWithMultiplier} VS. ${opponentValue}`);
    }

    // log result
    if (yourValueWithMultiplier > opponentValue) {
        addLog(`You win!`);
    } else if (yourValueWithMultiplier < opponentValue) {
        addLog(`You lose!`);
    } else {
        addLog(`Draw!`);
    }
}

function addCurrentCardsToWinner(statValue, opponentStatValue) {
    if (statValue > opponentStatValue) {
        yourDeck.unshift(yourCard, opponentCard);
        yourTurn = true;
    } else if (statValue < opponentStatValue) {
        opponentDeck.unshift(yourCard, opponentCard);
        yourTurn = false;
    } else {
        yourDeck.unshift(yourCard);
        opponentDeck.unshift(opponentCard);
    }

    setTimeout(showNextTurnButton(), 1000);
}

function updateChosenStatValue(chosenStat, oldValue, newValue) {
    const chosenStatElement = getElement(chosenStat);

    if (oldValue != newValue) {
        chosenStatElement.querySelector('.stat-value').innerText = `${oldValue} => ${newValue}`;
    }

    applyStatAnimation(chosenStat, oldValue, newValue, opponentValue);
}

function applyStatAnimation(chosenStat, oldStatValue, newStatValue, opponentStatValue) {
    const chosenStatElement = getElement(chosenStat);

    if (oldStatValue < newStatValue) {
        chosenStatElement.classList.add('stat-increased');
    } else if (oldStatValue > newStatValue) {
        chosenStatElement.classList.add('stat-reduced');
    }

    setTimeout(() => applyCardsAnimations(newStatValue, opponentStatValue), 1500);
}

function applyCardsAnimations(statValue, opponentStatValue) {
    const yourCardElement = getElement('your-current-card');
    const opponentCardElement = getElement('opponent-current-card');

    if (statValue > opponentStatValue) {
        yourCardElement.classList.add('shake');
        opponentCardElement.classList.add('fade');
    } else if (statValue < opponentStatValue) {
        yourCardElement.classList.add('fade');
        opponentCardElement.classList.add('shake');
    } else {
        yourCardElement.classList.add('fade');
        opponentCardElement.classList.add('fade');
    }

    setTimeout(() => addCurrentCardsToWinner(statValue, opponentStatValue), 1000);
}

// Game Over Handling
function handleGameOver() {
    updateDecksLength();
    hideElements('.table');
    showElement('menu');
    const resultMessage = getElement('result-message');

    resultMessage.innerText = yourDeck.length === 0 ? 'You lose!' : 'You win!';
}

// Display Handling
function hideElements(...selectors) {
    selectors.forEach(selector => getQuerySelector(selector).style.display = 'none');
}

function showElement(selector) {
    getElement(selector).style.display = 'flex';
}

function selectPack(pack) {
    currentPack = [...pack];
    deckLength = currentPack.length / 2;
    startGame();
}

// Event Listeners
getElement('first-stage-pack').addEventListener('click', () => selectPack(firstStagePack));
getElement('mid-stage-pack').addEventListener('click', () => selectPack(midStagePack));
getElement('last-stage-pack').addEventListener('click', () => selectPack(lastStagePack));
getElement('next-turn').addEventListener('click', () => popCards());
