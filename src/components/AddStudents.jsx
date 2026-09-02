import { useState, useEffect } from "react";

function AddStudent({ students, setStudents }) {
    const [studentName, setStudentName] = useState("")
    const [studentClass, setStudentClass] = useState("")
    const [error, setError] = useState("")

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                setError("")
            }, 2000)

            return () => clearTimeout(timer)
        }
    }, [error])

    function handleSubmit(event) {
        event.preventDefault()

        if (studentName === "") {
            setError("Please enter the student name")
            return
        }

        if (studentClass === "") {
            setError("Please select a class")
            return
        }

        setError("")

        const newStudent = {
            id: students.length + 1,
            name: studentName,
            class: studentClass
        }
        setStudents((previousStudents) => [
            ...previousStudents,
            newStudent
        ])
        setStudentName("")
        setStudentClass("")
    }
    return (
        <div className="add-student">
            <h2>Add Student</h2>
            {error && (
                <div className="error-message">
                    {error}
                    {/* <span>{error}</span>
                    <button onClick={() => setError("")}>
                        x
                    </button> */}
                </div>
            )}

            <form onSubmit={handleSubmit}>

                <label>
                    Student Name

                    <input
                        placeholder="Input student Surname and Lastname..."
                        type="text"
                        value={studentName}
                        onChange={(event) =>
                            setStudentName(event.target.value)
                        }
                    />
                </label>

                <label>
                    Class

                    <select
                        value={studentClass}
                        onChange={(event) =>
                            setStudentClass(event.target.value)
                        }
                    >
                        <option value="">Select a class</option>
                        <option>JSS1</option>
                        <option>JSS2</option>
                        <option>JSS3</option>
                        <option>SS1</option>
                        <option>SS2</option>
                        <option>SS3</option>
                    </select>
                </label>

                <button type="submit">Add Student</button>

            </form>
        </div>
    )
}

export default AddStudent