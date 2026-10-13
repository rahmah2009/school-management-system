
import { useCallback, useEffect, useState } from "react";

const RESULTS_KEY = "greenfield_school_results";
const STUDENTS_KEY = "greenfield_school_students";
const SESSIONS_KEY = "greenfield_school_sessions";

function readArray(key) {
  try {
    const parsed = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error(`Could not read ${key}:`, error);
    return [];
  }
}

// Normalize statuses so "Returned", "returned for correction",
// and "returned" are handled consistently.
function normalizeStatus(status) {
  const value = String(status || "draft")
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");

  if (
    ["submitted", "pending", "awaiting_approval", "submitted_for_review"]
      .includes(value)
  ) {
    return "submitted";
  }

  if (value === "approved") {
    return "approved";
  }

  if (
    ["returned", "returned_for_correction", "needs_correction"]
      .includes(value)
  ) {
    return "returned";
  }

  return "draft";
}

function getResultKey(result) {
  return JSON.stringify([
    String(result.studentId),
    String(result.sessionId),
    String(result.term),
  ]);
}

function notifyResultsUpdated() {
  window.dispatchEvent(new Event("greenfield-results-updated"));
}

function getValidScores(result) {
  return Object.values(result?.marks || {})
    .filter((score) => {
      if (
        !score ||
        score.ca === "" ||
        score.ca == null ||
        score.exam === "" ||
        score.exam == null
      ) {
        return false;
      }

      const ca = Number(score.ca);
      const exam = Number(score.exam);

      return (
        Number.isFinite(ca) &&
        Number.isFinite(exam) &&
        ca >= 0 &&
        ca <= 20 &&
        exam >= 0 &&
        exam <= 80
      );
    })
    .map((score) => Number(score.ca) + Number(score.exam));
}

