import { useEffect, useState } from "react";
import { getTeachers, getTeacherById, createTeacher, updateTeacher, deleteTeacher } from "./api";
import './App.css'

function App() {
    const [teachers, setTeachers] = useState([]);
    const [teacher, setTeacher] = useState({ name: "", email: "" });
    const [teacherId, setTeacherId] = useState("");

    useEffect(() => {
        fetchTeachers();
    }, []);

    const fetchTeachers = async () => {
        try {
            const response = await getTeachers();
            setTeachers(response.data);
        } catch (error) {
            console.error("Error fetching teachers:", error);
        }
    };

    const handleCreate = async () => {
        try {
            await createTeacher(teacher);
            fetchTeachers(); // Refresh list
            setTeacher({ name: "", email: "" });
        } catch (error) {
            console.error("Error creating teacher:", error);
        }
    };

    const handleUpdate = async () => {
        if (!teacherId) {
            alert("Please enter a valid ID to update.");
            return;
        }
        try {
            await updateTeacher(teacherId, teacher);
            fetchTeachers(); // Refresh list
            setTeacher({ name: "", email: "" });
            setTeacherId("");
        } catch (error) {
            console.error("Error updating teacher:", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteTeacher(id);
            fetchTeachers(); // Refresh list
        } catch (error) {
            console.error("Error deleting teacher:", error);
        }
    };

    return (
        <div className="container">
            <h2>Teacher Management</h2>
            
            {/* Display Teachers */}
            <ul>
                {teachers.map((t) => (
                    <li key={t.id}>
                        {t.name} - {t.email}{" "}
                        <button onClick={() => handleDelete(t.id)}>❌ Delete</button>
                    </li>
                ))}
            </ul>

            {/* Create Teacher */}
            <h3>Create Teacher</h3>
            <input
                type="text"
                placeholder="Name"
                value={teacher.name}
                onChange={(e) => setTeacher({ ...teacher, name: e.target.value })}
            />
            <input
                type="email"
                placeholder="Email"
                value={teacher.email}
                onChange={(e) => setTeacher({ ...teacher, email: e.target.value })}
            />
            <button onClick={handleCreate}>➕ Add</button>

            {/* Update Teacher */}
            <h3>Update Teacher</h3>
            <input
                type="number"
                placeholder="ID"
                value={teacherId}
                onChange={(e) => setTeacherId(e.target.value)}
            />
            <button onClick={handleUpdate}>✏️ Update</button>
        </div>
    );
}

export default App;
