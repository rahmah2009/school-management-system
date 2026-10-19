
import { useCallback, useEffect, useMemo, useState } from "react";

import ResultRecordingSheet from "../../components/results/ResultRecordingSheet";
import ResultApprovalPanel from "../../components/results/ResultApprovalPanel";
import StudentReportCard from "../../components/results/StudentReportCard";
import StatCard from "../../components/common/StatCard";

const RESULTS_KEY = "greenfield_school_results";
const SETTINGS_KEY = "greenfield_school_settings";

const DEFAULT_GRADING_SCALE = [
    { grade: "A", minScore: 70, remark: "Excellent" },
    { grade: "B", minScore: 60, remark: "Very Good" },
    { grade: "C", minScore: 50, remark: "Good" },
    { grade: "D", minScore: 45, remark: "Fair" },
    { grade: "E", minScore: 40, remark: "Pass" },
    { grade: "F", minScore: 0, remark: "Fail" },
];

function getSavedResults() {
    try {
        const data = localStorage.getItem(RESULTS_KEY);
        const parsed = data ? JSON.parse(data) : [];

        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        console.error("Could not read saved results:", error);
        return [];
    }
}

function getSavedGradingScale() {
    try {
        const data = localStorage.getItem(SETTINGS_KEY);

        if (!data) {
            return DEFAULT_GRADING_SCALE.map((item) => ({ ...item }));
        }

        const settings = JSON.parse(data);
        const scale = settings?.gradingScale;

        if (
            !Array.isArray(scale) ||
            scale.length !== DEFAULT_GRADING_SCALE.length
        ) {
            return DEFAULT_GRADING_SCALE.map((item) => ({ ...item }));
        }

        const validScale = scale.every(
            (item, index) =>
                item?.grade === DEFAULT_GRADING_SCALE[index].grade &&
                Number.isFinite(Number(item.minScore)) &&
                Number(item.minScore) >= 0 &&
                Number(item.minScore) <= 100 &&
                typeof item.remark === "string" &&
                item.remark.trim() !== "" &&
                (index === 0 ||
                    Number(item.minScore) <
                        Number(scale[index - 1].minScore))
        );

        if (!validScale || Number(scale[5].minScore) !== 0) {
            return DEFAULT_GRADING_SCALE.map((item) => ({ ...item }));
        }

        return scale.map((item) => ({
            grade: item.grade,
            minScore: Number(item.minScore),
            remark: item.remark.trim(),
        }));
    } catch (error) {
        console.error("Could not read grading settings:", error);

        return DEFAULT_GRADING_SCALE.map((item) => ({ ...item }));
    }
}

function normalizeStatus(status) {
    return String(status || "draft").trim().toLowerCase();
}

function getValidScore(subject) {
    if (!subject || typeof subject !== "object") {
        return null;
    }

    if (
        subject.ca === "" ||
        subject.ca === undefined ||
        subject.ca === null ||
        subject.exam === "" ||
        subject.exam === undefined ||
        subject.exam === null
    ) {
        return null;
    }

    const ca = Number(subject.ca);
    const exam = Number(subject.exam);

    if (
        !Number.isFinite(ca) ||
        !Number.isFinite(exam) ||
        ca < 0 ||
        ca > 20 ||
        exam < 0 ||
        exam > 80
    ) {
        return null;
    }

    return ca + exam;
}

