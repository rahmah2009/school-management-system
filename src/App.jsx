import Sidebar from "./components/Sidebar"
import StudentList from "./components/StudentList"
import { useState, useEffect } from "react"
import Dashboard from "./components/Dashboard"
import TeacherList from "./components/TeacherList"
import ClassesList from "./components/ClassesList"
import AddStudent from "./components/AddStudents"

const teachers = [
  {
    id: 1,
    name: "Mr. Bidemi"
  },
  {
    id: 2,
    name: "Mrs. Ahmad"
  },
  {
    id: 3,
    name: "Mr.AbulRahman"
  },
  {
    id: 4,
    name: "Mr. Kamaldeen"
  },
  {
    id: 5,
    name: "Mrs Adeleke"
  }
]

const classes = [
  {
    id: 1,
    name: "JSS1"
  },
  {
    id: 2,
    name: "JSS2"
  },
  {
    id: 3,
    name: "JSS3"
  },
  {
    id: 4,
    name: "SS1"
  },
  {
    id: 5,
    name: "SS2"
  },
  {
    id: 6,
    name: "SS3"
  }
]

function App() {
  const [activePage, setActivePage] = useState("Dashboard")
  const [students, setStudents] = useState(() => {
    const savedStudents = localStorage.getItem("students")

    if (savedStudents) {
      return JSON.parse(savedStudents)
    }
    return []

    //   return [
    //     { id: 1, name: "Muhammad Garba", class: "SS1" },
    //     { id: 2, name: "Aishah Ibrahim", class: "SS1" },
    //     { id: 3, name: "Abdullah Musa", class: "SS3" },
    //     { id: 4, name: "Fatimah Yusuf", class: "JSS3" },
    //     { id: 5, name: "Fatimah Bello", class: "JSS3" },
    //     { id: 6, name: "Fatimah Bello", class: "JSS3" },
    //     { id: 7, name: "Fatimah Bello", class: "JSS3" },
    //     { id: 8, name: "Fatimah Bello", class: "JSS3" },
    //     { id: 9, name: "Fatimah Bello", class: "JSS3" },
    //     { id: 10, name: "Fatimah Bello", class: "JSS3" },
    //     { id: 11, name: "Fatimah Bello", class: "JSS3" }
    //   ]
  })

  useEffect(() => {
    localStorage.setItem("students", JSON.stringify(students))
  }, [students])


  return (
    <div className="app">
      <Sidebar
        schoolName="Greenfield School"
        activePage={activePage}
        setActivePage={setActivePage}
      />
      <main className="content">

        {activePage === "Dashboard" && (
          <Dashboard
            students={students}
            teachers={teachers}
            classes={classes}
          />
        )}

        {activePage === "Students" && (
          <div>
            <h2>Students</h2>

            <StudentList
              students={students}
              setStudents={setStudents}
            />
          </div>
        )}

        {activePage === "Add Student" && (
          <div>
            <AddStudent
              setStudents={setStudents}
              students={students}
            />
          </div>
        )}

        {activePage === "Teachers" && (
          <div>
            <h2>Teachers</h2>
            <TeacherList teachers={teachers} />
          </div>
        )}

        {activePage === "Classes" && (
          <div>
            <h2>Classes</h2>
            <ClassesList classes={classes} />
          </div>
        )}

      </main>
    </div>
  )
}

export default App