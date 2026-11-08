
const {
    calculateOverallScore
} = require("../src/evaluators/evaluationEngine");

let passed = 0;
let failed = 0;

function test(name, callback) {

    try {
        callback();
        console.log("PASSED:", name);
        passed++;
    } catch (error) {
        console.log("FAILED:", name);
        console.log(error.message);
        failed++;
    }
}

// Test 1: Perfect evaluation score
test("Perfect answer receives 100", () => {

    const result = calculateOverallScore(
        100,
        100,
        100,
        []
    );

    if (result.overallScore !== 100) {
        throw new Error("Expected score 100");
    }
});

// Test 2: Contradiction penalty
test("Contradiction reduces overall score", () => {

    const claims = [
        {
            contradiction: true,
            status: "CONTRADICTION DETECTED"
        }
    ];

    const result = calculateOverallScore(
        100,
        100,
        100,
        claims
    );

    if (result.overallScore !== 40) {
        throw new Error("Expected score 40");
    }

    if (result.contradictionCount !== 1) {
        throw new Error("Expected one contradiction");
    }
});

// Test 3: Insufficient evidence penalty
test("Insufficient evidence reduces score", () => {

    const claims = [
        {
            contradiction: false,
            status: "INSUFFICIENT EVIDENCE"
        }
    ];

    const result = calculateOverallScore(
        100,
        100,
        100,
        claims
    );

    if (result.overallScore !== 90) {
        throw new Error("Expected score 90");
    }
});

// Test 4: Score cannot exceed 100
test("Score maximum is 100", () => {

    const result = calculateOverallScore(
        150,
        150,
        150,
        []
    );

    if (result.overallScore !== 100) {
        throw new Error("Score exceeded 100");
    }
});

// Test 5: Score cannot fall below zero
test("Score minimum is zero", () => {

    const claims = [
        { contradiction: true },
        { contradiction: true }
    ];

    const result = calculateOverallScore(
        0,
        0,
        0,
        claims
    );

    if (result.overallScore !== 0) {
        throw new Error("Score went below zero");
    }
});

// Final test report
console.log("\n==================================");
console.log("EVALUATION ENGINE TEST REPORT");
console.log("==================================");

console.log("Passed:", passed);
console.log("Failed:", failed);

if (failed === 0) {
    console.log("\nALL EVALUATION ENGINE TESTS PASSED!");
} else {
    console.log("\nSOME TESTS FAILED!");
    process.exitCode = 1;
}
