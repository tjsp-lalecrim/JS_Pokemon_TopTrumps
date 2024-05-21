const typeChart = {
    'Normal': { 'Normal': 1.0, 'Fire': 1.0, 'Water': 1.0, 'Grass': 1.0, 'Electric': 1.0, 'Ice': 1.0, 'Fighting': 1.0, 'Poison': 1.0, 'Ground': 1.0, 'Flying': 1.0, 'Psychic': 1.0, 'Bug': 1.0, 'Rock': 1.0, 'Ghost': 0.0, 'Dragon': 1.0, 'Dark': 1.0, 'Steel': 1.0, 'Fairy': 1.0 },
    'Fire': { 'Normal': 1.0, 'Fire': 0.5, 'Water': 0.5, 'Grass': 2.0, 'Electric': 1.0, 'Ice': 2.0, 'Fighting': 1.0, 'Poison': 1.0, 'Ground': 1.0, 'Flying': 1.0, 'Psychic': 1.0, 'Bug': 0.5, 'Rock': 2.0, 'Ghost': 1.0, 'Dragon': 1.0, 'Dark': 1.0, 'Steel': 0.5, 'Fairy': 1.0 },
    'Water': { 'Normal': 1.0, 'Fire': 2.0, 'Water': 0.5, 'Grass': 0.5, 'Electric': 1.0, 'Ice': 1.0, 'Fighting': 1.0, 'Poison': 1.0, 'Ground': 2.0, 'Flying': 1.0, 'Psychic': 1.0, 'Bug': 1.0, 'Rock': 1.0, 'Ghost': 1.0, 'Dragon': 1.0, 'Dark': 1.0, 'Steel': 0.5, 'Fairy': 1.0 },
    'Grass': { 'Normal': 1.0, 'Fire': 0.5, 'Water': 2.0, 'Grass': 0.5, 'Electric': 1.0, 'Ice': 1.0, 'Fighting': 1.0, 'Poison': 0.5, 'Ground': 2.0, 'Flying': 0.5, 'Psychic': 1.0, 'Bug': 0.5, 'Rock': 2.0, 'Ghost': 1.0, 'Dragon': 1.0, 'Dark': 1.0, 'Steel': 0.5, 'Fairy': 1.0 },
    'Electric': { 'Normal': 1.0, 'Fire': 1.0, 'Water': 2.0, 'Grass': 0.5, 'Electric': 0.5, 'Ice': 1.0, 'Fighting': 1.0, 'Poison': 1.0, 'Ground': 0.0, 'Flying': 2.0, 'Psychic': 1.0, 'Bug': 1.0, 'Rock': 1.0, 'Ghost': 1.0, 'Dragon': 1.0, 'Dark': 1.0, 'Steel': 1.0, 'Fairy': 1.0 },
    'Ice': { 'Normal': 1.0, 'Fire': 0.5, 'Water': 0.5, 'Grass': 2.0, 'Electric': 1.0, 'Ice': 0.5, 'Fighting': 1.0, 'Poison': 1.0, 'Ground': 2.0, 'Flying': 2.0, 'Psychic': 1.0, 'Bug': 1.0, 'Rock': 1.0, 'Ghost': 1.0, 'Dragon': 2.0, 'Dark': 1.0, 'Steel': 0.5, 'Fairy': 1.0 },
    'Fighting': { 'Normal': 1.0, 'Fire': 1.0, 'Water': 1.0, 'Grass': 1.0, 'Electric': 1.0, 'Ice': 1.0, 'Fighting': 1.0, 'Poison': 1.0, 'Ground': 1.0, 'Flying': 1.0, 'Psychic': 2.0, 'Bug': 0.5, 'Rock': 2.0, 'Ghost': 0.0, 'Dragon': 1.0, 'Dark': 0.5, 'Steel': 1.0, 'Fairy': 2.0 },
    'Poison': { 'Normal': 1.0, 'Fire': 1.0, 'Water': 1.0, 'Grass': 2.0, 'Electric': 1.0, 'Ice': 1.0, 'Fighting': 1.0, 'Poison': 0.5, 'Ground': 0.5, 'Flying': 1.0, 'Psychic': 1.0, 'Bug': 1.0, 'Rock': 1.0, 'Ghost': 0.5, 'Dragon': 1.0, 'Dark': 1.0, 'Steel': 0.0, 'Fairy': 2.0 },
    'Ground': { 'Normal': 1.0, 'Fire': 1.0, 'Water': 2.0, 'Grass': 0.5, 'Electric': 2.0, 'Ice': 1.0, 'Fighting': 1.0, 'Poison': 2.0, 'Ground': 1.0, 'Flying': 0.0, 'Psychic': 1.0, 'Bug': 0.5, 'Rock': 2.0, 'Ghost': 1.0, 'Dragon': 1.0, 'Dark': 1.0, 'Steel': 2.0, 'Fairy': 1.0 },
    'Flying': { 'Normal': 1.0, 'Fire': 1.0, 'Water': 1.0, 'Grass': 2.0, 'Electric': 0.5, 'Ice': 1.0, 'Fighting': 2.0, 'Poison': 1.0, 'Ground': 1.0, 'Flying': 1.0, 'Psychic': 1.0, 'Bug': 2.0, 'Rock': 0.5, 'Ghost': 1.0, 'Dragon': 1.0, 'Dark': 1.0, 'Steel': 0.5, 'Fairy': 1.0 },
    'Psychic': { 'Normal': 1.0, 'Fire': 1.0, 'Water': 1.0, 'Grass': 1.0, 'Electric': 1.0, 'Ice': 1.0, 'Fighting': 0.5, 'Poison': 1.0, 'Ground': 1.0, 'Flying': 1.0, 'Psychic': 0.5, 'Bug': 2.0, 'Rock': 1.0, 'Ghost': 2.0, 'Dragon': 1.0, 'Dark': 2.0, 'Steel': 1.0, 'Fairy': 1.0 },
    'Bug': { 'Normal': 1.0, 'Fire': 2.0, 'Water': 1.0, 'Grass': 0.5, 'Electric': 1.0, 'Ice': 1.0, 'Fighting': 0.5, 'Poison': 0.5, 'Ground': 1.0, 'Flying': 0.5, 'Psychic': 1.0, 'Bug': 1.0, 'Rock': 1.0, 'Ghost': 0.5, 'Dragon': 1.0, 'Dark': 2.0, 'Steel': 0.5, 'Fairy': 0.5 },
    'Rock': { 'Normal': 1.0, 'Fire': 0.5, 'Water': 2.0, 'Grass': 2.0, 'Electric': 1.0, 'Ice': 2.0, 'Fighting': 1.0, 'Poison': 1.0, 'Ground': 0.5, 'Flying': 2.0, 'Psychic': 1.0, 'Bug': 2.0, 'Rock': 1.0, 'Ghost': 1.0, 'Dragon': 1.0, 'Dark': 1.0, 'Steel': 0.5, 'Fairy': 1.0 },
    'Ghost': { 'Normal': 0.0, 'Fire': 1.0, 'Water': 1.0, 'Grass': 1.0, 'Electric': 1.0, 'Ice': 1.0, 'Fighting': 0.0, 'Poison': 0.5, 'Ground': 1.0, 'Flying': 1.0, 'Psychic': 2.0, 'Bug': 0.5, 'Rock': 1.0, 'Ghost': 2.0, 'Dragon': 1.0, 'Dark': 1.0, 'Steel': 1.0, 'Fairy': 1.0 },
    'Dragon': { 'Normal': 1.0, 'Fire': 1.0, 'Water': 1.0, 'Grass': 1.0, 'Electric': 1.0, 'Ice': 1.0, 'Fighting': 1.0, 'Poison': 1.0, 'Ground': 1.0, 'Flying': 1.0, 'Psychic': 1.0, 'Bug': 1.0, 'Rock': 1.0, 'Ghost': 1.0, 'Dragon': 2.0, 'Dark': 1.0, 'Steel': 0.5, 'Fairy': 0.0 },
    'Dark': { 'Normal': 1.0, 'Fire': 1.0, 'Water': 1.0, 'Grass': 1.0, 'Electric': 1.0, 'Ice': 1.0, 'Fighting': 2.0, 'Poison': 1.0, 'Ground': 1.0, 'Flying': 1.0, 'Psychic': 0.0, 'Bug': 1.0, 'Rock': 1.0, 'Ghost': 0.5, 'Dragon': 1.0, 'Dark': 0.5, 'Steel': 1.0, 'Fairy': 2.0 },
    'Steel': { 'Normal': 1.0, 'Fire': 0.5, 'Water': 0.5, 'Grass': 1.0, 'Electric': 1.0, 'Ice': 2.0, 'Fighting': 1.0, 'Poison': 1.0, 'Ground': 1.0, 'Flying': 1.0, 'Psychic': 1.0, 'Bug': 1.0, 'Rock': 2.0, 'Ghost': 1.0, 'Dragon': 1.0, 'Dark': 1.0, 'Steel': 0.5, 'Fairy': 0.5 },
    'Fairy': { 'Normal': 1.0, 'Fire': 0.5, 'Water': 1.0, 'Grass': 1.0, 'Electric': 1.0, 'Ice': 1.0, 'Fighting': 0.5, 'Poison': 2.0, 'Ground': 1.0, 'Flying': 1.0, 'Psychic': 1.0, 'Bug': 1.0, 'Rock': 1.0, 'Ghost': 1.0, 'Dragon': 2.0, 'Dark': 0.5, 'Steel': 2.0, 'Fairy': 1.0 },
};

