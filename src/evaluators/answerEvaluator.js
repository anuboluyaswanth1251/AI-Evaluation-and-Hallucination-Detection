function normalizeWords(text) {
    return text
        .toLowerCase()
        .replace(/[^\w\s]/g, "")
        .trim()
        .split(/\s+/)
        .filter(Boolean);
}

function evaluateAnswer(referenceAnswer, aiAnswer) {
    const referenceWords = new Set(normalizeWords(referenceAnswer));
    const aiWords = new Set(normalizeWords(aiAnswer));

    const commonWords = [...referenceWords].filter(
        word => aiWords.has(word)
    );

    const totalWords = new Set([
        ...referenceWords,
        ...aiWords
    ]);

    const similarity = totalWords.size === 0
        ? 0
        : (commonWords.length / totalWords.size) * 100;

    return {
        similarity: Number(similarity.toFixed(2)),
        exactMatch: referenceWords.size === aiWords.size &&
            [...referenceWords].every(word => aiWords.has(word)),
        commonWords
    };
}

// Share the function with other JavaScript files
module.exports = { evaluateAnswer };