import { useState } from "react"

function AddStudent() {
    return (
        <div>
            <h2>Add Student</h2>

            <form>
                <label>
                    Student Name
                    <input type="text" />
                </label>

                <label>
                    Class
                    <select>
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