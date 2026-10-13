
import { useEffect, useState } from "react";
import ResultRecordingSheet from "../../components/results/ResultRecordingSheet";
import ResultApprovalPanel from "../../components/results/ResultApprovalPanel";
import StudentReportCard from "../../components/results/StudentReportCard";
import StatCard from "../../components/common/StatCard";

const RESULTS_KEY = "greenfield_school_results";

function getSavedResults() {
    try {
        const data = localStorage.getItem(RESULTS_KEY);
        const parsed = data ? JSON.parse(data) : [];
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

function Results() {
    const [savedResults, setSavedResults] = useState(getSavedResults);

    useEffect(() => {
        function refreshResults() {
            setSavedResults(getSavedResults());
        }

        window.addEventListener("focus", refreshResults);
        window.addEventListener("storage", refreshResults);
        window.addEventListener("greenfield-results-updated", refreshResults);

        return () => {
            window.removeEventListener("focus", refreshResults);
            window.removeEventListener("storage", refreshResults);
            window.removeEventListener(
                "greenfield-results-updated",
                refreshResults
            );
        };
    }, []);

    const allScores = savedResults.flatMap((result) => {
        const marks = result.marks || {};

        return Object.values(marks)
            .filter(
                (subject) =>
                    subject &&
                    subject.ca !== "" &&
                    subject.exam !== "" &&
                    Number.isFinite(Number(subject.ca)) &&
                    Number.isFinite(Number(subject.exam)) &&
                    Number(subject.ca) >= 0 &&
                    Number(subject.ca) <= 20 &&
                    Number(subject.exam) >= 0 &&
                    Number(subject.exam) <= 80
            )
            .map((subject) => Number(subject.ca) + Number(subject.exam));
    });

    const average =
        allScores.length > 0
            ? (
                  allScores.reduce((sum, score) => sum + score, 0) /
                  allScores.length
              ).toFixed(1)
            : "0.0";

    const highestScore =
        allScores.length > 0 ? Math.max(...allScores) : 0;

    const submittedCount = savedResults.filter(
        (result) => result.status === "submitted"
    ).length;

    const approvedCount = savedResults.filter(
        (result) => result.status === "approved"
    ).length;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-green-950">
                    Results Management
                </h1>

                <p className="mt-2 text-gray-600">
                    Record, review and approve student academic results.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard
                    title="Saved Results"
                    value={savedResults.length}
                />

                <StatCard
                    title="Subject Scores"
                    value={allScores.length}
                />

                <StatCard
                    title="Overall Average"
                    value={`${average}%`}
                />

                <StatCard
                    title="Highest Score"
                    value={`${highestScore}%`}
                />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
                    <p className="text-sm font-medium text-blue-800">
                        Awaiting Review
                    </p>
                    <p className="mt-1 text-2xl font-bold text-blue-950">
                        {submittedCount}
                    </p>
                </div>

                <div className="rounded-xl border border-green-100 bg-green-50 p-4">
                    <p className="text-sm font-medium text-green-800">
                        Approved Results
                    </p>
                    <p className="mt-1 text-2xl font-bold text-green-950">
                        {approvedCount}
                    </p>
                </div>
            </div>

            <section>
                <div className="mb-5">
                    <h2 className="text-xl font-bold text-green-950">
                        Record Student Results
                    </h2>

                    <p className="mt-1 text-sm text-gray-600">
                        Enter marks, save a draft, or submit completed results
                        for review.
                    </p>
                </div>

                <ResultRecordingSheet />
            </section>

            <section>
                <ResultApprovalPanel />
            </section>

            <section>
                <div className="mb-5">
                    <h2 className="text-xl font-bold text-green-950">
                        Student Report Cards
                    </h2>

                    <p className="mt-1 text-sm text-gray-600">
                        View and print student report cards using your existing
                        report card component.
                    </p>
                </div>

                <StudentReportCard />
            </section>
        </div>
    );
}

export default Results;
