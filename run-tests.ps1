
$node = "D:\node.js\node-v26.13.0-win-x64\node.exe"

$tests = @(
    "tests/evaluationTests.js",
    "tests/claimVerifierTests.js",
    "tests/evidenceRetrieverTests.js",
    "tests/evidenceIntegrationTests.js",
    "tests/evidenceRetrieverImprovementTests.js",
    "tests/evaluationEngineTests.js",
    "tests/claimVerifierExpandedTests.js"
)

foreach ($test in $tests) {
    Write-Host "`nRUNNING: $test" -ForegroundColor Cyan

    & $node $test

    if ($LASTEXITCODE -ne 0) {
        Write-Host "TEST FAILED. Stop here." -ForegroundColor Red
        exit 1
    }
}

Write-Host "`nALL SEVEN TEST FILES PASSED!" -ForegroundColor Green
