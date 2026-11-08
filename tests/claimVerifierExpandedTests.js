
const assert = require("assert");

const {
    verifyClaims
} = require("../src/detectors/claimVerifier");

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

// Test 1: Verify a science claim
test("Sun science claim retrieves correct evidence", () => {
    const results = verifyClaims(
        "The Sun is a star at the center of the solar system.",
        ""
    );

    assert.strictEqual(results.length, 1);
    assert.ok(
        results[0].retrievedEvidence.includes(
            "The Sun is a star"
        )
    );
});

// Test 2: Verify an Earth claim
test("Earth science claim retrieves correct evidence", () => {
    const results = verifyClaims(
        "Earth is the third planet from the Sun.",
        ""
    );

    assert.strictEqual(results.length, 1);
    assert.ok(
        results[0].retrievedEvidence.includes(
            "third planet from the Sun"
        )
    );
});

// Test 3: Existing capital contradiction still works
test("Capital-city contradiction is still detected", () => {
    const results = verifyClaims(
        "Mumbai is the capital of India.",
        "New Delhi is the capital of India."
    );

    assert.strictEqual(
        results[0].contradiction,
        true
    );
});

console.log("\nEXPANDED CLAIM VERIFIER TEST REPORT");
console.log("Passed:", passed);
console.log("Failed:", failed);
