
const fs = require("fs");
const path = require("path");

const { evaluateAnswer } = require("./answerEvaluator");

const { checkEvidence } = require("../detectors/evidenceChecker");

const {
    calculateSemanticBaseline
} = require("./semanticEvaluator");

const {
    verifyClaims
} = require("../detectors/claimVerifier");

// ==========================================
// REFERENCE ANSWER AND EVIDENCE
// ==========================================

const referenceAnswer =
    "New Delhi is the capital of India.";

const evidence =
    "New Delhi is the capital of India.";

// ==========================================
// SAMPLE AI MODEL ANSWERS
// ==========================================

const modelAnswers = [
    {
        model: "Model A",
        answer: "New Delhi is the capital of India."
    },
    {
        model: "Model B",
        answer: "Mumbai is the capital of India."
    },
    {
        model: "Model C",
        answer: "The capital city of India is New Delhi."
    }
];

// ==========================================
// OVERALL SCORE CALCULATION
// ==========================================

function calculateOverallScore(
    answerSimilarity,
    semanticBaseline,
    evidenceOverlap,
    claims
) {

    const contradictionCount = claims.filter(
        claim => claim.contradiction
    ).length;

    const insufficientEvidenceCount = claims.filter(
        claim =>
            claim.status === "INSUFFICIENT EVIDENCE"
    ).length;

    let score =
        (answerSimilarity * 0.40) +
        (semanticBaseline * 0.30) +
        (evidenceOverlap * 0.30);

    score -= contradictionCount * 60;
    score -= insufficientEvidenceCount * 10;

    score = Math.max(0, Math.min(100, score));

    return {
        overallScore: Math.round(score * 100) / 100,
        contradictionCount,
        insufficientEvidenceCount
    };
}

// ==========================================
// CREATE REPORTS DIRECTORY
// ==========================================

function getReportsDirectory() {

    const reportsDirectory = path.join(
        __dirname,
        "../../reports"
    );

    fs.mkdirSync(reportsDirectory, {
        recursive: true
    });

    return reportsDirectory;
}

// ==========================================
// SAVE JSON REPORT
// ==========================================

function saveEvaluationReport(results) {

    const reportData = {
        project: "AI Evaluation and Hallucination Detection System",
        generatedAt: new Date().toISOString(),
        totalModelsEvaluated: results.length,

        ranking: results.map(item => ({
            rank: item.rank,
            model: item.model,
            overallScore: item.overallScore,
            contradictions: item.contradictionCount,
            reviewStatus: item.reviewStatus
        })),

        detailedResults: results
    };

    const reportPath = path.join(
        getReportsDirectory(),
        "evaluation-report.json"
    );

    fs.writeFileSync(
        reportPath,
        JSON.stringify(reportData, null, 4),
        "utf8"
    );

    console.log("JSON report saved:", reportPath);

    return reportPath;
}

// ==========================================
// CSV VALUE ESCAPING
// ==========================================

function escapeCsv(value) {

    if (value === null || value === undefined) {
        return "";
    }

    const text = String(value);

    return '"' + text.replace(/"/g, '""') + '"';
}

// ==========================================
// SAVE CSV REPORT
// ==========================================

function saveCsvReport(results) {

    const headers = [
        "Rank",
        "Model",
        "Answer",
        "Answer Similarity",
        "Semantic Baseline",
        "Evidence Overlap",
        "Exact Match",
        "Overall Score",
        "Contradictions",
        "Insufficient Evidence",
        "Review Status"
    ];

    const rows = results.map(item => [

        item.rank,
        item.model,
        item.answer,
        item.answerSimilarity,
        item.semanticBaseline,
        item.evidenceOverlap,
        item.exactMatch,
        item.overallScore,
        item.contradictionCount,
        item.insufficientEvidenceCount,
        item.reviewStatus

    ]);

    const csvContent = [
        headers.map(escapeCsv).join(","),
        ...rows.map(row =>
            row.map(escapeCsv).join(",")
        )
    ].join("\n");

    const csvPath = path.join(
        getReportsDirectory(),
        "evaluation-report.csv"
    );

    fs.writeFileSync(
        csvPath,
        "\uFEFF" + csvContent,
        "utf8"
    );

    console.log("CSV report saved:", csvPath);

    return csvPath;
}

// ==========================================
// MAIN EVALUATION ENGINE
// ==========================================

function runEvaluation() {

    const results = modelAnswers.map(item => {

        const answerResult = evaluateAnswer(
            referenceAnswer,
            item.answer
        );

        const evidenceResult = checkEvidence(
            item.answer,
            evidence
        );

        const semanticResult = calculateSemanticBaseline(
            referenceAnswer,
            item.answer
        );

        const claimResults = verifyClaims(
            item.answer,
            evidence
        );

        const scoreResult = calculateOverallScore(
            answerResult.similarity,
            semanticResult.score,
            evidenceResult.overlapScore,
            claimResults
        );

        // Give contradictions priority in review status.
        let reviewStatus;

        if (scoreResult.contradictionCount > 0) {
            reviewStatus = "CONTRADICTION DETECTED";
        } else if (scoreResult.insufficientEvidenceCount > 0) {
            reviewStatus = "INSUFFICIENT EVIDENCE";
        } else {
            reviewStatus = evidenceResult.result;
        }

        return {
            model: item.model,
            answer: item.answer,

            answerSimilarity: answerResult.similarity,
            semanticBaseline: semanticResult.score,
            evidenceOverlap: evidenceResult.overlapScore,

            exactMatch: answerResult.exactMatch,
            overallScore: scoreResult.overallScore,

            contradictionCount:
                scoreResult.contradictionCount,

            insufficientEvidenceCount:
                scoreResult.insufficientEvidenceCount,

            reviewStatus,
            claims: claimResults
        };
    });

    // ======================================
    // RANK MODELS
    // ======================================

    results.sort(
        (a, b) => b.overallScore - a.overallScore
    );

    results.forEach((item, index) => {
        item.rank = index + 1;
    });

    // ======================================
    // DISPLAY EVALUATION REPORT
    // ======================================

    console.log("\n==================================");
    console.log("       AI EVALUATION REPORT");
    console.log("==================================");

    console.table(
        results.map(({ claims, ...summary }) => summary)
    );

    // ======================================
    // DISPLAY MODEL RANKING
    // ======================================

    console.log("\n==================================");
    console.log("          MODEL RANKING");
    console.log("==================================");

    console.table(
        results.map(item => ({
            rank: item.rank,
            model: item.model,
            overallScore: item.overallScore,
            contradictions: item.contradictionCount,
            reviewStatus: item.reviewStatus
        }))
    );

    // ======================================
    // DISPLAY CLAIM VERIFICATION
    // ======================================

    console.log("\n==================================");
    console.log("   INDIVIDUAL CLAIM VERIFICATION");
    console.log("==================================");

    results.forEach(item => {

        console.log("\nModel:", item.model);

        console.table(item.claims);

    });

    // ======================================
    // GENERATE JSON AND CSV REPORTS
    // ======================================

    console.log("\n==================================");
    console.log("        REPORT GENERATION");
    console.log("==================================");

    saveEvaluationReport(results);
    saveCsvReport(results);

    console.log("\nEvaluation completed successfully!");

    return results;
}

// ==========================================
// EXPORT FUNCTIONS
// ==========================================

module.exports = {
    runEvaluation,
    calculateOverallScore,
    saveEvaluationReport,
    saveCsvReport
};

// ==========================================
// RUN ENGINE WHEN EXECUTED DIRECTLY
// ==========================================

if (require.main === module) {
    runEvaluation();
}
