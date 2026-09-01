// DOM Elements
const getElement = (id) => document.getElementById(id);
const getQuerySelector = (selector) => document.querySelector(selector);

const elements = {
    header: getQuerySelector('header'),
    gameLog: getElement('game-log'),
    yourPoints: getQuerySelector('#your-points'),
    opponentPoints: getQuerySelector('#opponent-points'),
    yourCards: getQuerySelector('#your-cards'),
    opponentCards: getQuerySelector('#opponent-cards'),
    yourXp: getElement('your-xp'),
    opponentXp: getElement('opponent-xp'),
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
    continueButton: getElement('next-turn'),
    turnMessage: getElement('turn-message'),
    orientationPrompt: getElement('orientation-prompt'),
    orientationStatus: getElement('orientation-status'),
    enterLandscapeButton: getElement('enter-landscape'),
    continuePortraitButton: getElement('continue-portrait')
};

function dismissOrientationPrompt() {
    elements.orientationPrompt.dataset.dismissed = 'true';
}

async function requestLandscapeMode() {
    elements.orientationStatus.innerText = '';

    try {
        if (document.documentElement.requestFullscreen && !document.fullscreenElement) {
            await document.documentElement.requestFullscreen();
        }

        if (screen.orientation && typeof screen.orientation.lock === 'function') {
            await screen.orientation.lock('landscape');
        }
    } catch (error) {
        elements.orientationStatus.innerText = 'Não foi possível alterar a orientação. O jogo continuará normalmente.';
    } finally {
        dismissOrientationPrompt();
    }
}

// Global variables
let currentPack = [];
let deckLength = 0;
let yourDeck = [];
let opponentDeck = [];
let yourCard = null;
let opponentCard = null;
let yourStat = '';
let opponentStat = '';
let yourValue = 0;
let opponentValue = 0;
let typeMultiplier = 1;
let yourValueWithMultiplier = 0;
let opponentValueWithMultiplier = 0;
let yourTurn = true;
let evolutionMode = false;

const EVOLUTION_XP = 2;
const evolutionMap = {
    Bulbasaur: 'Ivysaur', Charmander: 'Charmeleon', Squirtle: 'Wartortle',
    Pidgey: 'Pidgeotto', Rattata: 'Raticate', Spearow: 'Fearow', Ekans: 'Arbok',
    Pikachu: 'Raichu', Sandshrew: 'Sandslash', 'Nidoran F': 'Nidorina',
    'Nidoran M': 'Nidorino', Clefairy: 'Clefable', Vulpix: 'Ninetales',
    Jigglypuff: 'Wigglytuff', Zubat: 'Golbat', Oddish: 'Gloom', Paras: 'Parasect',
    Venonat: 'Venomoth', Diglett: 'Dugtrio', Meowth: 'Persian', Psyduck: 'Golduck',
    Mankey: 'Primeape', Growlithe: 'Arcanine', Poliwag: 'Poliwhirl', Abra: 'Kadabra',
    Machop: 'Machoke', Bellsprout: 'Weepinbell', Tentacool: 'Tentacruel',
    Geodude: 'Graveler', Ponyta: 'Rapidash', Slowpoke: 'Slowbro',
    Magnemite: 'Magneton', Doduo: 'Dodrio', Seel: 'Dewgong', Grimer: 'Muk',
    Shellder: 'Cloyster', Gastly: 'Haunter', Drowzee: 'Hypno', Krabby: 'Kingler',
    Voltorb: 'Electrode', Exeggcute: 'Exeggutor', Cubone: 'Marowak',
    Koffing: 'Weezing', Rhyhorn: 'Rhydon', Horsea: 'Seadra', Goldeen: 'Seaking',
    Staryu: 'Starmie', Omanyte: 'Omastar', Kabuto: 'Kabutops', Dratini: 'Dragonair'
};

const cardCatalog = new Map(allCards.map(card => [card.name, card]));
const evolutionPack = firstStagePack.filter(card => evolutionMap[card.name]);

function copyCardStats(target, source) {
    ['name', 'type', 'hp', 'attack', 'defense', 'specialAttack', 'specialDefense', 'speed']
        .forEach(property => target[property] = source[property]);
}

function createPlayableCard(card) {
    const playableCard = new PokemonCard(
        card.name, card.type, card.hp, card.attack, card.defense,
        card.specialAttack, card.specialDefense, card.speed
    );
    playableCard.baseName = card.name;
    playableCard.xp = 0;
    playableCard.hasEvolved = false;
    return playableCard;
}

