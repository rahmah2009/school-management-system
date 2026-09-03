import { useState, useEffect } from "react"
import Modal from "./Modal"
import Button from "./Button"

function StudentList({ students, setStudents }) {
    const [studentToDelete, setStudentToDelete] = useState(null)
    const [studentToEdit, setStudentToEdit] = useState(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [editError, setEditError] = useState("")

    useEffect(() => {
        if (editError) {
            const timer = setTimeout(() => {
                setEditError("")
            }, 2000)

            return () => clearTimeout(timer)
        }
    }, [editError])

    function handleDelete(studentId) {
        setStudents((previousStudents) =>
            previousStudents.filter((student) => student.id !== studentId)
        )
    }

    function handleEdit() {
        if (studentToEdit.name === "") {
            setEditError("Please enter the student name")
            return
        }

        if (studentToEdit.class === "") {
            setEditError("Please select a class")
            return
        }

        setStudents((previousStudents) =>
            previousStudents.map((student) =>
                student.id === studentToEdit.id ? studentToEdit : student
            )
        )

        setStudentToEdit(null)
    }

    const filteredStudents = students.filter((student) =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="student-list">

            <input
                type="text"
                className="search-input"
                value={searchTerm}
                onChange={(event) =>
                    setSearchTerm(event.target.value)
                }
                placeholder="Search Student..."
            />

            {filteredStudents.map((student) => (
                <div key={student.id} className="card">

                    <p>ID: {student.id}</p>

                    <h3>{student.name}</h3>

                    <p>Gender: {student.gender}</p>

                    <p>Date of Birth: {student.dateOfBirth}</p>

                    <p>Class: {student.class}</p>

                    <p>Admission Date: {student.admissionDate}</p>

                    <p>Session: {student.session}</p>

                    <p>Parent/Guardian: {student.parentName}</p>

                    <p>Parent Phone: {student.parentPhone}</p>

                    <p>Address: {student.address}</p>

                    <div className="btn-group">
                        <Button
                            onClick={() => {
                                setStudentToEdit(student)
                                setEditError("")
                            }}
                        >
                            Edit
                        </Button>

                        <Button onClick={() => setStudentToDelete(student)}>
                            Delete
                        </Button>
                    </div>

                </div>
            ))}

            {students.length === 0 ? (
                <p>No students added yet.</p>
            ) : filteredStudents.length === 0 ? (
                <p>No student with this name found.</p>
            ) : null}

            {studentToDelete && (
                <Modal>
                    <h3>Delete Student?</h3>

                    <p>
                        Are you sure you want to delete {studentToDelete.name}?
                    </p>

                    <div className="btn-group">
                        <Button
                            onClick={() => {
                                handleDelete(studentToDelete.id)
                                setStudentToDelete(null)
                            }}
                        >
                            Delete
                        </Button>

                        <Button onClick={() => setStudentToDelete(null)}>
                            Cancel
                        </Button>
                    </div>

                </Modal>
            )}

            {studentToEdit && (
                <Modal>
                    <h3>Edit Student?</h3>
                    {editError && (
                        <div className="error-message">
                            {editError}
                        </div>
                    )}
                    <label>
                        Student Name:

                        <input
                            type="text"
                            value={studentToEdit.name}
                            onChange={(event) =>
                                setStudentToEdit({
                                    ...studentToEdit,
                                    name: event.target.value
                                })
                            }
                        />
                    </label>

                    <label>
                        Class:

                        <select
                            value={studentToEdit.class}
                            onChange={(event) =>
                                setStudentToEdit({
                                    ...studentToEdit,
                                    class: event.target.value
                                })
                            }
                        >
                            <option value="JSS1">JSS1</option>
                            <option value="JSS2">JSS2</option>
                            <option value="JSS3">JSS3</option>
                            <option value="SS1">SS1</option>
                            <option value="SS2">SS2</option>
                            <option value="SS3">SS3</option>
                        </select>
                    </label>
                    <div className="btn-group">
                        <Button onClick={handleEdit}>
                            Save Changes
                        </Button>

                        <Button onClick={() => setStudentToEdit(null)}>
                            Cancel
                        </Button>
                    </div>

                </Modal>
            )}
        </div>
    )
}

export default StudentList