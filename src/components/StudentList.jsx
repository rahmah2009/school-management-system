function StudentList({students}) {
    return(
        <div className="student-list">
            {students.map((student) => (
                <div key={student.id} className="card">
                    <p>ID: {student.id}</p>
                    <h3>{student.name}</h3>
                    <p>Class: {student.class}</p>
                </div>
            )
            )
            }
        </div>
    )
}

export default StudentList