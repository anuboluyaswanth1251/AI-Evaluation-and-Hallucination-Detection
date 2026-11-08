
const assert = require("node:assert");

const {
    retrieveEvidence
} = require("../src/detectors/evidenceRetriever");

// TEST 1: Retrieve Indian capital evidence

const test1 = retrieveEvidence(
    "New Delhi is the capital of India."
);

assert.ok(test1.length > 0);

assert.strictEqual(
    test1[0].fact,
    "New Delhi is the capital of India."
);

console.log("Test 1: Indian evidence retrieval - PASSED");

// TEST 2: Retrieve French capital evidence

const test2 = retrieveEvidence(
    "Paris is the capital of France."
);

assert.ok(test2.length > 0);

assert.strictEqual(
    test2[0].fact,
    "Paris is the capital of France."
);

console.log("Test 2: French evidence retrieval - PASSED");

// TEST 3: Retrieve science evidence

const test3 = retrieveEvidence(
    "Water freezes at 0 degrees Celsius."
);

assert.ok(test3.length > 0);

assert.strictEqual(
    test3[0].category,
    "Science"
);

console.log("Test 3: Science evidence retrieval - PASSED");

// TEST 4: Empty input

const test4 = retrieveEvidence("");

assert.strictEqual(test4.length, 0);

console.log("Test 4: Empty input - PASSED");

// TEST 5: Invalid input

assert.throws(() => {
    retrieveEvidence(123);
}, TypeError);

console.log("Test 5: Invalid input - PASSED");

// FINAL REPORT

console.log("\n==================================");
console.log("ALL 5 EVIDENCE RETRIEVER TESTS PASSED!");
console.log("==================================");
