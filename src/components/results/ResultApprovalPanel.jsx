import { useEffect, useState } from "react";

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

function normalizeStatus(status) {
  return String(status || "draft").trim().toLowerCase();
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

function ResultApprovalPanel() {
  const [results, setResults] = useState([]);
  const [students, setStudents] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [feedback, setFeedback] = useState({});
  const [message, setMessage] = useState("");
  const [savingKey, setSavingKey] = useState("");
  const [confirmAction, setConfirmAction] = useState(null);

  function refresh() {
    setResults(readArray(RESULTS_KEY));
    setStudents(readArray(STUDENTS_KEY));
    setSessions(readArray(SESSIONS_KEY));
  }

  useEffect(() => {
    function handleRefresh() {
      refresh();
    }

    handleRefresh();

    window.addEventListener("focus", handleRefresh);
    window.addEventListener("storage", handleRefresh);
    window.addEventListener(
      "greenfield-results-updated",
      handleRefresh
    );

    return () => {
      window.removeEventListener("focus", handleRefresh);
      window.removeEventListener("storage", handleRefresh);
      window.removeEventListener(
        "greenfield-results-updated",
        handleRefresh
      );
    };
  }, []);

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

  function updateResult(resultKey, action) {
    if (savingKey) return;

    if (!["approve", "return"].includes(action)) {
      setMessage("Invalid review action.");
      return;
    }

    const note = String(feedback[resultKey] || "").trim();

    if (action === "return" && !note) {
      setMessage(
        "Enter a correction reason before returning this result."
      );
      return;
    }

    setSavingKey(resultKey);
    setMessage("");

    try {
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
          `This result is currently "${normalizeStatus(
            target.status
          )}" and is no longer awaiting review.`
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

      localStorage.setItem(
        RESULTS_KEY,
        JSON.stringify(updatedResults)
      );

      const savedResults = readArray(RESULTS_KEY);

      const savedTarget = savedResults.find(
        (result) => getResultKey(result) === resultKey
      );

      const expectedStatus =
        action === "approve" ? "approved" : "returned";

      if (
        !savedTarget ||
        normalizeStatus(savedTarget.status) !== expectedStatus
      ) {
        throw new Error(
          "The saved result status could not be verified."
        );
      }

      setResults(savedResults);

      setFeedback((current) => {
        const next = { ...current };
        delete next[resultKey];
        return next;
      });

      setMessage(
        action === "approve"
          ? "Result approved successfully. The approved counter has been updated."
          : "Result returned for correction. The returned counter has been updated."
      );

      notifyResultsUpdated();
    } catch (error) {
      console.error("Could not update result:", error);

      setMessage(
        error instanceof Error &&
          error.message.includes("verified")
          ? error.message
          : "Unable to save this result. Check browser storage and try again."
      );

      refresh();
    } finally {
      setSavingKey("");
    }
  }

  function getSubjectCount(result) {
    return Object.keys(result.marks || {}).length;
  }

  function getAverage(result) {
    const scores = Object.values(result.marks || {})
      .filter((score) => {
        if (
          !score ||
          score.ca === "" ||
          score.ca === undefined ||
          score.exam === "" ||
          score.exam === undefined
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

    if (scores.length === 0) return "—";

    return (
      scores.reduce((sum, score) => sum + score, 0) /
      scores.length
    ).toFixed(1);
  }

  function openConfirmation(result, action) {
    const resultKey = getResultKey(result);

    if (action === "return" && !String(feedback[resultKey] || "").trim()) {
      setMessage(
        "Enter a correction reason before returning this result."
      );
      return;
    }

    setMessage("");

    setConfirmAction({
      type: action,
      resultKey,
      studentName: getStudent(result.studentId)?.name || "this student",
      sessionName: getSession(result.sessionId)?.name || "Unknown session",
      term: result.term || "Unknown term",
    });
  }

  function confirmReviewAction() {
    if (!confirmAction || savingKey) return;

    const { resultKey, type } = confirmAction;

    setConfirmAction(null);
    updateResult(resultKey, type);
  }

  return (
    <section className="space-y-5 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
      {/* HEADER */}
      <div>
        <h2 className="text-xl font-bold text-green-950">
          Results Review & Approval
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
          <p className="text-sm text-gray-700">Drafts</p>
          <p className="mt-1 text-2xl font-bold text-gray-950">
            {draftCount}
          </p>
        </div>
      </div>

      {/* FEEDBACK MESSAGE */}
      {message && (
        <div
          role="status"
          aria-live="polite"
          className="rounded-lg bg-gray-100 p-3 text-sm text-gray-800"
        >
          {message}
        </div>
      )}

      {/* SUBMITTED RESULTS */}
      {submittedResults.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center">
          <div className="mb-2 text-3xl text-green-800">✓</div>

          <h3 className="font-semibold text-gray-800">
            No results awaiting review
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Submitted results will appear here. Returned results
            must be corrected and resubmitted before they appear
            in this list again.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {submittedResults.map((result) => {
            const student = getStudent(result.studentId);
            const session = getSession(result.sessionId);
            const resultKey = getResultKey(result);
            const isSaving = savingKey === resultKey;

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
                    <p className="text-gray-500">Subjects</p>
                    <p className="font-medium text-gray-900">
                      {getSubjectCount(result)}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-500">
                      Average subject score
                    </p>
                    <p className="font-medium text-gray-900">
                      {getAverage(result)}
                      {getAverage(result) !== "—" ? "%" : ""}
                    </p>
                  </div>
                </div>

                {/* CORRECTION REASON */}
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
                    disabled={isSaving}
                    onChange={(event) => {
                      setFeedback((current) => ({
                        ...current,
                        [resultKey]: event.target.value,
                      }));
                      setMessage("");
                    }}
                    placeholder="Explain what needs to be corrected..."
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100 disabled:bg-gray-100"
                  />
                </div>

                {/* ACTION BUTTONS */}
                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    type="button"
                    disabled={Boolean(savingKey)}
                    onClick={() => openConfirmation(result, "approve")}
                    className="rounded-lg bg-green-800 px-4 py-2 font-semibold text-white transition hover:bg-green-900 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isSaving ? "Saving..." : "Approve Result"}
                  </button>

                  <button
                    type="button"
                    disabled={Boolean(savingKey)}
                    onClick={() => openConfirmation(result, "return")}
                    className="rounded-lg border border-red-300 px-4 py-2 font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isSaving ? "Saving..." : "Return for Correction"}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* DEVELOPMENT NOTICE */}
      <p className="text-xs leading-5 text-gray-500">
        This browser-based version is for development and testing.
        Approval controls are not protected by server-side user
        roles until the .NET backend is implemented.
      </p>

      {/* CUSTOM CONFIRMATION MODAL */}
      {confirmAction && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !savingKey) {
              setConfirmAction(null);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-modal-title"
            aria-describedby="confirm-modal-description"
            className="w-full max-w-md overflow-hidden rounded-2xl border border-green-100 bg-white shadow-2xl"
          >
            {/* MODAL HEADER */}
            <div className="bg-green-950 px-6 py-5 text-white">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-yellow-400/15 text-xl text-yellow-300">
                  {confirmAction.type === "approve" ? "✓" : "↻"}
                </div>

                <div>
                  <h3
                    id="confirm-modal-title"
                    className="text-lg font-bold"
                  >
                    {confirmAction.type === "approve"
                      ? "Approve Results?"
                      : "Return for Correction?"}
                  </h3>

                  <p className="mt-1 text-sm text-green-100">
                    Greenfield School · Results Management
                  </p>
                </div>
              </div>
            </div>

            {/* MODAL CONTENT */}
            <div className="space-y-4 p-6">
              <p
                id="confirm-modal-description"
                className="text-sm leading-6 text-gray-700"
              >
                {confirmAction.type === "approve"
                  ? `Are you sure you want to approve ${confirmAction.studentName}'s results? The results will become available on the official report card.`
                  : `Are you sure you want to return ${confirmAction.studentName}'s results to the teacher for correction?`}
              </p>

              <div className="grid grid-cols-1 gap-3 rounded-xl bg-gray-50 p-3 text-sm sm:grid-cols-2">
                <div>
                  <p className="text-xs text-gray-500">Session</p>
                  <p className="font-semibold text-gray-800">
                    {confirmAction.sessionName}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Term</p>
                  <p className="font-semibold text-gray-800">
                    {confirmAction.term}
                  </p>
                </div>
              </div>

              {confirmAction.type === "return" && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-3">
                  <p className="text-xs font-bold uppercase tracking-wide text-amber-900">
                    Correction reason
                  </p>

                  <p className="mt-1 whitespace-pre-wrap break-words text-sm text-amber-800">
                    {feedback[confirmAction.resultKey]}
                  </p>
                </div>
              )}

              <p className="text-xs leading-5 text-gray-500">
                {confirmAction.type === "approve"
                  ? "Please verify the marks before approving. This action changes the result status."
                  : "The correction reason will be saved so the teacher knows what to fix."}
              </p>
            </div>

            {/* MODAL ACTIONS */}
            <div className="flex flex-col-reverse gap-3 border-t border-gray-100 bg-gray-50 px-6 py-4 sm:flex-row sm:justify-end">
              <button
                type="button"
                disabled={Boolean(savingKey)}
                onClick={() => setConfirmAction(null)}
                className="rounded-xl border border-gray-300 bg-white px-5 py-2.5 font-semibold text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={Boolean(savingKey)}
                onClick={confirmReviewAction}
                className={`rounded-xl px-5 py-2.5 font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50 ${
                  confirmAction.type === "approve"
                    ? "bg-green-800 hover:bg-green-900"
                    : "bg-red-700 hover:bg-red-800"
                }`}
              >
                {savingKey === confirmAction.resultKey
                  ? "Saving..."
                  : confirmAction.type === "approve"
                    ? "Yes, Approve"
                    : "Yes, Return"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default ResultApprovalPanel;
