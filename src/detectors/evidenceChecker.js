function normalizeWords(text) {
    return text
        .toLowerCase()
        .replace(/[^\w\s]/g, "")
        .trim()
        .split(/\s+/)
        .filter(Boolean);
}

function checkEvidence(claim, evidence) {
    const claimWords = new Set(normalizeWords(claim));
    const evidenceWords = new Set(normalizeWords(evidence));

    const matchingWords = [...claimWords].filter(
        word => evidenceWords.has(word)
    );

    const score = claimWords.size === 0
        ? 0
        : (matchingWords.length / claimWords.size) * 100;

    return {
        overlapScore: Number(score.toFixed(2)),
        matchingWords,
        result: score >= 80
            ? "HIGH TEXTUAL OVERLAP"
            : "NEEDS REVIEW"
    };
}

// Share the function with other JavaScript files
module.exports = { checkEvidence };