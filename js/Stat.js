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
    const statMultiplier = calculateTypeMultiplier(offensiveCard.type, defensiveCard.type);
    return Number.parseInt(statValue * statMultiplier);
}
