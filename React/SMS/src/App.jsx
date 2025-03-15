import { useEffect, useState } from "react";
import axios from "axios";

function App() {
    const [teachers, setTeachers] = useState([]);
    const [teacher, setTeacher] = useState({ name: "", email: "", phone: "",address: "",dob: "",gender: "",status: "",role: "" });
    const BASE_URL = "http://localhost:8080/api/teachers";


    useEffect(() => {
        fetchTeachers();
    }, []);

    const fetchTeachers = async () => {
        try {
            const response = await axios.get(BASE_URL);
            setTeachers(response.data);
        } catch (error) {
            console.error("Error fetching teachers:", error);
        }
    };

    const fetchTeacher = async (id) => {
        try {
            const response = await axios.get(`${BASE_URL}/${id}`);
            setTeacher(response.data);
        } catch (error) {
            console.error("Error fetching teacher:", error);
        }
    };

    const handleCreate = async () => {
        try {
            await axios.post(BASE_URL, teacher);
            fetchTeachers(); // Refresh list
            setTeacher({ name: "", email: "", phone: "",address: "",dob: "",gender: "",status: "",role: "" });
        } catch (error) {
            console.error("Error creating teacher:", error);
        }
    };

    const handleUpdate = async (i,id) => {
        try {
            await axios.put(`${BASE_URL}/${id}`, teachers[i]);
            fetchTeachers(); // Refresh list
        } catch (error) {
            console.error("Error updating teacher:", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${BASE_URL}/${id}`);
            fetchTeachers(); // Refresh list
        } catch (error) {
            console.error("Error deleting teacher:", error);
        }
    };

    return (
        <div className="container">
            <h2>Teacher Management</h2>
            <table>
                <tbody>
            <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Address</th>
                <th>DOB</th>
                <th>Gender</th>
                <th>Status</th>
                <th>Role</th>
            </tr>
            <tr>
            <td>
            <input
                type="text"
                placeholder="Name"
                value={teacher.name}
                onChange={(e) => setTeacher({ ...teacher, name: e.target.value })}
            />
            </td>
            <td>
            <input
                type="email"
                placeholder="Email"
                value={teacher.email}
                onChange={(e) => setTeacher({ ...teacher, email: e.target.value })}
            />
            </td>
            <td>
            <input
                type="text"
                placeholder="Phone"
                value={teacher.phone}
                onChange={(e) => setTeacher({ ...teacher, phone: e.target.value })}
            />
            </td>
            <td>
            <input
                type="text"
                placeholder="Address"
                value={teacher.address}
                onChange={(e) => setTeacher({ ...teacher, address: e.target.value })}
            />
            </td>
            <td>
            <input
                type="date"
                placeholder="DOB"
                value={teacher.dob}
                onChange={(e) => setTeacher({ ...teacher, dob: e.target.value })}
            />
            </td>
            <td>
            <input
                type="text"
                placeholder="Gender"
                value={teacher.gender}
                onChange={(e) => setTeacher({ ...teacher, gender: e.target.value })}
            />
            </td>
            <td>
            <input
                type="text"
                placeholder="Status"
                value={teacher.status}
                onChange={(e) => setTeacher({ ...teacher, status: e.target.value })}
            />
            </td>
            <td>
            <input
                type="text"
                placeholder="Role"
                value={teacher.role}
                onChange={(e) => setTeacher({ ...teacher, role: e.target.value })}
            />
            </td>
            <td>
            <button onClick={handleCreate}>➕ Add</button>
            </td>
            </tr>
                {teachers.map((t,i) => (
                    <tr key={t.id}>
                        <td>
                        <input
                            type="text"
                            placeholder="Name"
                            value={t.name}
                            onChange={(e) => setTeachers([...teachers.slice(0,i),{...t, name: e.target.value},...teachers.slice(i+1)])}
                        />
                        </td>
                        <td>
                        <input
                            type="email"
                            placeholder="Email"
                            value={t.email}
                            onChange={(e) => setTeachers([...teachers.slice(0,i),{...t, email: e.target.value},...teachers.slice(i+1)])}
                        />
                        </td>
                        <td>
                        <input
                            type="text"
                            placeholder="Phone"
                            value={t.phone}
                            onChange={(e) => setTeachers([...teachers.slice(0,i),{...t, phone: e.target.value},...teachers.slice(i+1)])}
                        />
                        </td>
                        <td>
                        <input
                            type="text"
                            placeholder="Address"
                            value={t.address}
                            onChange={(e) => setTeachers([...teachers.slice(0,i),{...t, address: e.target.value},...teachers.slice(i+1)])}
                        />
                        </td>
                        <td>
                        <input
                            type="date"
                            placeholder="DOB"
                            value={t.dob}
                            onChange={(e) => setTeachers([...teachers.slice(0,i),{...t, dob: e.target.value},...teachers.slice(i+1)])}
                        />
                        </td>
                        <td>
                        <input
                            type="text"
                            placeholder="Gender"
                            value={t.gender}
                            onChange={(e) => setTeachers([...teachers.slice(0,i),{...t, gender: e.target.value},...teachers.slice(i+1)])}
                        />
                        </td>
                        <td>
                        <input
                            type="text"
                            placeholder="Status"
                            value={t.status}
                            onChange={(e) => setTeachers([...teachers.slice(0,i),{...t, status: e.target.value},...teachers.slice(i+1)])}
                        />
                        </td>
                        <td>
                        <input
                            type="text"
                            placeholder="Role"
                            value={t.role}
                            onChange={(e) => setTeachers([...teachers.slice(0,i),{...t, role: e.target.value},...teachers.slice(i+1)])}
                        />
                        </td>
                        <td><button onClick={() => handleDelete(t.id)}>❌ Delete</button></td>
                        <td><button onClick={() => handleUpdate(i,t.id)}>✏️ Update</button></td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default App;
