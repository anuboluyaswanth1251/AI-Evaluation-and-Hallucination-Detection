
const assert = require("node:assert");

const {
    verifyClaims
} = require("../src/detectors/claimVerifier");

// TEST 1: Correct Indian capital
const test1 = verifyClaims(
    "New Delhi is the capital of India.",
    "New Delhi is the capital of India."
);

assert.strictEqual(
    test1[0].status,
    "HIGH TEXTUAL OVERLAP"
);

console.log("Test 1: Correct Indian capital - PASSED");

// TEST 2: Incorrect Indian capital
const test2 = verifyClaims(
    "Mumbai is the capital of India.",
    "New Delhi is the capital of India."
);

assert.strictEqual(
    test2[0].status,
    "CONTRADICTION DETECTED"
);

console.log("Test 2: Indian capital contradiction - PASSED");

// TEST 3: French capital contradiction
const test3 = verifyClaims(
    "Berlin is the capital of France.",
    "Paris is the capital of France."
);

assert.strictEqual(
    test3[0].status,
    "CONTRADICTION DETECTED"
);

console.log("Test 3: French capital contradiction - PASSED");

// TEST 4: Japanese capital contradiction
const test4 = verifyClaims(
    "Osaka is the capital of Japan.",
    "Tokyo is the capital of Japan."
);

assert.strictEqual(
    test4[0].status,
    "CONTRADICTION DETECTED"
);

console.log("Test 4: Japanese capital contradiction - PASSED");

// TEST 5: Different countries
const test5 = verifyClaims(
    "Berlin is the capital of Germany.",
    "Paris is the capital of France."
);

assert.strictEqual(
    test5[0].contradiction,
    false
);

console.log("Test 5: Different countries - PASSED");

// TEST 6: Insufficient evidence
const test6 = verifyClaims(
    "Quantum computers use superconducting circuits.",
    "New Delhi is the capital of India."
);

assert.strictEqual(
    test6[0].status,
    "INSUFFICIENT EVIDENCE"
);

console.log("Test 6: Insufficient evidence - PASSED");

// TEST 7: Empty answer
const test7 = verifyClaims(
    "",
    "New Delhi is the capital of India."
);

assert.strictEqual(test7.length, 0);

console.log("Test 7: Empty answer - PASSED");

// TEST 8: Invalid input
assert.throws(() => {
    verifyClaims(123, "New Delhi is the capital of India.");
}, TypeError);

console.log("Test 8: Invalid input - PASSED");

console.log("\n====================================");
console.log("ALL 8 CLAIM VERIFIER TESTS PASSED!");
console.log("====================================");
