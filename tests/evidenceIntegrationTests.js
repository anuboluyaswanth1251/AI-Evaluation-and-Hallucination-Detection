
const assert = require("node:assert");

const {
    verifyClaims
} = require("../src/detectors/claimVerifier");

// TEST 1: Retrieve Indian capital evidence

const test1 = verifyClaims(
    "Mumbai is the capital of India.",
    "General evidence is not available."
);

assert.strictEqual(
    test1[0].retrievedEvidence,
    "New Delhi is the capital of India."
);

console.log("Test 1: Correct evidence retrieved - PASSED");

// TEST 2: Detect contradiction using retrieved evidence

assert.strictEqual(
    test1[0].contradiction,
    true
);

assert.strictEqual(
    test1[0].status,
    "CONTRADICTION DETECTED"
);

console.log("Test 2: Retrieved evidence contradiction - PASSED");

// TEST 3: Retrieve French capital evidence

const test3 = verifyClaims(
    "Paris is the capital of France.",
    "General evidence is not available."
);

assert.strictEqual(
    test3[0].retrievedEvidence,
    "Paris is the capital of France."
);

console.log("Test 3: French evidence retrieval - PASSED");

// TEST 4: Retrieve science evidence

const test4 = verifyClaims(
    "Water freezes at 0 degrees Celsius.",
    "General evidence is not available."
);

assert.ok(
    test4[0].retrievedEvidence.includes("Water freezes")
);

console.log("Test 4: Science evidence retrieval - PASSED");

// FINAL REPORT

console.log("\n====================================");
console.log("ALL 4 INTEGRATION TESTS PASSED!");
console.log("====================================");
