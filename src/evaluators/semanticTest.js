const {
    calculateSemanticBaseline
} = require("./semanticEvaluator");

const reference = "New Delhi is the capital of India.";

const aiAnswer = "India's capital city is New Delhi.";

const result = calculateSemanticBaseline(
    reference,
    aiAnswer
);

console.log("SEMANTIC EVALUATION TEST");
console.log("-----------------------");

console.log("Reference:", reference);
console.log("AI Answer:", aiAnswer);

console.log("Similarity:", result.score + "%");

console.log("Matching Words:", result.matchingWords);
