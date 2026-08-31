import StatCard from "./StatCard"

function Dashboard({ students, teachers, classes }) {

    return (
        <div>
            <p>Welcome to Greenfields School's management dashboard.</p>
            <div className="stats">
                <StatCard title="TOTAL STUDENTS" value={students.length} />
                <StatCard title="TOTAL TEACHERS" value={teachers.length} />
                <StatCard title="TOTAL CLASSES" value={classes.length} />
            </div>
        </div>
    )
}

export default Dashboard