const stats = ['HP', 'Attack', 'Defense', 'Special_Attack', 'Special_Defense', 'Speed'];

function getStatValue(card, stat) {
    if (stat === 'HP') return card.hp;
    if (stat === 'Attack') return card.attack;
    if (stat === 'Defense') return card.defense;
    if (stat === 'Special_Attack') return card.specialAttack;
    if (stat === 'Special_Defense') return card.specialDefense;
    if (stat === 'Speed') return card.speed;

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