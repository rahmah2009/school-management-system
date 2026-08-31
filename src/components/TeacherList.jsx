function TeacherList({teachers}) {
    return(
        <div className="teacher-list">
            {teachers.map((teacher) => (
                <div key={teacher.id} className="card">
                    <p>ID: {teacher.id}</p>
                    <h3>{teacher.name}</h3>
                </div>
            )
            )
            }
        </div>
    )
}

export default TeacherList