function calculateTypeMultiplier(offensiveType, defensiveType) {
    if (!offensiveType || !defensiveType) {
        const missingType = !offensiveType ? 'offensiveType' : 'defensiveType';
        console.error(`Missing ${missingType}`);
        return 1;
    }

    const multiplier = typeChart[offensiveType]?.[defensiveType] || 1;
    return multiplier;
}


function getHintByType(type) {
    const hintChart = {
        'Normal': ['Normal', 'Flying', 'Fairy'],
        'Fire': ['Fire', 'Dragon'],
        'Water': ['Water', 'Ice'],
        'Grass': ['Grass', 'Bug', 'Poison'],
        'Electric': ['Electric', 'Steel'],
        'Ice': ['Water', 'Ice'],
        'Fighting': ['Fighting', 'Ground', 'Rock'],
        'Poison': ['Grass', 'Bug', 'Poison'],
        'Ground': ['Fighting', 'Ground', 'Rock'],
        'Flying': ['Normal', 'Flying', 'Fairy'],
        'Psychic': ['Psychic', 'Ghost', 'Dark'],
        'Bug': ['Grass', 'Bug', 'Poison'],
        'Rock': ['Fighting', 'Ground', 'Rock'],
        'Ghost': ['Psychic', 'Ghost', 'Dark'],
        'Dragon': ['Fire', 'Dragon'],
        'Dark': ['Psychic', 'Ghost', 'Dark'],
        'Steel': ['Electric', 'Steel'],
        'Fairy': ['Normal', 'Flying', 'Fairy'],
    };

    return hintChart[type] || [];
}

function writeTypeChartTable(typeChart) {
    const table = document.getElementById('type-chart');
    const types = Object.keys(typeChart);
    
    let html = '<tr><th></th>'; // Header row
    
    // Create header row
    types.forEach(type => {
        html += `<th>${type}</th>`;
    });
    html += '</tr>';
    
    // Create data rows
    types.forEach(type1 => {
        html += `<tr><td>${type1}</td>`;
        types.forEach(type2 => {
            html += `<td>${typeChart[type1][type2]}</td>`;
        });
        html += '</tr>';
    });
    
    table.innerHTML = html;
}

writeTypeChartTable(typeChart);