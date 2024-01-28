const stats = ['HP', 'Attack', 'Defense', 'Special_Attack', 'Special_Defense', 'Speed'];

function getStatValue(card, stat) {
    const statProperty = {
        'HP': 'hp',
        'Attack': 'attack',
        'Defense': 'defense',
        'Special_Attack': 'specialAttack',
        'Special_Defense': 'specialDefense',
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
    if (stat === 'Attack' || stat === 'Special_Attack') {
        statMultiplier = calculateTypeMultiplier(offensiveCard.type, defensiveCard.type);
    } else if (stat === 'Defense' || stat === 'Special_Defense') {
        statMultiplier = 1/calculateTypeMultiplier(defensiveCard.type, offensiveCard.type);
    }

    return Number.parseInt(statValue * statMultiplier);
}

function getOpponentStat(selectedStat) {
    const opponentStat = {
        'HP': 'HP',
        'Attack': 'Defense',
        'Defense': 'Attack',
        'Special_Attack': 'Special_Defense',
        'Special_Defense': 'Special_Attack',
        'Speed': 'Speed'
    };

    return opponentStat[selectedStat] || '';
}