// Game Initialization
function startGame() {
    hideElements('.menu','header');
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
    opponentStat = '';
    yourValue = 0;
    opponentValue = 0;
    typeMultiplier = 1;
    yourValueWithMultiplier = 0;
    opponentValueWithMultiplier = 0;
    yourTurn = true;
}

// Deck Handling
function mountDecks() {
    const cards = currentPack.map(createPlayableCard);
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

    hideContinueButton();
    resetLog();
    updateDecksLength();
    resetCardsAnimations();
    updateImgs();
    updateNameAndType();
    updateStatsButtons();
    updateXpDisplay();
    elements.turnMessage.innerText = yourTurn ? 'Your turn' : 'Opponent turn';
    //addLog(yourTurn ? 'Your turn' : 'Opponent turn');

    if (!yourTurn) {
        setTimeout(opponentChooseStat, 2000);
    }
}

function updateXpDisplay() {
    [elements.yourXp, elements.opponentXp].forEach(element => element.hidden = !evolutionMode);
    if (!evolutionMode) return;

    elements.yourXp.innerText = getXpLabel(yourCard);
    elements.opponentXp.innerText = getXpLabel(opponentCard);
}

function getXpLabel(card) {
    return card.hasEvolved ? 'EVOLVED' : `XP ${card.xp}/${EVOLUTION_XP}`;
}

function hideContinueButton() {
    elements.continueButton.style.visibility = 'hidden';
    elements.continueButton.style.display = 'none';
}

