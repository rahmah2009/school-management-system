
import { useState } from "react";
import {
    Save,
    School,
    RotateCcw,
    CheckCircle,
    Settings as SettingsIcon,
    GraduationCap,
    Award,
    Info,
} from "lucide-react";

const SETTINGS_KEY = "greenfield_school_settings";

const GRADES = ["A", "B", "C", "D", "E", "F"];
const TERMS = ["First Term", "Second Term", "Third Term"];

const DEFAULT_SETTINGS = {
    schoolName: "Greenfield School",
    principalName: "Dr. Suleiman Ibroheem",
    address: "",
    phone: "",
    email: "",
    defaultSession: "",
    defaultTerm: "First Term",
    gradingScale: [
        { grade: "A", minScore: 70, remark: "Excellent" },
        { grade: "B", minScore: 60, remark: "Very Good" },
        { grade: "C", minScore: 50, remark: "Good" },
        { grade: "D", minScore: 45, remark: "Fair" },
        { grade: "E", minScore: 40, remark: "Pass" },
        { grade: "F", minScore: 0, remark: "Fail" },
    ],
};

function cloneSettings(settings) {
    return {
        ...settings,
        gradingScale: settings.gradingScale.map((item) => ({
            ...item,
        })),
    };
}

function loadSettings() {
    try {
        const saved = localStorage.getItem(SETTINGS_KEY);

        if (!saved) {
            return cloneSettings(DEFAULT_SETTINGS);
        }

        const parsed = JSON.parse(saved);

        if (
            !parsed ||
            typeof parsed !== "object" ||
            Array.isArray(parsed)
        ) {
            return cloneSettings(DEFAULT_SETTINGS);
        }

        const gradingScale =
            Array.isArray(parsed.gradingScale) &&
                parsed.gradingScale.length === GRADES.length
                ? parsed.gradingScale.map((item, index) => ({
                    grade: GRADES[index],
                    minScore: item?.minScore ?? "",
                    remark:
                        typeof item?.remark === "string"
                            ? item.remark
                            : "",
                }))
                : cloneSettings(DEFAULT_SETTINGS).gradingScale;

        return {
            ...DEFAULT_SETTINGS,
            ...parsed,
            schoolName:
                typeof parsed.schoolName === "string"
                    ? parsed.schoolName
                    : DEFAULT_SETTINGS.schoolName,
            principalName:
                typeof parsed.principalName === "string"
                    ? parsed.principalName
                    : DEFAULT_SETTINGS.principalName,
            address:
                typeof parsed.address === "string"
                    ? parsed.address
                    : "",
            phone:
                typeof parsed.phone === "string"
                    ? parsed.phone
                    : "",
            email:
                typeof parsed.email === "string"
                    ? parsed.email
                    : "",
            defaultSession:
                typeof parsed.defaultSession === "string"
                    ? parsed.defaultSession
                    : "",
            defaultTerm: TERMS.includes(parsed.defaultTerm)
                ? parsed.defaultTerm
                : DEFAULT_SETTINGS.defaultTerm,
            gradingScale,
        };
    } catch {
        return cloneSettings(DEFAULT_SETTINGS);
    }
}

function validateSettings(data) {
    if (!data.schoolName.trim()) {
        return "School name is required.";
    }

    if (!data.principalName.trim()) {
        return "Principal's name is required.";
    }

    const session = data.defaultSession.trim();

    if (session) {
        const match = session.match(/^(\d{4})\s*\/\s*(\d{4})$/);

        if (!match) {
            return "Enter the academic session in the format 2026/2027.";
        }

        const startYear = Number(match[1]);
        const endYear = Number(match[2]);

        if (endYear !== startYear + 1) {
            return "The ending year must be one year after the starting year.";
        }
    }

    if (!TERMS.includes(data.defaultTerm)) {
        return "Please select a valid academic term.";
    }

    if (
        !Array.isArray(data.gradingScale) ||
        data.gradingScale.length !== GRADES.length
    ) {
        return "The grading scale must contain grades A to F.";
    }

    for (let i = 0; i < data.gradingScale.length; i += 1) {
        const item = data.gradingScale[i];

        if (item.grade !== GRADES[i]) {
            return "Grades must remain in the order A, B, C, D, E, F.";
        }

        if (
            item.minScore === "" ||
            !Number.isInteger(Number(item.minScore)) ||
            Number(item.minScore) < 0 ||
            Number(item.minScore) > 100
        ) {
            return `Grade ${item.grade} must have a whole-number score between 0 and 100.`;
        }

        if (
            typeof item.remark !== "string" ||
            !item.remark.trim()
        ) {
            return `Please enter a remark for grade ${item.grade}.`;
        }

        if (i > 0) {
            const previousScore = Number(
                data.gradingScale[i - 1].minScore
            );

            if (Number(item.minScore) >= previousScore) {
                return "Each grade's minimum score must be lower than the grade above it.";
            }
        }
    }

    if (Number(data.gradingScale[5].minScore) !== 0) {
        return "Grade F must start at 0.";
    }

    return "";
}

