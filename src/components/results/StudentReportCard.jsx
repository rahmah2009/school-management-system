
import { useCallback, useEffect, useState } from "react";

const RESULTS_KEY = "greenfield_school_results";
const STUDENTS_KEY = "greenfield_school_students";
const SESSIONS_KEY = "greenfield_school_sessions";
const REMARKS_KEY = "greenfield_school_remarks";
const SETTINGS_KEY = "greenfield_school_settings";

const DEFAULT_GRADING_SCALE = [
  { grade: "A", minScore: 70, remark: "Excellent" },
  { grade: "B", minScore: 60, remark: "Very Good" },
  { grade: "C", minScore: 50, remark: "Good" },
  { grade: "D", minScore: 45, remark: "Fair" },
  { grade: "E", minScore: 40, remark: "Pass" },
  { grade: "F", minScore: 0, remark: "Fail" },
];

function readArray(key) {
  try {
    const parsed = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error(`Could not read ${key}:`, error);
    return [];
  }
}

function readRemarks() {
  try {
    const parsed = JSON.parse(
      localStorage.getItem(REMARKS_KEY) || "{}"
    );

    return parsed &&
      typeof parsed === "object" &&
      !Array.isArray(parsed)
      ? parsed
      : {};
  } catch (error) {
    console.error("Could not read remarks:", error);
    return {};
  }
}

function readGradingScale() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);

    if (!raw) {
      return DEFAULT_GRADING_SCALE.map((item) => ({ ...item }));
    }

    const settings = JSON.parse(raw);
    const scale = settings?.gradingScale;

    if (
      !Array.isArray(scale) ||
      scale.length !== DEFAULT_GRADING_SCALE.length
    ) {
      return DEFAULT_GRADING_SCALE.map((item) => ({ ...item }));
    }

    const valid = scale.every((item, index) => {
      const score = Number(item?.minScore);

      return (
        item?.grade === DEFAULT_GRADING_SCALE[index].grade &&
        Number.isInteger(score) &&
        score >= 0 &&
        score <= 100 &&
        typeof item.remark === "string" &&
        item.remark.trim() !== "" &&
        (
          index === 0 ||
          score < Number(scale[index - 1].minScore)
        )
      );
    });

    if (!valid || Number(scale[5].minScore) !== 0) {
      return DEFAULT_GRADING_SCALE.map((item) => ({ ...item }));
    }

    return scale.map((item) => ({
      grade: item.grade,
      minScore: Number(item.minScore),
      remark: item.remark.trim(),
    }));
  } catch (error) {
    console.error("Could not read grading scale:", error);

    return DEFAULT_GRADING_SCALE.map((item) => ({ ...item }));
  }
}

// Each grading function is declared only once.
function getGrade(total, gradingScale) {
  const score = Number(total);

  const matchedGrade = gradingScale.find(
    (item) => score >= Number(item.minScore)
  );

  return matchedGrade?.grade || "F";
}

function getRemark(average, gradingScale) {
  const matchedGrade = gradingScale.find(
    (item) => average >= item.minScore
  );

  return matchedGrade?.remark ?? "Fail";
}

function getSubjectScores(result) {
  return Object.entries(result?.marks || {})
    .filter(([, marks]) => {
      if (
        !marks ||
        marks.ca === "" ||
        marks.ca === undefined ||
        marks.ca === null ||
        marks.exam === "" ||
        marks.exam === undefined ||
        marks.exam === null
      ) {
        return false;
      }

      const ca = Number(marks.ca);
      const exam = Number(marks.exam);

      return (
        Number.isFinite(ca) &&
        Number.isFinite(exam) &&
        ca >= 0 &&
        ca <= 20 &&
        exam >= 0 &&
        exam <= 80
      );
    })
    .map(([subject, marks]) => ({
      subject,
      ca: Number(marks.ca),
      exam: Number(marks.exam),
      total: Number(marks.ca) + Number(marks.exam),
    }));
}

function ordinal(number) {
  if (number === null || number === undefined) return "—";

  const lastTwo = number % 100;

  if (lastTwo >= 11 && lastTwo <= 13) {
    return `${number}th`;
  }

  switch (number % 10) {
    case 1:
      return `${number}st`;
    case 2:
      return `${number}nd`;
    case 3:
      return `${number}rd`;
    default:
      return `${number}th`;
  }
}