function Results() {
    const [savedResults, setSavedResults] = useState(getSavedResults);
    const [gradingScale, setGradingScale] = useState(getSavedGradingScale);
    const [storageError, setStorageError] = useState("");

    const refreshResults = useCallback(() => {
        setSavedResults(getSavedResults());
        setGradingScale(getSavedGradingScale());
        setStorageError("");
    }, []);

    useEffect(() => {
        refreshResults();

        window.addEventListener("focus", refreshResults);
        window.addEventListener("storage", refreshResults);

        window.addEventListener(
            "greenfield-results-updated",
            refreshResults
        );

        window.addEventListener(
            "greenfield-settings-updated",
            refreshResults
        );

        return () => {
            window.removeEventListener("focus", refreshResults);
            window.removeEventListener("storage", refreshResults);

            window.removeEventListener(
                "greenfield-results-updated",
                refreshResults
            );

            window.removeEventListener(
                "greenfield-settings-updated",
                refreshResults
            );
        };
    }, [refreshResults]);

    const statistics = useMemo(() => {
        const allScores = savedResults.flatMap((result) =>
            Object.values(result.marks || {})
                .map(getValidScore)
                .filter((score) => score !== null)
        );

        const totalScore = allScores.reduce(
            (sum, score) => sum + score,
            0
        );

        const average =
            allScores.length > 0
                ? (totalScore / allScores.length).toFixed(1)
                : "0.0";

        const highestScore =
            allScores.length > 0 ? Math.max(...allScores) : 0;

        const submittedCount = savedResults.filter(
            (result) => normalizeStatus(result.status) === "submitted"
        ).length;

        const approvedCount = savedResults.filter(
            (result) => normalizeStatus(result.status) === "approved"
        ).length;

        const returnedCount = savedResults.filter(
            (result) => normalizeStatus(result.status) === "returned"
        ).length;

        const draftCount = savedResults.filter(
            (result) => normalizeStatus(result.status) === "draft"
        ).length;

        return {
            totalResults: savedResults.length,
            subjectScores: allScores.length,
            average,
            highestScore,
            submittedCount,
            approvedCount,
            returnedCount,
            draftCount,
        };
    }, [savedResults]);

    return (
        <div className="space-y-8">
            {/* PAGE HEADER */}
            <div>
                <h1 className="text-3xl font-bold text-green-950">
                    Results Management
                </h1>

                <p className="mt-2 text-gray-600">
                    Record, review, approve, and manage student academic
                    results.
                </p>
            </div>

            {/* ERROR MESSAGE */}
            {storageError && (
                <div
                    role="alert"
                    className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800"
                >
                    {storageError}
                </div>
            )}

            {/* OVERVIEW STATISTICS */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard
                    title="Saved Results"
                    value={statistics.totalResults}
                />

                <StatCard
                    title="Subject Scores"
                    value={statistics.subjectScores}
                />

                <StatCard
                    title="Overall Average"
                    value={`${statistics.average}%`}
                />

                <StatCard
                    title="Highest Score"
                    value={`${statistics.highestScore}%`}
                />
            </div>

            {/* RESULT STATUS COUNTERS */}
            <section>
                <div className="mb-4">
                    <h2 className="text-xl font-bold text-green-950">
                        Result Status Overview
                    </h2>

                    <p className="mt-1 text-sm text-gray-600">
                        Track results through the review process.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
                        <p className="text-sm font-medium text-blue-800">
                            Awaiting Review
                        </p>
                        <p className="mt-1 text-2xl font-bold text-blue-950">
                            {statistics.submittedCount}
                        </p>
                    </div>

                    <div className="rounded-xl border border-green-100 bg-green-50 p-4">
                        <p className="text-sm font-medium text-green-800">
                            Approved Results
                        </p>
                        <p className="mt-1 text-2xl font-bold text-green-950">
                            {statistics.approvedCount}
                        </p>
                    </div>

                    <div className="rounded-xl border border-amber-100 bg-amber-50 p-4">
                        <p className="text-sm font-medium text-amber-800">
                            Returned for Correction
                        </p>
                        <p className="mt-1 text-2xl font-bold text-amber-950">
                            {statistics.returnedCount}
                        </p>
                    </div>

                    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                        <p className="text-sm font-medium text-gray-700">
                            Draft Results
                        </p>
                        <p className="mt-1 text-2xl font-bold text-gray-950">
                            {statistics.draftCount}
                        </p>
                    </div>
                </div>
            </section>

            {/* ACTIVE GRADING SCALE */}
            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="mb-4">
                    <h2 className="text-xl font-bold text-green-950">
                        Active Grading Scale
                    </h2>
                    <p className="mt-1 text-sm text-gray-600">
                        These thresholds are loaded from Admin Settings.
                    </p>
                </div>

                <div className="flex flex-wrap gap-3">
                    {gradingScale.map((item) => (
                        <div
                            key={item.grade}
                            className="min-w-24 rounded-xl border border-gray-200 bg-gray-50 p-3"
                        >
                            <p className="text-lg font-bold text-green-800">
                                {item.grade}
                            </p>
                            <p className="text-sm font-semibold text-gray-800">
                                {item.minScore}+
                            </p>
                            <p className="mt-1 text-xs text-gray-600">
                                {item.remark}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* RECORD RESULTS */}
            <section className="space-y-5">
                <div>
                    <h2 className="text-xl font-bold text-green-950">
                        Record Student Results
                    </h2>

                    <p className="mt-1 text-sm text-gray-600">
                        Select the relevant student, session, term, and
                        subjects. Save drafts or submit completed results
                        for review.
                    </p>
                </div>

                <ResultRecordingSheet />
            </section>

            {/* REVIEW AND APPROVAL */}
            <section className="space-y-5">
                <div>
                    <h2 className="text-xl font-bold text-green-950">
                        Review and Approval
                    </h2>

                    <p className="mt-1 text-sm text-gray-600">
                        Inspect submitted marks, approve results, or return
                        them with correction instructions.
                    </p>
                </div>

                <ResultApprovalPanel />
            </section>

            {/* REPORT CARDS */}
            <section className="space-y-5">
                <div>
                    <h2 className="text-xl font-bold text-green-950">
                        Student Report Cards
                    </h2>

                    <p className="mt-1 text-sm text-gray-600">
                        View and print student report cards using the
                        existing report card component.
                    </p>
                </div>

                <StudentReportCard />
            </section>
        </div>
    );
}

export default Results;
