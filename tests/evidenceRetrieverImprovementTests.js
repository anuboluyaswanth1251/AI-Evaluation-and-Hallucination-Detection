
const assert = require("assert");

const {
    retrieveEvidence
} = require("../src/detectors/evidenceRetriever");

let passed = 0;
let failed = 0;

function test(name, testFunction) {
    try {
        testFunction();
        console.log("PASSED:", name);
        passed++;
    } catch (error) {
        console.log("FAILED:", name);
        console.log(error.message);
        failed++;
    }
}

// Test 1: Relevant fact ranks first
test("Relevant Sun fact ranks first", () => {
    const results = retrieveEvidence(
        "The Sun is a star at the center of the solar system."
    );

    assert.strictEqual(results[0].id, 6);
    assert.strictEqual(results[0].score, 100);
});

// Test 2: Common words are ignored
test("Common words do not create false matches", () => {
    const results = retrieveEvidence(
        "The Sun is a star at the center of the solar system."
    );

    const unrelatedCapitalFacts = results.filter(
        item => item.category === "Geography" &&
                item.fact.includes("capital")
    );

    assert.strictEqual(unrelatedCapitalFacts.length, 0);
});

// Test 3: Unrelated claim returns no results
test("Unrelated claim returns no evidence", () => {
    const results = retrieveEvidence(
        "Quantum computers use qubits."
    );

    assert.strictEqual(results.length, 0);
});

// Test 4: Empty claim returns no results
test("Empty claim returns no evidence", () => {
    const results = retrieveEvidence("");

    assert.strictEqual(results.length, 0);
});

// Test 5: Invalid input is rejected
test("Invalid input throws TypeError", () => {
    assert.throws(
        () => retrieveEvidence(123),
        TypeError
    );
});

console.log("\nEVIDENCE RETRIEVER IMPROVEMENT TEST REPORT");
console.log("Passed:", passed);
console.log("Failed:", failed);

