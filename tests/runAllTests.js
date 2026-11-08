
const { execFileSync } = require("child_process");
const path = require("path");

const testFiles = [
    "evaluationTests.js",
    "claimVerifierTests.js",
    "evidenceRetrieverTests.js",
    "evidenceIntegrationTests.js",
    "evidenceRetrieverImprovementTests.js",
    "evaluationEngineTests.js",
    "claimVerifierExpandedTests.js"
];

console.log("\nAI EVALUATION PROJECT");
console.log("COMPLETE TEST RUNNER");
console.log("========================\n");

let passed = 0;

for (const file of testFiles) {
    console.log("\nRunning:", file);
    console.log("------------------------");

    try {
        execFileSync(
            process.execPath,
            [path.join(__dirname, file)],
            { stdio: "inherit" }
        );

        passed++;
    } catch (error) {
        console.log("\nFAILED:", file);
        process.exitCode = 1;
        break;
    }
}

console.log("\n========================");
console.log("TEST RUNNER SUMMARY");
console.log("Total test files:", testFiles.length);
console.log("Passed test files:", passed);
console.log("Failed test files:", testFiles.length - passed);
console.log("========================");
