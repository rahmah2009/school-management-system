function ClassesList({classes}) {
    return(
        <div className="classes-list">
            {classes.map((schoolClass) => (
                <div key={schoolClass.id} className="card">
                    <p>ID: {schoolClass.id}</p>
                    <h3>{schoolClass.name}</h3>
                </div>
            )
            )
            }
        </div>
    )
}

export default ClassesList