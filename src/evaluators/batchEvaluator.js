function normalizeText(text) {
    return text
        .toLowerCase()
        .replace(/[^\w\s]/g, "")
        .trim();
}

// Calculate Jaccard similarity
function calculateSimilarity(reference, answer) {
    const referenceWords = new Set(
        normalizeText(reference).split(/\s+/)
    );

    const answerWords = new Set(
        normalizeText(answer).split(/\s+/)
    );

    const commonWords = [...referenceWords].filter(
        word => answerWords.has(word)
    );

    const totalWords = new Set([
        ...referenceWords,
        ...answerWords
    ]);

    if (totalWords.size === 0) {
        return 0;
    }

    return Number(
        (commonWords.length / totalWords.size * 100).toFixed(2)
    );
}

// Reference answer
const referenceAnswer = "New Delhi is the capital of India.";

// Answers from different AI models
const modelAnswers = [
    {
        model: "Model A",
        answer: "New Delhi is the capital of India."
    },
    {
        model: "Model B",
        answer: "New Delhi  is the capital of India and major city."
    },
    {
        model: "Model C",
        answer: "The capital city of India is New Delhi."
    }
];

// Evaluate all model answers
const results = modelAnswers.map(item => {
    return {
        model: item.model,
        similarity: calculateSimilarity(
            referenceAnswer,
            item.answer
        ),
        answer: item.answer
    };
});

// Sort by similarity
results.sort((a, b) => b.similarity - a.similarity);

// Display results
console.log("\nAI MODEL COMPARISON");
console.log("===================");

results.forEach((result, index) => {
    console.log(`\nRank: ${index + 1}`);
    console.log(`Model: ${result.model}`);
    console.log(`Similarity: ${result.similarity}%`);
    console.log(`Answer: ${result.answer}`);
});