function showContinueButton() {
    elements.continueButton.style.display = 'inline-flex';
    elements.continueButton.style.visibility = 'visible';
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

    elements.yourType.src = `img/types/${yourCard.type}.png`.toLowerCase();
    elements.yourType.alt = `${yourCard.type} Type`;
    elements.opponentType.src = `img/types/${opponentCard.type}.png`.toLowerCase();
    elements.opponentType.alt = `${opponentCard.type} Type`;

    if (yourTurn) {
        typeHint = getHintByType(opponentCard.type).join(' or ');

        elements.yourName.innerText = yourCard.name;
        elements.yourTypeName.innerText = yourCard.type;
        elements.opponentName.innerText = '???';
        elements.opponentTypeName.innerText = typeHint;
    } else {
        typeHint = getHintByType(yourCard.type).join(' or ');

        elements.yourName.innerText = '???';
        elements.yourTypeName.innerText = typeHint;
        elements.opponentName.innerText = opponentCard.name;
        elements.opponentTypeName.innerText = opponentCard.type;
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
    statDescription.innerText = stat.replace(/([a-z])([A-Z])/g, '$1 $2');

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

    revealStats();
}

function revealStats() {
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
    opponentValue = getStatValue(opponentCard, opponentStat);

    if (yourTurn) {
        typeMultiplier = calculateTypeMultiplier(yourCard.type, opponentCard.type);
        yourValueWithMultiplier = calculateStatMultiplier(yourCard, opponentCard, yourStat);
        opponentValueWithMultiplier = opponentValue;
        updateChosenStatValue(yourStat, yourValue, yourValueWithMultiplier);
    } else {
        typeMultiplier = calculateTypeMultiplier(opponentCard.type, yourCard.type);
        yourValueWithMultiplier = yourValue;
        opponentValueWithMultiplier = calculateStatMultiplier(opponentCard, yourCard, opponentStat);
        updateChosenStatValue(`opp-${opponentStat}`, opponentValue, opponentValueWithMultiplier);
    }

    updateCompareStatsLog();
}

function updateCompareStatsLog() {
    // compare types
    if (yourTurn) {
        if (yourValueWithMultiplier === 0) {
            addLog(`${yourCard.type} ${yourStat} is cancelled against ${opponentCard.type} ${opponentStat}`);
        } else if (yourValueWithMultiplier < yourValue) {
            addLog(`${yourCard.type} ${yourStat} is reduced against ${opponentCard.type} ${opponentStat}`);
        } else if (yourValueWithMultiplier > yourValue) {
            addLog(`${yourCard.type} ${yourStat} is increased against ${opponentCard.type} ${opponentStat}`);
        }
    } else {
        if (opponentValueWithMultiplier === 0) {
            addLog(`${opponentCard.type} ${opponentStat} is cancelled against ${yourCard.type} ${yourStat}`);
        } else if (opponentValueWithMultiplier < opponentValue) {
            addLog(`${opponentCard.type} ${opponentStat} is reduced against ${yourCard.type} ${yourStat}`);
        } else if (opponentValueWithMultiplier > opponentValue) {
            addLog(`${opponentCard.type} ${opponentStat} is increased against ${yourCard.type} ${yourStat}`);
        }
    }

    // compare stats
    addLog(`${yourStat} VS. ${opponentStat}`);
    addLog(`${yourValueWithMultiplier} VS. ${opponentValueWithMultiplier}`);

    // result
    if (yourValueWithMultiplier > opponentValueWithMultiplier) {
        addLog(`You win!`);
    } else if (yourValueWithMultiplier < opponentValueWithMultiplier) {
        addLog(`You lose!`);
    } else {
        addLog(`Draw!`);
    }
}

function addCurrentCardsToWinner() {
    if (yourValueWithMultiplier > opponentValueWithMultiplier) {
        processEvolutionResult(yourCard, opponentCard);
        yourDeck.unshift(yourCard, opponentCard);
        yourTurn = true;
    } else if (yourValueWithMultiplier < opponentValueWithMultiplier) {
        processEvolutionResult(opponentCard, yourCard);
        opponentDeck.unshift(yourCard, opponentCard);
        yourTurn = false;
    } else {
        yourDeck.unshift(yourCard);
        opponentDeck.unshift(opponentCard);
    }

    setTimeout(showContinueButton, 1000);
}

function processEvolutionResult(winner, loser) {
    if (!evolutionMode) return;

    resetCardProgress(loser);

    if (winner.hasEvolved) return;
    winner.xp += 1;

    if (winner.xp < EVOLUTION_XP) {
        addLog(`${winner.name} gained 1 XP (${winner.xp}/${EVOLUTION_XP})`);
        return;
    }

    const evolvedName = evolutionMap[winner.name];
    const evolvedCard = cardCatalog.get(evolvedName);
    if (!evolvedCard) return;

    const previousName = winner.name;
    copyCardStats(winner, evolvedCard);
    winner.xp = 0;
    winner.hasEvolved = true;
    addLog(`${previousName} evolved into ${winner.name}!`);
}

function resetCardProgress(card) {
    const hadProgress = card.xp > 0 || card.hasEvolved;
    const previousName = card.name;
    const baseCard = cardCatalog.get(card.baseName);

    if (baseCard) copyCardStats(card, baseCard);
    card.xp = 0;
    card.hasEvolved = false;

    if (hadProgress) {
        const message = previousName === card.name
            ? `${card.name} lost its XP.`
            : `${previousName} returned to ${card.name}.`;
        addLog(message);
    }
}

function updateChosenStatValue(chosenStat, oldValue, newValue) {
    const chosenStatElement = getElement(chosenStat);

    if (oldValue != newValue) {
        chosenStatElement.querySelector('.stat-value').innerText = `${oldValue} => ${newValue}`;
    }

    applyStatAnimation(chosenStat, oldValue, newValue);
}

function applyStatAnimation(chosenStat, oldStatValue, newStatValue) {
    const chosenStatElement = getElement(chosenStat);

    if (oldStatValue < newStatValue) {
        chosenStatElement.classList.add('stat-increased');
    } else if (oldStatValue > newStatValue) {
        chosenStatElement.classList.add('stat-reduced');
    }

    setTimeout(applyCardsAnimations, 1000);
}

function applyCardsAnimations() {
    const yourCardElement = getElement('your-current-card');
    const opponentCardElement = getElement('opponent-current-card');

    if (yourValueWithMultiplier > opponentValueWithMultiplier) {
        yourCardElement.classList.add('shake');
        opponentCardElement.classList.add('fade');
    } else if (yourValueWithMultiplier < opponentValueWithMultiplier) {
        yourCardElement.classList.add('fade');
        opponentCardElement.classList.add('shake');
    } else {
        yourCardElement.classList.add('fade');
        opponentCardElement.classList.add('fade');
    }

    setTimeout(addCurrentCardsToWinner, 1000);
}

// Game Over Handling
function handleGameOver() {
    updateDecksLength();
    hideElements('.table');
    showElement('header');
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

function selectPack(pack, useEvolutionMode = false) {
    evolutionMode = useEvolutionMode;
    currentPack = [...pack];
    deckLength = currentPack.length / 2;
    startGame();
}

// Event Listeners
getElement('first-stage-pack').addEventListener('click', () => selectPack(firstStagePack));
getElement('mid-stage-pack').addEventListener('click', () => selectPack(midStagePack));
getElement('last-stage-pack').addEventListener('click', () => selectPack(lastStagePack));
getElement('evolution-mode').addEventListener('click', () => selectPack(evolutionPack, true));
getElement('next-turn').addEventListener('click', () => popCards());
elements.enterLandscapeButton.addEventListener('click', requestLandscapeMode);
elements.continuePortraitButton.addEventListener('click', dismissOrientationPrompt);
