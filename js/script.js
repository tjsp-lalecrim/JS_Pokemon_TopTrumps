// DOM Elements
const getElement = (id) => document.getElementById(id);
const getQuerySelector = (selector) => document.querySelector(selector);

const elResetButton = getElement('reset-game');
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
let deckLength = 20;
let yourDeck = [];
let opponentDeck = [];
let yourCard = null;
let opponentCard = null;

// Game Initialization
function startGame() {
    document.getElementById('menu').style.display = 'none';
    document.querySelector('.score').style.display = 'flex';
    document.querySelector('.table').style.display = 'flex';

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
    // get all cards
    const cards = pokemonCards.slice(0, pokemonCards.length);

    // shuffle
    const shuffledCards = cards.sort(() => Math.random() - 0.5);

    // half of the cards for both players.
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
    updateImgs();
    updateNameAndType();
    updateStatsButtons();
}

function updateDecksLength() {
    elYourCards.innerText = yourDeck.length;
    elOpponentCards.innerText = opponentDeck.length;
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
    })
}

function createStatButton(stat, id, card, showStatValue, isClickable) {
    const elStat = document.createElement('button');
    elStat.id = id;

    const elStatDescription = document.createElement('span');
    elStatDescription.innerText = `${stat}`;

    const elStatValue = document.createElement('span');
    elStatValue.classList.add('stat-value');
    elStatValue.innerText = showStatValue ? `${getStatValue(card, stat)}` : '???';

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
    setTimeout(popCards, 2500);
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
    })
}

function highlightStats(chosenStat) {
    const yourStat = getElement(chosenStat);
    const opponentStat = getElement('opp-' + chosenStat);

    yourStat.classList.add('active');
    opponentStat.classList.add('active');
}

function compareStats(chosenStat) {
    const yourValue = getStatValue(yourCard, chosenStat);
    const yourValueWithMultiplier = calculateStatMultiplier(yourCard, opponentCard, chosenStat);
    const opponentValue = getStatValue(opponentCard, chosenStat);
    const typeMultiplier = calculateTypeMultiplier(yourCard.type, opponentCard.type);

    if (yourValueWithMultiplier > opponentValue) {
        yourDeck.unshift(yourCard, opponentCard);
    }
    else if (yourValueWithMultiplier < opponentValue) {
        opponentDeck.unshift(yourCard, opponentCard);
    }

    updateChosenStatWithMultiplier(chosenStat, yourValue, yourValueWithMultiplier, typeMultiplier);
}

function updateChosenStatWithMultiplier(chosenStat, oldValue, newValue, typeMultiplier) {
    const elChosenStat = elYourOptions.querySelector(`#${chosenStat}`);
    elChosenStat.querySelector('.stat-value').innerText = `${oldValue} => ${newValue}`;

    if (typeMultiplier > 1) {
        elChosenStat.classList.add('stat-increased');
    } else if (typeMultiplier < 1) {
        elChosenStat.classList.add('stat-reduced');
    }
}

// Game Over Handling
function handleGameOver() {
    updateDecksLength();
    hideElements('.score', '.table');
    showElement('menu');
    const elResultMessage = getElement('result-message');

    if (yourDeck.length == 0) {
        elResultMessage.innerText = 'You lose!';
    } else {
        elResultMessage.innerText = 'You win!';
    }
}

// Display Handling
function hideElements(...selectors) {
    selectors.forEach((selector) => {
        getQuerySelector(selector).style.display = 'none';
    });
}

function showElement(selector) {
    getElement(selector).style.display = 'flex';
}

// Event Listeners
elResetButton.addEventListener('click', startGame);



