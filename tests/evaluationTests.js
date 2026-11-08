const assert = require("node:assert/strict");

const {
    evaluateAnswer
} = require("../src/evaluators/answerEvaluator");

const {
    checkEvidence
} = require("../src/detectors/evidenceChecker");

const {
    calculateSemanticBaseline
} = require("../src/evaluators/semanticEvaluator");

console.log("\nAI EVALUATION SYSTEM - AUTOMATED TESTS");
console.log("======================================");

// TEST 1: Exact answer matching
const answerTest = evaluateAnswer(
    "New Delhi is the capital of India.",
    "New Delhi is the capital of India."
);

assert.equal(answerTest.similarity, 100);
assert.equal(answerTest.exactMatch, true);

console.log("TEST 1 PASSED: Answer evaluator");

// TEST 2: Evidence matching
const evidenceTest = checkEvidence(
    "New Delhi is the capital of India.",
    "New Delhi is the capital of India."
);

assert.equal(evidenceTest.overlapScore, 100);
assert.equal(evidenceTest.result, "HIGH TEXTUAL OVERLAP");

console.log("TEST 2 PASSED: Evidence checker");

// TEST 3: Unsupported answer
const unsupportedTest = checkEvidence(
    "Quantum computers use superconducting circuits.",
    "New Delhi is the capital of India."
);

assert.equal(unsupportedTest.overlapScore, 0);
assert.equal(unsupportedTest.result, "NEEDS REVIEW");

console.log("TEST 3 PASSED: Unsupported answer review");

// TEST 4: Semantic baseline
const semanticTest = calculateSemanticBaseline(
    "New Delhi is the capital of India.",
    "India's capital city is New Delhi."
);

assert.equal(semanticTest.score, 80);

console.log("TEST 4 PASSED: Semantic baseline");

// Final result
console.log("\nALL 4 TESTS PASSED SUCCESSFULLY!");