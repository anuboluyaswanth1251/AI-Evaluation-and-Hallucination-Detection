
const knowledgeBase = require("../knowledge/knowledgeBase");

// Common English words that are not very useful
// for matching factual claims.
const stopWords = new Set([
    "the",
    "is",
    "a",
    "an",
    "of",
    "at",
    "in",
    "on",
    "to",
    "and",
    "for",
    "from",
    "under",
    "above",
    "with",
    "as",
    "it",
    "its"
]);

// Normalize text and remove common words.
function normalizeText(text) {
    return text
        .toLowerCase()
        .replace(/[^\w\s]/g, "")
        .split(/\s+/)
        .filter(word =>
            word.length > 0 && !stopWords.has(word)
        );
}

// Retrieve relevant evidence.
function retrieveEvidence(claim) {

    if (typeof claim !== "string") {
        throw new TypeError(
            "Claim must be a string."
        );
    }

    if (claim.trim().length === 0) {
        return [];
    }

    const claimWords = new Set(
        normalizeText(claim)
    );

    if (claimWords.size === 0) {
        return [];
    }

    const results = knowledgeBase.map(item => {

        const factWords = new Set(
            normalizeText(item.fact)
        );

        const matchingWords = [
            ...claimWords
        ].filter(word => factWords.has(word));

        const score = Math.round(
            matchingWords.length /
            claimWords.size * 100
        );

        return {
            id: item.id,
            category: item.category,
            fact: item.fact,
            matchingWords,
            score
        };

    });

    return results
        .filter(item => item.score > 0)
        .sort((a, b) => b.score - a.score);
}

module.exports = { retrieveEvidence };
