import { useState, useEffect } from "react";
import Button from "./Button"

function AddStudent({ students, setStudents }) {
    const [studentName, setStudentName] = useState("")
    const [gender, setGender] = useState("")
    const [dateOfBirth, setDateOfBirth] = useState("")
    const [studentClass, setStudentClass] = useState("")
    const [admissionDate, setAdmissionDate] = useState("")
    const [session, setSession] = useState("")
    const [parentName, setParentName] = useState("")
    const [parentPhone, setParentPhone] = useState("")
    const [address, setAddress] = useState("")
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                setError("")
            }, 2000)

            return () => clearTimeout(timer)
        }
    }, [error])

    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => {
                setSuccess("")
            }, 3000)

            return () => clearTimeout(timer)
        }
    }, [success])

    function handleSubmit(event) {
        event.preventDefault()

        if (studentName.trim() === "") {
            setError("Please enter the student name")
            return
        }

        if (gender === "") {
            setError("Please select the student's gender")
            return
        }

        if (dateOfBirth === "") {
            setError("Please select the date of birth")
            return
        }

        if (studentClass === "") {
            setError("Please select a class")
            return
        }

        if (admissionDate === "") {
            setError("Please select the admission date")
            return
        }

        if (session === "") {
            setError("Please select a session")
            return
        }

        if (parentName.trim() === "") {
            setError("Please enter the parent/guardian name")
            return
        }

        if (parentPhone.trim() === "") {
            setError("Please enter the parent/guardian phone number")
            return
        }

        if (address.trim() === "") {
            setError("Please enter the student's address")
            return
        }

        setError("")

        const newStudent = {
            id: students.length + 1,
            name: studentName,
            gender: gender,
            dateOfBirth: dateOfBirth,
            class: studentClass,
            admissionDate: admissionDate,
            session: session,
            parentName: parentName,
            parentPhone: parentPhone,
            address: address
        }

        setStudents((previousStudents) => [
            ...previousStudents,
            newStudent
        ])

        setSuccess(`${studentName} was added successfully!`)

        setStudentName("")
        setGender("")
        setDateOfBirth("")
        setStudentClass("")
        setAdmissionDate("")
        setSession("")
        setParentName("")
        setParentPhone("")
        setAddress("")
    }

    return (
        <div className="add-student-page">

            <h2>Add New Student</h2>
            <p>Enter the student's information below.</p>

            <form onSubmit={handleSubmit}>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="success-message">
                        {success}
                    </div>
                )}

                <label>
                    Student Name:

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
                    Gender:

                    <select
                        value={gender}
                        onChange={(event) =>
                            setGender(event.target.value)
                        }
                    >
                        <option value="">Select gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                </label>

                <label>
                    Date of Birth:

                    <input
                        type="date"
                        value={dateOfBirth}
                        onChange={(event) =>
                            setDateOfBirth(event.target.value)
                        }
                    />
                </label>

                <label>
                    Class:

                    <select
                        value={studentClass}
                        onChange={(event) =>
                            setStudentClass(event.target.value)
                        }
                    >
                        <option value="">Select a class</option>
                        <option value="JSS1">JSS1</option>
                        <option value="JSS2">JSS2</option>
                        <option value="JSS3">JSS3</option>
                        <option value="SS1">SS1</option>
                        <option value="SS2">SS2</option>
                        <option value="SS3">SS3</option>
                    </select>
                </label>

                <label>
                    Admission Date:

                    <input
                        type="date"
                        value={admissionDate}
                        onChange={(event) =>
                            setAdmissionDate(event.target.value)
                        }
                    />
                </label>

                <label>
                    Session:

                    <select
                        value={session}
                        onChange={(event) =>
                            setSession(event.target.value)
                        }
                    >
                        <option value="">Select session</option>
                        <option value="2025/2026">2025/2026</option>
                        <option value="2026/2027">2026/2027</option>
                        <option value="2027/2028">2027/2028</option>
                    </select>
                </label>

                <label>
                    Parent/Guardian Name:

                    <input
                        type="text"
                        placeholder="Enter parent/guardian name"
                        value={parentName}
                        onChange={(event) =>
                            setParentName(event.target.value)
                        }
                    />
                </label>

                <label>
                    Parent/Guardian Phone:

                    <input
                        type="tel"
                        placeholder="Enter phone number"
                        value={parentPhone}
                        onChange={(event) =>
                            setParentPhone(event.target.value)
                        }
                    />
                </label>

                <label>
                    Address:

                    <textarea
                        placeholder="Enter student's address"
                        value={address}
                        onChange={(event) =>
                            setAddress(event.target.value)
                        }
                    />
                </label>

                <Button type="submit">
                    Add Student
                </Button>

            </form>
        </div>

    )
}

export default AddStudent