import { useState } from "react"
import Modal from "./modal"

function StudentList({ students, setStudents }) {
    const [studentToDelete, setStudentToDelete] = useState(null)
    const [studentToEdit, setStudentToEdit] = useState(null)
    const [searchTerm, setSearchTerm] = useState("")

    function handleDelete(studentId) {
        setStudents((previousStudents) =>
            previousStudents.filter((student) => student.id !== studentId)
        )
    }

    function handleEdit() {
        setStudents((previousStudents) =>
        previousStudents.map((student) =>
            student.id === studentToEdit.id ? studentToEdit : student
        ))
        setStudentToEdit(null)
    }

    return (
        <div className="student-list">

            {students.map((student) => (
                <div key={student.id} className="card">
                    <p>ID: {student.id}</p>
                    <h3>{student.name}</h3>
                    <p>Class: {student.class}</p>

                    <button onClick={() => setStudentToEdit(student)}>
                        Save Changes
                    </button>

                    <button onClick={() => setStudentToDelete(student)}>
                        Delete
                    </button>
                </div>
            ))}

            {studentToDelete && (
                <Modal>
                    <h3>Delete Student?</h3>

                    <p>
                        Are you sure you want to delete {studentToDelete.name}?
                    </p>

                    <button
                        onClick={() => {
                            handleDelete(studentToDelete.id)
                            setStudentToDelete(null)
                        }}
                    >
                        Delete
                    </button>

                    <button onClick={() => setStudentToDelete(null)}>
                        Cancel
                    </button>
                </Modal>
            )}

            {studentToEdit && (
                <Modal>
                    <h3>Edit Student?</h3>
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
                    <button onClick={handleEdit}>
                        Save Changes
                    </button>

                    <button onClick={() => setStudentToEdit(null)}>
                        Cancel
                    </button>
                </Modal>
            )}
        </div>
    )
}

export default StudentList