export default function Settings() {
    const [formData, setFormData] = useState(loadSettings);
    const [savedData, setSavedData] = useState(loadSettings);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    function clearFeedback() {
        setMessage("");
        setError("");
    }

    function handleChange(event) {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));

        clearFeedback();
    }

    function handleGradeChange(index, field, value) {
        setFormData((previous) => ({
            ...previous,
            gradingScale: previous.gradingScale.map((item, i) =>
                i === index
                    ? {
                        ...item,
                        [field]:
                            field === "minScore"
                                ? value === ""
                                    ? ""
                                    : Number(value)
                                : value,
                    }
                    : item
            ),
        }));

        clearFeedback();
    }

    function handleSave(event) {
        event.preventDefault();
        clearFeedback();

        const validationError = validateSettings(formData);

        if (validationError) {
            setError(validationError);
            return;
        }

        const settings = {
            ...formData,
            schoolName: formData.schoolName.trim(),
            principalName: formData.principalName.trim(),
            address: formData.address.trim(),
            phone: formData.phone.trim(),
            email: formData.email.trim(),
            defaultSession: formData.defaultSession
                .trim()
                .replace(/\s*\/\s*/, "/"),
            gradingScale: formData.gradingScale.map((item) => ({
                ...item,
                minScore: Number(item.minScore),
                remark: item.remark.trim(),
            })),
        };

        try {
            localStorage.setItem(
                SETTINGS_KEY,
                JSON.stringify(settings)
            );

            const cleanSettings = cloneSettings(settings);

            setFormData(cleanSettings);
            setSavedData(cloneSettings(settings));
            setMessage("All settings saved successfully.");
        } catch {
            setError(
                "Unable to save settings. Browser storage may be unavailable or full."
            );
        }
    }

    function handleReset() {
        // Restore the last successfully saved copy.
        const restoredSettings = cloneSettings(savedData);

        setFormData(restoredSettings);
        setMessage("Unsaved changes have been discarded.");
        setError("");
    }

    const schoolFields = [
        {
            name: "schoolName",
            label: "School Name",
            placeholder: "Enter school name",
            required: true,
        },
        {
            name: "principalName",
            label: "Principal's Name",
            placeholder: "Enter principal's name",
            required: true,
        },
        {
            name: "address",
            label: "School Address",
            placeholder: "Enter school address",
            fullWidth: true,
        },
        {
            name: "phone",
            label: "Phone Number",
            placeholder: "Enter school phone number",
            type: "tel",
        },
        {
            name: "email",
            label: "School Email",
            placeholder: "Enter school email",
            type: "email",
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-5xl space-y-6">
                <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-green-100 p-3 text-green-800">
                        <SettingsIcon size={26} />
                    </div>

                    <div>
                        <h1 className="text-2xl font-bold text-green-950 sm:text-3xl">
                            Admin Settings
                        </h1>
                        <p className="mt-1 text-sm text-gray-500">
                            Manage school information, academic preferences,
                            and grading rules.
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSave} className="space-y-6">
                    <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                        <div className="flex items-center gap-3 border-b border-gray-100 px-5 py-5 sm:px-7">
                            <School className="text-green-800" size={22} />
                            <div>
                                <h2 className="text-lg font-bold text-green-950">
                                    School Information
                                </h2>
                                <p className="mt-1 text-sm text-gray-500">
                                    Update your school's official details.
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2 sm:p-7">
                            {schoolFields.map((field) => (
                                <div
                                    key={field.name}
                                    className={
                                        field.fullWidth ? "sm:col-span-2" : ""
                                    }
                                >
                                    <label
                                        htmlFor={field.name}
                                        className="mb-2 block text-sm font-semibold text-gray-700"
                                    >
                                        {field.label}
                                        {field.required && (
                                            <span className="ml-1 text-red-500">
                                                *
                                            </span>
                                        )}
                                    </label>


                                    <input
                                        id={field.name}
                                        name={field.name}
                                        type={field.type || "text"}
                                        value={formData[field.name]}
                                        onChange={handleChange}
                                        placeholder={field.placeholder}
                                        required={field.required || false}
                                        readOnly={
                                            field.name === "schoolName" ||
                                            field.name === "principalName"
                                        }
                                        className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition ${field.name === "schoolName" ||
                                                field.name === "principalName"
                                                ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-500"
                                                : "border-gray-300 bg-white text-gray-800 placeholder:text-gray-400 focus:border-green-700 focus:ring-2 focus:ring-green-100"
                                            }`}
                                    />

                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                        <div className="flex items-center gap-3 border-b border-gray-100 px-5 py-5 sm:px-7">
                            <GraduationCap className="text-green-800" size={24} />
                            <div>
                                <h2 className="text-lg font-bold text-green-950">
                                    Academic Preferences
                                </h2>
                                <p className="mt-1 text-sm text-gray-500">
                                    Choose your default session and term.
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2 sm:p-7">
                            <div>
                                <label
                                    htmlFor="defaultSession"
                                    className="mb-2 block text-sm font-semibold text-gray-700"
                                >
                                    Default Academic Session
                                </label>
                                <input
                                    id="defaultSession"
                                    name="defaultSession"
                                    type="text"
                                    value={formData.defaultSession}
                                    onChange={handleChange}
                                    placeholder="e.g. 2026/2027"
                                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-100"
                                />
                                <p className="mt-2 text-xs text-gray-500">
                                    The ending year must be one year after the starting year.
                                </p>
                            </div>

                            <div>
                                <label
                                    htmlFor="defaultTerm"
                                    className="mb-2 block text-sm font-semibold text-gray-700"
                                >
                                    Default Term
                                </label>
                                <select
                                    id="defaultTerm"
                                    name="defaultTerm"
                                    value={formData.defaultTerm}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-100"
                                >
                                    {TERMS.map((term) => (
                                        <option key={term} value={term}>
                                            {term}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </section>

                    <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                        <div className="flex items-center gap-3 border-b border-gray-100 px-5 py-5 sm:px-7">
                            <Award className="text-green-800" size={23} />
                            <div>
                                <h2 className="text-lg font-bold text-green-950">
                                    Grading Configuration
                                </h2>
                                <p className="mt-1 text-sm text-gray-500">
                                    Configure score boundaries and performance remarks.
                                </p>
                            </div>
                        </div>

                        <div className="p-5 sm:p-7">
                            <div className="mb-5 flex items-start gap-3 rounded-xl bg-amber-50 p-4 text-sm text-amber-900">
                                <Info size={20} className="mt-0.5 shrink-0" />
                                <p className="leading-6">
                                    Enter minimum scores from highest to lowest.
                                    Grade F must start at 0, and each grade must
                                    have a lower threshold than the grade above it.
                                </p>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[520px] text-left text-sm">
                                    <thead>
                                        <tr className="border-b border-gray-200 text-gray-500">
                                            <th className="px-3 py-3 font-semibold">Grade</th>
                                            <th className="px-3 py-3 font-semibold">Minimum Score</th>
                                            <th className="px-3 py-3 font-semibold">Remark</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {formData.gradingScale.map((item, index) => (
                                            <tr
                                                key={item.grade}
                                                className="border-b border-gray-100 last:border-0"
                                            >
                                                <td className="px-3 py-4">
                                                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 font-bold text-green-900">
                                                        {item.grade}
                                                    </span>
                                                </td>
                                                <td className="px-3 py-4">
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        max="100"
                                                        step="1"
                                                        value={item.minScore}
                                                        onChange={(event) =>
                                                            handleGradeChange(
                                                                index,
                                                                "minScore",
                                                                event.target.value
                                                            )
                                                        }
                                                        aria-label={`Minimum score for grade ${item.grade}`}
                                                        className="w-28 rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100"
                                                    />
                                                </td>
                                                <td className="px-3 py-4">
                                                    <input
                                                        type="text"
                                                        value={item.remark}
                                                        onChange={(event) =>
                                                            handleGradeChange(
                                                                index,
                                                                "remark",
                                                                event.target.value
                                                            )
                                                        }
                                                        aria-label={`Remark for grade ${item.grade}`}
                                                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100"
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="mt-5 rounded-xl bg-gray-50 p-4">
                                <p className="mb-3 text-sm font-semibold text-gray-700">
                                    Current grading scale
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {formData.gradingScale.map((item) => (
                                        <span
                                            key={item.grade}
                                            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-700"
                                        >
                                            <strong className="text-green-800">
                                                {item.grade}
                                            </strong>{" "}
                                            {item.minScore}+
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    {error && (
                        <div
                            role="alert"
                            className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
                        >
                            <Info size={20} className="mt-0.5 shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    {message && (
                        <div
                            role="status"
                            aria-live="polite"
                            className="flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800"
                        >
                            <CheckCircle size={20} className="mt-0.5 shrink-0" />
                            <span>{message}</span>
                        </div>
                    )}

                    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                        <button
                            type="button"
                            onClick={handleReset}
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
                        >
                            <RotateCcw size={17} />
                            Discard Changes
                        </button>

                        <button
                            type="submit"
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-800 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-900 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2"
                        >
                            <Save size={17} />
                            Save All Settings
                        </button>
                    </div>
                </form>

                <p className="text-xs leading-5 text-gray-500">
                    Settings are stored in this browser on this device.
                    They are not synchronized across devices or users.
                    Grading changes will not affect result calculations until
                    the Results and Report Cards components are connected
                    to this configuration.
                </p>
            </div>
        </div>
    );
}
