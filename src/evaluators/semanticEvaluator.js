function normalizeMeaning(text) {
    const stopWords = new Set([
        "the", "is", "of", "a", "an", "and"
    ]);

    return text
        .toLowerCase()
        .replace(/['’]s\b/g, "")
        .replace(/[^\w\s]/g, "")
        .trim()
        .split(/\s+/)
        .filter(word => word && !stopWords.has(word));
}

function calculateSemanticBaseline(reference, answer) {
    const referenceWords = new Set(normalizeMeaning(reference));
    const answerWords = new Set(normalizeMeaning(answer));

    const commonWords = [...referenceWords].filter(
        word => answerWords.has(word)
    );

    const allWords = new Set([
        ...referenceWords,
        ...answerWords
    ]);

    const score = allWords.size === 0
        ? 0
        : (commonWords.length / allWords.size) * 100;

    return {
        score: Number(score.toFixed(2)),
        matchingWords: commonWords
    };
}

module.exports = {
    calculateSemanticBaseline
};