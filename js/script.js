// DOM Elements
const getElement = (id) => document.getElementById(id);
const getQuerySelector = (selector) => document.querySelector(selector);

const elYourPoints = getQuerySelector('#your-points');
const elOpponentPoints = getQuerySelector('#opponent-points');
const elYourCards = getQuerySelector('#your-cards');
const elOpponentCards = getQuerySelector('#opponent-cards');
const elYourName = getQuerySelector('#your-label');
const elOpponentName = getQuerySelector('#opponent-label');
const elYourType = getQuerySelector('#your-type');
const elOpponentType = getQuerySelector('#opponent-type');
const elYourImg = getElement('your-img');
const elOpponentImg = getElement('opponent-img');
const elYourOptions = getQuerySelector('#your-options');
const elOpponentOptions = getQuerySelector('#opponent-options');
const elSelectedStat = getQuerySelector('#selected-stat');
const elYourStatValue = getQuerySelector('#your-stat-value');
const elOpponentStatValue = getQuerySelector('#opponent-stat-value');
const elTypeMultiplier = getQuerySelector('#type-multiplier');
const elResult = getQuerySelector('#result');

// Global variables
let currentPack = [...lastStagePack];
let deckLength = currentPack.length / 2;
let yourDeck = [];
let opponentDeck = [];
let yourCard = null;
let opponentCard = null;
let yourValue = 0;
let typeMultiplier = 1;
let yourValueWithMultiplier = 0;
let opponentValue = 0;

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

    updateDecksLength();
    resetCardsAnimations();
    updateImgs();
    updateNameAndType();
    updateStatsButtons();
}

function resetCardsAnimations() {
    ['your-current-card', 'opponent-current-card'].forEach(id => {
        getElement(id).classList.remove('shake', 'fade');
    });
}

function updateDecksLength() {
    elYourCards.innerText = yourDeck.length + 1;
    elOpponentCards.innerText = opponentDeck.length + 1;
}

function updateImgs() {
    elYourImg.src = `img/pokemons/${yourCard.name}.png`;
    elOpponentImg.src = 'img/pokeball.png';
}

function updateNameAndType() {
    elYourName.innerText = yourCard.name;
    elYourType.src = `img/types/${yourCard.type}.png`;
    elYourType.alt = `${yourCard.type} Type`;

    elOpponentName.innerText = '???';
    elOpponentType.src = `img/types/${opponentCard.type}.png`;
    elOpponentType.alt = `${opponentCard.type} Type`;
}

function updateStatsButtons() {
    elYourOptions.innerHTML = '';
    elOpponentOptions.innerHTML = '';

    stats.forEach(stat => {
        const elYourStat = createStatButton(stat, `${stat}`, yourCard, true, true);
        elYourOptions.append(elYourStat);

        const elOpponentStat = createStatButton(stat, `opp-${stat}`, opponentCard, false, false);
        elOpponentOptions.append(elOpponentStat);
    });
}

function createStatButton(stat, id, card, showStatValue, isClickable) {
    const elStat = document.createElement('button');
    elStat.id = id;

    const elStatDescription = document.createElement('span');
    elStatDescription.innerText = stat;

    const elStatValue = document.createElement('span');
    elStatValue.classList.add('stat-value');
    elStatValue.innerText = showStatValue ? getStatValue(card, stat) : '???';

    elStat.append(elStatDescription);
    elStat.append(elStatValue);

    if (isClickable) {
        elStat.addEventListener('click', e => chooseStat(e));
    }

    return elStat;
}

// Gameplay Functions
function chooseStat(e) {
    const chosenStat = e.target.id;

    disableYourButtons();
    revealOpponent();
    highlightStats(chosenStat);
    compareStats(chosenStat);
}

function disableYourButtons() {
    const elYourButtons = elYourOptions.querySelectorAll('button');
    elYourButtons.forEach(button => button.style.pointerEvents = 'none');
}

function revealOpponent() {
    elOpponentImg.src = `img/pokemons/${opponentCard.name}.png`;
    elOpponentName.innerText = opponentCard.name;
    _revealOpponentStats();
}

function _revealOpponentStats() {
    elOpponentOptions.innerHTML = '';

    stats.forEach(stat => {
        const elOpponentStat = createStatButton(stat, `opp-${stat}`, opponentCard, true, false);
        elOpponentOptions.append(elOpponentStat);
    });
}

function highlightStats(chosenStat) {
    [chosenStat, `opp-${chosenStat}`].forEach(id => {
        getElement(id).classList.add('active');
    });
}

function compareStats(chosenStat) {
    yourValue = getStatValue(yourCard, chosenStat);
    typeMultiplier = calculateTypeMultiplier(yourCard.type, opponentCard.type);
    yourValueWithMultiplier = calculateStatMultiplier(yourCard, opponentCard, chosenStat);
    opponentValue = getStatValue(opponentCard, chosenStat);

    updateChosenStatValue(chosenStat, yourValue, yourValueWithMultiplier, typeMultiplier);
}

function addCurrentCardsToWinner(yourStatValue, opponentStatValue) {
    if (yourStatValue > opponentStatValue) {
        yourDeck.unshift(yourCard, opponentCard);
    } else if (yourStatValue < opponentStatValue) {
        opponentDeck.unshift(yourCard, opponentCard);
    } else {
        yourDeck.unshift(yourCard);
        opponentDeck.unshift(opponentCard);
    }

    setTimeout(popCards, 1000);
}

function updateChosenStatValue(chosenStat, oldValue, newValue, typeValue) {
    const elChosenStat = getElement(chosenStat);

    if (typeValue !== 1) {
        elChosenStat.querySelector('.stat-value').innerText = `${oldValue} => ${newValue}`;
    }

    applyStatAnimation(chosenStat, typeValue);
}

function applyStatAnimation(chosenStat, typeValue) {
    const elChosenStat = getElement(chosenStat);

    if (typeValue > 1) {
        elChosenStat.classList.add('stat-increased');
    } else if (typeValue < 1) {
        elChosenStat.classList.add('stat-reduced');
    }

    setTimeout(() => applyCardsAnimations(yourValueWithMultiplier, opponentValue), 1000);
}

function applyCardsAnimations(yourStatValue, opponentStatValue) {
    const yourCardElement = getElement('your-current-card');
    const opponentCardElement = getElement('opponent-current-card');

    if (yourStatValue > opponentStatValue) {
        yourCardElement.classList.add('shake');
        opponentCardElement.classList.add('fade');
    } else if (yourStatValue < opponentStatValue) {
        yourCardElement.classList.add('fade');
        opponentCardElement.classList.add('shake');
    } else {
        yourCardElement.classList.add('fade');
        opponentCardElement.classList.add('fade');
    }

    setTimeout(() => addCurrentCardsToWinner(yourValueWithMultiplier, opponentStatValue), 1000);
}

// Game Over Handling
function handleGameOver() {
    updateDecksLength();
    hideElements('.table');
    showElement('menu');
    const elResultMessage = getElement('result-message');

    elResultMessage.innerText = yourDeck.length === 0 ? 'You lose!' : 'You win!';
}

// Display Handling
function hideElements(...selectors) {
    selectors.forEach(selector => {
        getQuerySelector(selector).style.display = 'none';
    });
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
getElement('first-stage-pack').addEventListener('click', function() {
    selectPack(firstStagePack);
});

getElement('mid-stage-pack').addEventListener('click', function() {
    selectPack(midStagePack);
});

getElement('last-stage-pack').addEventListener('click', function() {
    selectPack(lastStagePack);
});