function getStatusLabel(status) {
  switch (String(status || "").trim().toLowerCase()) {
    case "draft":
      return "Draft";
    case "submitted":
      return "Awaiting approval";
    case "returned":
      return "Returned for correction";
    case "approved":
      return "Approved";
    default:
      return "Not submitted for approval";
  }
}

function StudentReportCard() {
  const [students, setStudents] = useState(() =>
    readArray(STUDENTS_KEY)
  );

  const [gradingScale, setGradingScale] = useState(readGradingScale);

  const [sessions, setSessions] = useState(() =>
    readArray(SESSIONS_KEY)
  );

  const [results, setResults] = useState(() =>
    readArray(RESULTS_KEY)
  );

  const [remarks, setRemarks] = useState(readRemarks);

  const [studentId, setStudentId] = useState("");

  const [sessionId, setSessionId] = useState(() => {
    const activeSession = readArray(SESSIONS_KEY).find(
      (session) => session.isActive
    );

    return activeSession ? String(activeSession.id) : "";
  });

  const [term, setTerm] = useState("");
  const [remarkMessage, setRemarkMessage] = useState("");

  const refreshData = useCallback(() => {
    setStudents(readArray(STUDENTS_KEY));
    setSessions(readArray(SESSIONS_KEY));
    setResults(readArray(RESULTS_KEY));
    setRemarks(readRemarks());
    setGradingScale(readGradingScale());
  }, []);

  useEffect(() => {
    refreshData();

    window.addEventListener("focus", refreshData);
    window.addEventListener("storage", refreshData);

    window.addEventListener(
      "greenfield-results-updated",
      refreshData
    );

    window.addEventListener(
      "greenfield-settings-updated",
      refreshData
    );

    return () => {
      window.removeEventListener("focus", refreshData);
      window.removeEventListener("storage", refreshData);

      window.removeEventListener(
        "greenfield-results-updated",
        refreshData
      );

      window.removeEventListener(
        "greenfield-settings-updated",
        refreshData
      );
    };
  }, [refreshData]);

  const student = students.find(
    (item) => String(item.id) === studentId
  );

  const session = sessions.find(
    (item) => String(item.id) === sessionId
  );

  const result = results.find(
    (item) =>
      String(item.studentId) === studentId &&
      String(item.sessionId) === sessionId &&
      item.term === term
  );

  // Only explicitly approved results may appear on the official report.
  const isApproved =
    String(result?.status || "").trim().toLowerCase() === "approved";

  const remarkKey = JSON.stringify([
    studentId,
    sessionId,
    term,
  ]);

  const currentRemark = remarks[remarkKey] || {
    teacherRemark: "",
  };

  // Unapproved results never contribute marks to the report.
  const scores = getSubjectScores(
    isApproved ? result : null
  );

  const totalMarks = scores.reduce(
    (sum, item) => sum + item.total,
    0
  );

  const average = scores.length
    ? totalMarks / scores.length
    : 0;

  // Class positions use approved results from the same class/session/term.
  const classmates = student
    ? students
      .filter(
        (item) =>
          item.className === student.className &&
          (item.department || "") ===
          (student.department || "")
      )
      .map((classmate) => {
        const classmateResult = results.find(
          (item) =>
            String(item.studentId) === String(classmate.id) &&
            String(item.sessionId) === sessionId &&
            item.term === term
        );

        if (
          String(classmateResult?.status || "")
            .trim()
            .toLowerCase() !== "approved"
        ) {
          return {
            id: classmate.id,
            average: null,
          };
        }

        const classmateScores =
          getSubjectScores(classmateResult);

        const classmateAverage = classmateScores.length
          ? classmateScores.reduce(
            (sum, item) => sum + item.total,
            0
          ) / classmateScores.length
          : null;

        return {
          id: classmate.id,
          average: classmateAverage,
        };
      })
      .filter((item) => item.average !== null)
    : [];

  const position = scores.length
    ? classmates.filter(
      (item) => item.average > average
    ).length + 1
    : null;

  function saveTeacherRemark(value) {
    if (!studentId || !sessionId || !term) {
      setRemarkMessage(
        "Select a student, session and term first."
      );
      return;
    }

    const updatedRemarks = {
      ...remarks,
      [remarkKey]: {
        ...currentRemark,
        teacherRemark: value,
      },
    };

    try {
      localStorage.setItem(
        REMARKS_KEY,
        JSON.stringify(updatedRemarks)
      );

      setRemarks(updatedRemarks);
      setRemarkMessage("Remark saved.");
    } catch (error) {
      console.error("Could not save remark:", error);

      setRemarkMessage(
        "Could not save the remark. Check browser storage."
      );
    }
  }

  function updateSelection(setter, value) {
    setter(value);
    setRemarkMessage("");
  }

  function printReport() {
    if (!isApproved) return;
    window.print();
  }

  const hasSelection = Boolean(
    studentId && sessionId && term
  );

  return (
    <section className="mt-10 space-y-5">
      <div className="no-print">
        <h2 className="text-2xl font-bold text-green-950">
          Student Report Card
        </h2>

        <p className="mt-1 text-sm text-gray-600">
          View, review and print a student's academic report.
          Only approved results can be printed as official reports.
        </p>
      </div>

      {/* STUDENT, SESSION AND TERM SELECTIONS */}
      <div className="no-print grid gap-5 rounded-2xl border border-green-100 bg-white p-5 shadow-sm sm:grid-cols-3">
        <div>
          <label
            htmlFor="report-student"
            className="mb-2 block text-sm font-semibold text-green-950"
          >
            Student
          </label>

          <select
            id="report-student"
            value={studentId}
            onChange={(event) =>
              updateSelection(setStudentId, event.target.value)
            }
            className="w-full rounded-xl border border-gray-300 p-3"
          >
            <option value="">Select student</option>

            {students.map((item) => (
              <option key={item.id} value={String(item.id)}>
                {item.name} ({item.id})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="report-session"
            className="mb-2 block text-sm font-semibold text-green-950"
          >
            Academic Session
          </label>

          <select
            id="report-session"
            value={sessionId}
            onChange={(event) =>
              updateSelection(setSessionId, event.target.value)
            }
            className="w-full rounded-xl border border-gray-300 p-3"
          >
            <option value="">Select session</option>

            {sessions.map((item) => (
              <option key={item.id} value={String(item.id)}>
                {item.name}
                {item.isActive ? " (Active)" : ""}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="report-term"
            className="mb-2 block text-sm font-semibold text-green-950"
          >
            Term
          </label>

          <select
            id="report-term"
            value={term}
            onChange={(event) =>
              updateSelection(setTerm, event.target.value)
            }
            className="w-full rounded-xl border border-gray-300 p-3"
          >
            <option value="">Select term</option>
            <option value="First Term">First Term</option>
            <option value="Second Term">Second Term</option>
            <option value="Third Term">Third Term</option>
          </select>
        </div>
      </div>

      {!hasSelection ? (
        <div className="no-print rounded-xl bg-gray-50 p-5 text-sm text-gray-600">
          Select a student, academic session and term to view
          the report card.
        </div>
      ) : !student ? (
        <div className="no-print rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-800">
          The selected student could not be found. Refresh
          the page and select the student again.
        </div>
      ) : !session ? (
        <div className="no-print rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-800">
          The selected academic session could not be found.
          Refresh the page and select the session again.
        </div>
      ) : !result ? (
        <div className="no-print rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-800">
          No saved results were found for this student,
          session and term.
        </div>
      ) : !isApproved ? (
        <>
          {/* UNAPPROVED RESULT STATUS */}
          <div className="no-print rounded-xl border border-amber-200 bg-amber-50 p-5">
            <h3 className="font-bold text-amber-900">
              Official Report Card Not Available
            </h3>

            <p className="mt-2 text-sm text-amber-800">
              This result has not been approved. Marks, totals,
              averages and class positions are hidden until an
              administrator approves the result.
            </p>

            <p className="mt-3 text-sm font-semibold text-amber-900">
              Current status: {getStatusLabel(result.status)}
            </p>

            {String(result.status || "").toLowerCase() === "returned" &&
              result.reviewNote && (
                <p className="mt-2 text-sm text-amber-800">
                  <strong>Review note:</strong>{" "}
                  {result.reviewNote}
                </p>
              )}
          </div>

          {/* TEACHER REMARK BEFORE APPROVAL */}
          <div className="no-print space-y-3 rounded-2xl border border-green-100 bg-white p-5 shadow-sm">
            <div>
              <h3 className="font-bold text-green-950">
                Class Teacher's Remark
              </h3>

              <p className="mt-1 text-sm text-gray-600">
                You can prepare the teacher's remark while the
                result awaits approval. The official report card
                remains unavailable until approval.
              </p>
            </div>

            <label
              htmlFor="teacher-remark-pending"
              className="block text-sm font-semibold text-green-950"
            >
              Enter or edit teacher's remark
            </label>

            <textarea
              id="teacher-remark-pending"
              value={currentRemark.teacherRemark}
              onChange={(event) =>
                saveTeacherRemark(event.target.value)
              }
              placeholder="Write a comment about the student's progress..."
              rows={3}
              maxLength={500}
              className="w-full rounded-xl border border-green-200 p-3 outline-none focus:border-green-950"
            />

            <p
              role="status"
              aria-live="polite"
              className="text-xs text-gray-500"
            >
              {remarkMessage ||
                "Remark is saved automatically for this student, session and term."}
            </p>
          </div>
        </>
      ) : (
        <>
          {/* OFFICIAL APPROVED REPORT CARD */}
          <div className="report-card-print overflow-hidden rounded-2xl border border-green-200 bg-white shadow-sm">
            <header className="print-school-header bg-green-950 px-6 py-7 text-center text-white">
              <h3 className="text-3xl font-extrabold tracking-wide">
                GREENFIELD SCHOOL
              </h3>

              <p className="mt-2 text-sm">
                STUDENT ACADEMIC REPORT
              </p>

              <p className="mt-1 font-semibold">
                {term} · {session.name}
              </p>

              <p className="mt-2 text-xs font-semibold uppercase tracking-wider">
                Approved Result
              </p>
            </header>

            {/* STUDENT DETAILS */}
            <div className="grid gap-3 border-b border-green-100 p-5 sm:grid-cols-2">
              <p>
                <strong>Student:</strong> {student.name}
              </p>

              <p>
                <strong>Student ID:</strong> {student.id}
              </p>

              <p>
                <strong>Class:</strong> {student.className || "—"}
              </p>

              <p>
                <strong>Department:</strong>{" "}
                {student.department || "—"}
              </p>
            </div>

            {/* SUBJECT RESULTS */}
            <div className="p-4 sm:p-5">
              <table className="report-table w-full border-collapse text-left text-xs sm:text-sm">
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>CA / 20</th>
                    <th>Exam / 80</th>
                    <th>Total / 100</th>
                    <th>Grade</th>
                  </tr>
                </thead>

                <tbody>
                  {scores.map((item) => (
                    <tr key={item.subject}>
                      <td>{item.subject}</td>
                      <td>{item.ca}</td>
                      <td>{item.exam}</td>
                      <td>{item.total}</td>
                      <td className="font-bold">
                        {/* {getGrade(item.total, gradingScale)} */}
                        {getGrade(item.total, gradingScale)} ({item.total}/100)
                      </td>
                    </tr>
                  ))}

                  {scores.length === 0 && (
                    <tr>
                      <td colSpan={5}>
                        No complete subject marks available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* SUMMARY */}
            {scores.length > 0 && (
              <div className="grid grid-cols-3 gap-3 border-y border-green-100 bg-green-50 p-4 sm:p-5">
                <div>
                  <p className="text-xs text-gray-600 sm:text-sm">
                    Total Marks
                  </p>

                  <p className="text-base font-bold text-green-950 sm:text-xl">
                    {totalMarks}/{scores.length * 100}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-600 sm:text-sm">
                    Average
                  </p>

                  <p className="text-base font-bold text-green-950 sm:text-xl">
                    {average.toFixed(1)}%
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-600 sm:text-sm">
                    Class Position
                  </p>

                  <p className="text-base font-bold text-green-950 sm:text-xl">
                    {ordinal(position)}
                  </p>
                </div>
              </div>
            )}

            {/* REMARKS */}
            <div className="space-y-5 p-5">
              <div>
                <p className="font-bold text-green-950">
                  Performance Remark
                </p>

                <p className="mt-1">
                  {scores.length
                    ? getRemark(average, gradingScale)
                    : "No complete subject marks available."}
                </p>
              </div>

              <div>
                <p className="font-bold text-green-950">
                  Class Teacher's Remark
                </p>

                <p className="mt-1 min-h-6 whitespace-pre-wrap">
                  {currentRemark.teacherRemark ||
                    "No teacher's remark entered yet."}
                </p>
              </div>

              <div className="no-print space-y-2">
                <label
                  htmlFor="teacher-remark"
                  className="block font-semibold text-green-950"
                >
                  Enter or Edit Teacher's Remark
                </label>

                <textarea
                  id="teacher-remark"
                  value={currentRemark.teacherRemark}
                  onChange={(event) =>
                    saveTeacherRemark(event.target.value)
                  }
                  placeholder="Write a comment about the student's progress..."
                  rows={3}
                  maxLength={500}
                  className="w-full rounded-xl border border-green-200 p-3 outline-none focus:border-green-950"
                />

                <p
                  role="status"
                  aria-live="polite"
                  className="text-xs text-gray-500"
                >
                  {remarkMessage ||
                    "Remark is saved automatically for this student, session and term."}
                </p>
              </div>

              {/* SIGNATURES */}
              <div className="report-signatures">
                <div className="signature-block">
                  <div className="signature-line" aria-hidden="true" />
                  <p>Class Teacher's Signature</p>
                </div>

                <div className="signature-block">
                  <div className="signature-line" aria-hidden="true" />
                  <p>Principal's Signature</p>
                </div>
              </div>
            </div>
          </div>

          <div className="no-print flex justify-end">
            <button
              type="button"
              onClick={printReport}
              className="rounded-xl bg-green-950 px-6 py-3 font-semibold text-white transition hover:bg-green-900"
            >
              Print Report Card
            </button>
          </div>
        </>
      )}

      <style>{`
        .report-signatures {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
          gap: 32px;
          margin-top: 48px;
          padding-top: 12px;
          break-inside: avoid;
          page-break-inside: avoid;
        }

        .signature-block {
          min-width: 0;
          text-align: center;
          break-inside: avoid;
          page-break-inside: avoid;
        }

        .signature-line {
          display: block;
          width: 100%;
          max-width: 220px;
          height: 1px;
          margin: 0 auto 9px;
          border: 0;
          border-top: 1px solid #111827;
          background: transparent;
        }

        .signature-block p {
          font-size: 12px;
          font-weight: 600;
          color: #374151;
        }

        .report-table th,
        .report-table td {
          border: 1px solid #d1d5db;
          padding: 8px;
        }

        .report-table th {
          background: #052e16;
          color: white;
          font-weight: 700;
        }

        .report-table tbody tr {
          break-inside: avoid;
          page-break-inside: avoid;
        }

        @media print {
          @page {
            size: A4 portrait;
            margin: 10mm;
          }

          html,
          body,
          #root {
            width: 100% !important;
            height: auto !important;
            min-height: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: visible !important;
            background: white !important;
          }

          body * {
            visibility: hidden !important;
          }

          .report-card-print,
          .report-card-print * {
            visibility: visible !important;
          }

          .report-card-print {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            max-width: none !important;
            height: auto !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: visible !important;
            border: none !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            color: #111827 !important;
            background: white !important;
            font-size: 10pt !important;
          }

          .report-card-print .print-school-header {
            background: #052e16 !important;
            color: white !important;
            print-color-adjust: exact !important;
            -webkit-print-color-adjust: exact !important;
          }

          .report-card-print .report-table {
            width: 100% !important;
            table-layout: auto !important;
          }

          .report-card-print .report-table th {
            background: #052e16 !important;
            color: white !important;
            print-color-adjust: exact !important;
            -webkit-print-color-adjust: exact !important;
          }

          .report-card-print .report-table th,
          .report-card-print .report-table td {
            padding: 5px !important;
            border: 1px solid #9ca3af !important;
          }

          .report-card-print .report-signatures {
            display: grid !important;
            grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) !important;
            gap: 32px !important;
            margin-top: 40px !important;
            padding-top: 12px !important;
            visibility: visible !important;
            break-inside: avoid !important;
            page-break-inside: avoid !important;
          }

          .report-card-print .signature-block {
            display: block !important;
            visibility: visible !important;
            min-width: 0 !important;
            text-align: center !important;
            break-inside: avoid !important;
            page-break-inside: avoid !important;
          }

          .report-card-print .signature-line {
            display: block !important;
            visibility: visible !important;
            width: 100% !important;
            max-width: 220px !important;
            height: 1px !important;
            margin: 0 auto 9px !important;
            border: 0 !important;
            border-top: 1px solid #111827 !important;
            background: transparent !important;
          }

          .report-card-print .signature-block p {
            visibility: visible !important;
            color: #111827 !important;
            font-size: 10pt !important;
          }

          .report-card-print .no-print,
          .no-print {
            display: none !important;
            visibility: hidden !important;
          }

          .report-card-print header,
          .report-card-print .grid,
          .report-card-print .space-y-5 {
            break-inside: avoid;
            page-break-inside: avoid;
          }
        }
      `}</style>
    </section>
  );
}

export default StudentReportCard;
