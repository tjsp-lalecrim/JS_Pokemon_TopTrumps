const stats = ['HP', 'Attack', 'Defense', 'SpecialAttack', 'SpecialDefense', 'Speed'];

function getStatValue(card, stat) {
    const statProperty = {
        'HP': 'hp',
        'Attack': 'attack',
        'Defense': 'defense',
        'SpecialAttack': 'specialAttack',
        'SpecialDefense': 'specialDefense',
        'Speed': 'speed'
    };

    if (statProperty.hasOwnProperty(stat)) {
        return card[statProperty[stat]];
    }

    console.error('Invalid stat or card');
    return null;
}

function calculateStatMultiplier(offensiveCard, defensiveCard, stat) {
    if (!offensiveCard || !defensiveCard || !stat) {
        console.error('Missing offensiveCard or defensiveCard or stat');
        return null;
    }
    const statValue = getStatValue(offensiveCard, stat);
    let statMultiplier = 1;
    if (stat === 'Attack' || stat === 'SpecialAttack') {
        statMultiplier = calculateTypeMultiplier(offensiveCard.type, defensiveCard.type);
    } else if (stat === 'Defense' || stat === 'SpecialDefense') {
        statMultiplier = 1 / calculateTypeMultiplier(defensiveCard.type, offensiveCard.type);
    }

    return Number.parseInt(statValue * statMultiplier);
}

function getOpponentStat(selectedStat) {
    const opponentStat = {
        'HP': 'HP',
        'Attack': 'Defense',
        'Defense': 'Attack',
        'SpecialAttack': 'SpecialDefense',
        'SpecialDefense': 'SpecialAttack',
        'Speed': 'Speed'
    };

    return opponentStat[selectedStat] || '';
}


function getHighestStat(card) {
    const allValues = [card.hp, card.attack, card.defense, card.specialAttack, card.specialDefense, card.speed];

    const highestValue = Math.max(...allValues);
    let highestStat = '';

    if (highestValue === card.hp) {
        highestStat = 'HP';
    } else if (highestValue === card.attack) {
        highestStat = 'Attack';
    } else if (highestValue === card.defense) {
        highestStat = 'Defense';
    } else if (highestValue === card.specialAttack) {
        highestStat = 'SpecialAttack';
    } else if (highestValue === card.specialDefense) {
        highestStat = 'SpecialDefense';
    } else if (highestValue === card.speed) {
        highestStat = 'Speed';
    }

    return highestStat;
}