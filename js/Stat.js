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
    const requiredParams = [offensiveCard, defensiveCard, stat];
    if (requiredParams.some(param => !param)) {
        console.error('Missing offensiveCard, defensiveCard, or stat');
        return null;
    }

    const statValue = getStatValue(offensiveCard, stat);

    if (statValue === null || statValue === undefined) {
        console.error('Invalid stat value');
        return null;
    }

    const statMultiplier = ['Attack', 'SpecialAttack'].includes(stat)
        ? calculateTypeMultiplier(offensiveCard.type, defensiveCard.type)
        : 1;

    const boostedStat = statValue * statMultiplier;
    return Math.trunc(boostedStat);
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
    const stats = {
        hp: 'HP',
        attack: 'Attack',
        defense: 'Defense',
        specialAttack: 'SpecialAttack',
        specialDefense: 'SpecialDefense',
        speed: 'Speed'
    };

    let highestStat = '';
    let highestValue = -Infinity;

    for (const [stat, value] of Object.entries(card)) {
        if (value > highestValue) {
            highestValue = value;
            highestStat = stats[stat];
        }
    }

    return highestStat;
}
