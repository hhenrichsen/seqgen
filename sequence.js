const filterOptions = {
    countgt: function(options) {
        const { outcome, number } = options;
        return function(sequence) {
            return sequence.reduce((acc, it) => acc + (it === outcome ? 1 : 0), 0) > number
        }
    },
    countlt: function(options) {
        const { outcome, number } = options;
        return function(sequence) {
            return sequence.reduce((acc, it) => acc + (it === outcome ? 1 : 0), 0) < number
        }
    },
    counteq: function(options) {
        const { outcome, number } = options;
        return function(sequence) {
            return sequence.reduce((acc, it) => acc + (it === outcome ? 1 : 0), 0) == number
        }
    }
}

export function outcomesFromString(str) {
    return str.split(/,(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/).map(it => it.trim());
}

export function changeBase(number, newBase) {
    if (isNaN(number) || number <= 0) {
        return [0];
    }
    let digits = [];
    while (number > 0) {
        digits.unshift(number % newBase);
        number = ~~(number / newBase);
    }
    return digits;
}

export function fillList(list, number, target) {
    const listCopy = [...list];
    while(listCopy.length < target) {
        listCopy.unshift(number);
    }
    return listCopy;
}

export function getIndices(outcomeCount, length, i) {
    return fillList(changeBase(i, outcomeCount), 0, length);
}

export function generate(customOptions) {
    const options = Object.assign({ outcomeCount: customOptions.outcomes.length }, customOptions);
    const { length, outcomeCount, outcomes } = options;
    let sequences = [];
    for (let i = 0; i < Math.pow(outcomeCount, length); i++) {
        let sequence = [];
        const indices = getIndices(outcomeCount, length, i);
        for (const index of indices) {
            sequence.push(outcomes[index]);
        }
        sequences.push(sequence);
    }
    return sequences;
}

export function parseFilters(filters) {
    let results = [];
    for (const filter of filters) {
        const type = filter.type.toLowerCase();
        results.push(filterOptions[type](filter));
    }
    return results;
}

export function applyFilters(sequences, filters) {
    return sequences.filter(it => filters.every(filter => filter(it)));
}

