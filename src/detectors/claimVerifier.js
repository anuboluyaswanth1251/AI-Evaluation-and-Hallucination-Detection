
const {
    retrieveEvidence
} = require("./evidenceRetriever");

function normalizeWords(text) {
    return text
        .toLowerCase()
        .split(/\W+/)
        .filter(word => word.length > 0);
}

// Extract capital-city facts
function extractCapitalFact(text) {

    const normalized = text
        .toLowerCase()
        .replace(/[.!?]/g, "")
        .trim();

    const match = normalized.match(
        /^(.+?)\s+is\s+the\s+capital\s+of\s+(.+)$/
    );

    if (!match) {
        return null;
    }

    return {
        city: match[1].trim(),
        country: match[2].trim()
    };
}

// Detect capital-city contradictions
function detectContradiction(claim, evidence) {

    const claimFact = extractCapitalFact(claim);
    const evidenceFact = extractCapitalFact(evidence);

    if (!claimFact || !evidenceFact) {
        return false;
    }

    if (claimFact.country !== evidenceFact.country) {
        return false;
    }

    return claimFact.city !== evidenceFact.city;
}

// Verify individual claims
function verifyClaims(answer, evidence) {

    if (
        typeof answer !== "string" ||
        typeof evidence !== "string"
    ) {
        throw new TypeError(
            "Answer and evidence must be strings."
        );
    }

    const claims = answer
        .split(/[.!?]+/)
        .map(claim => claim.trim())
        .filter(claim => claim.length > 0);

    return claims.map(claim => {

        // Search the Knowledge Base
        const retrievedResults = retrieveEvidence(claim);

        // Select the highest-scoring reference fact
        const selectedEvidence = retrievedResults.length > 0
            ? retrievedResults[0].fact
            : evidence;

        const claimWords = [
            ...new Set(normalizeWords(claim))
        ];

        const evidenceWords = new Set(
            normalizeWords(selectedEvidence)
        );

        const matchingWords = claimWords.filter(
            word => evidenceWords.has(word)
        );

        const overlapScore = claimWords.length === 0
            ? 0
            : Math.round(
                matchingWords.length /
                claimWords.length * 100
            );

        const contradiction = detectContradiction(
            claim,
            selectedEvidence
        );

        let status;

        if (contradiction) {
            status = "CONTRADICTION DETECTED";
        } else if (overlapScore >= 80) {
            status = "HIGH TEXTUAL OVERLAP";
        } else {
            status = "INSUFFICIENT EVIDENCE";
        }

        return {
            claim,
            retrievedEvidence: selectedEvidence,
            overlapScore,
            matchingWords,
            contradiction,
            status
        };
    });
}

module.exports = {
    verifyClaims,
    detectContradiction
};