function ResultApprovalPanel() {
  const [results, setResults] = useState([]);
  const [students, setStudents] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [feedback, setFeedback] = useState({});
  const [message, setMessage] = useState("");
  const [busyKey, setBusyKey] = useState("");

  const refresh = useCallback(() => {
    setResults(readArray(RESULTS_KEY));
    setStudents(readArray(STUDENTS_KEY));
    setSessions(readArray(SESSIONS_KEY));
  }, []);

  useEffect(() => {
    refresh();

    window.addEventListener("focus", refresh);
    window.addEventListener("storage", refresh);
    window.addEventListener(
      "greenfield-results-updated",
      refresh
    );

    return () => {
      window.removeEventListener("focus", refresh);
      window.removeEventListener("storage", refresh);
      window.removeEventListener(
        "greenfield-results-updated",
        refresh
      );
    };
  }, [refresh]);

  // Always calculate counters from the latest component state.
  const submittedResults = results.filter(
    (result) => normalizeStatus(result.status) === "submitted"
  );

  const approvedCount = results.filter(
    (result) => normalizeStatus(result.status) === "approved"
  ).length;

  const returnedCount = results.filter(
    (result) => normalizeStatus(result.status) === "returned"
  ).length;

  const draftCount = results.filter(
    (result) => normalizeStatus(result.status) === "draft"
  ).length;

  function getStudent(studentId) {
    return students.find(
      (student) => String(student.id) === String(studentId)
    );
  }

  function getSession(sessionId) {
    return sessions.find(
      (session) => String(session.id) === String(sessionId)
    );
  }

  function getSubjectCount(result) {
    return getValidScores(result).length;
  }

  function getAverage(result) {
    const scores = getValidScores(result);

    if (scores.length === 0) return "—";

    return (
      scores.reduce((sum, score) => sum + score, 0) /
      scores.length
    ).toFixed(1);
  }

  function updateFeedback(resultKey, value) {
    setFeedback((current) => ({
      ...current,
      [resultKey]: value,
    }));

    setMessage("");
  }

  function updateResult(resultKey, action) {
    if (busyKey) return;

    if (!["approve", "return"].includes(action)) {
      setMessage("Invalid review action.");
      return;
    }

    const note = String(feedback[resultKey] || "").trim();

    if (action === "return" && !note) {
      setMessage(
        "Enter a reason before returning a result for correction."
      );
      return;
    }

    setBusyKey(resultKey);
    setMessage("");

    try {
      // Read the latest saved data rather than relying on stale React state.
      const currentResults = readArray(RESULTS_KEY);

      const target = currentResults.find(
        (result) => getResultKey(result) === resultKey
      );

      if (!target) {
        setMessage(
          "Result not found in browser storage. Refresh and try again."
        );
        refresh();
        return;
      }

      if (normalizeStatus(target.status) !== "submitted") {
        setMessage(
          "This result is no longer awaiting review. The panel has been refreshed."
        );
        refresh();
        return;
      }

      const now = new Date().toISOString();

      const updatedResults = currentResults.map((result) => {
        if (getResultKey(result) !== resultKey) {
          return result;
        }

        if (action === "approve") {
          return {
            ...result,
            status: "approved",
            reviewNote: "",
            approvedAt: now,
            reviewedAt: now,
          };
        }

        return {
          ...result,
          status: "returned",
          reviewNote: note,
          returnedAt: now,
          reviewedAt: now,
        };
      });

      // Save first. Update the UI only after saving succeeds.
      localStorage.setItem(
        RESULTS_KEY,
        JSON.stringify(updatedResults)
      );

      // Re-read persisted data so counters reflect what was actually saved.
      setResults(readArray(RESULTS_KEY));

      setFeedback((current) => {
        const next = { ...current };
        delete next[resultKey];
        return next;
      });

      setMessage(
        action === "approve"
          ? "Result approved successfully. It is now locked against normal editing."
          : "Result returned for correction. The correction reason has been saved."
      );

      notifyResultsUpdated();
    } catch (error) {
      console.error("Could not update result status:", error);
      setMessage(
        "Could not save the review decision. Check browser storage and try again."
      );
    } finally {
      setBusyKey("");
    }
  }

  return (
    <section className="space-y-5 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
      <div>
        <h2 className="text-xl font-bold text-green-950">
          Results Review &amp; Approval
        </h2>

        <p className="mt-1 text-sm text-gray-600">
          Review submitted results before approving them or
          requesting corrections.
        </p>
      </div>

      {/* STATUS COUNTERS */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl bg-blue-50 p-4">
          <p className="text-sm text-blue-800">Awaiting Review</p>
          <p className="mt-1 text-2xl font-bold text-blue-950">
            {submittedResults.length}
          </p>
        </div>

        <div className="rounded-xl bg-green-50 p-4">
          <p className="text-sm text-green-800">Approved</p>
          <p className="mt-1 text-2xl font-bold text-green-950">
            {approvedCount}
          </p>
        </div>

        <div className="rounded-xl bg-amber-50 p-4">
          <p className="text-sm text-amber-800">
            Returned for Correction
          </p>
          <p className="mt-1 text-2xl font-bold text-amber-950">
            {returnedCount}
          </p>
        </div>

        <div className="rounded-xl bg-gray-100 p-4">
          <p className="text-sm text-gray-600">Drafts</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">
            {draftCount}
          </p>
        </div>
      </div>

      {message && (
        <div
          role="status"
          aria-live="polite"
          className="rounded-lg bg-gray-100 p-3 text-sm text-gray-800"
        >
          {message}
        </div>
      )}

      {submittedResults.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center">
          <div className="mb-2 text-3xl">✓</div>

          <h3 className="font-semibold text-gray-800">
            No results awaiting review
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Submitted results will appear here. Returned results
            remain in the returned count until resubmitted.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {submittedResults.map((result) => {
            const student = getStudent(result.studentId);
            const session = getSession(result.sessionId);
            const resultKey = getResultKey(result);
            const average = getAverage(result);
            const isBusy = busyKey === resultKey;

            return (
              <article
                key={resultKey}
                className="rounded-xl border border-gray-200 p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-green-950">
                      {student?.name || "Unknown student"}
                    </h3>

                    <p className="mt-1 text-sm text-gray-600">
                      {student?.className || "Class unknown"}
                      {student?.department
                        ? ` · ${student.department}`
                        : ""}
                    </p>
                  </div>

                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800">
                    Submitted for review
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
                  <div>
                    <p className="text-gray-500">Session</p>
                    <p className="font-medium text-gray-900">
                      {session?.name || "Unknown session"}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-500">Term</p>
                    <p className="font-medium text-gray-900">
                      {result.term || "Unknown term"}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-500">Subjects with complete marks</p>
                    <p className="font-medium text-gray-900">
                      {getSubjectCount(result)}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-500">
                      Average subject score
                    </p>
                    <p className="font-medium text-gray-900">
                      {average}
                      {average !== "—" ? "%" : ""}
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  <label
                    htmlFor={`feedback-${resultKey}`}
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    Correction reason (required to return)
                  </label>

                  <textarea
                    id={`feedback-${resultKey}`}
                    rows={2}
                    value={feedback[resultKey] || ""}
                    onChange={(event) =>
                      updateFeedback(resultKey, event.target.value)
                    }
                    placeholder="Explain what needs to be corrected..."
                    disabled={isBusy}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-green-700 disabled:bg-gray-100"
                  />
                </div>

                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    type="button"
                    disabled={Boolean(busyKey)}
                    onClick={() => {
                      if (
                        window.confirm(
                          "Approve these results? They will be locked against normal editing."
                        )
                      ) {
                        updateResult(resultKey, "approve");
                      }
                    }}
                    className="rounded-lg bg-green-800 px-4 py-2 font-semibold text-white hover:bg-green-900 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isBusy ? "Saving..." : "Approve Result"}
                  </button>

                  <button
                    type="button"
                    disabled={Boolean(busyKey)}
                    onClick={() => {
                      if (!String(feedback[resultKey] || "").trim()) {
                        setMessage(
                          "Enter a reason before returning a result for correction."
                        );
                        return;
                      }

                      if (
                        window.confirm(
                          "Return this result to the teacher for correction?"
                        )
                      ) {
                        updateResult(resultKey, "return");
                      }
                    }}
                    className="rounded-lg border border-red-300 px-4 py-2 font-semibold text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isBusy ? "Saving..." : "Return for Correction"}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <p className="text-xs leading-5 text-gray-500">
        This browser-based version is for development and testing.
        Approval controls are not protected by server-side user
        roles until the .NET backend is implemented.
      </p>
    </section>
  );
}

export default ResultApprovalPanel;
