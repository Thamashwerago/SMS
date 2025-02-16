import { useState, useEffect } from "react";
import { fetchStudents, addStudent, updateStudent, deleteStudent } from "../api/api";
import Button from "../components/Button";

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    const { data } = await fetchStudents();
    setStudents(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await updateStudent(editingId, formData);
    } else {
      await addStudent(formData);
    }
    setFormData({ name: "", email: "" });
    setEditingId(null);
    loadStudents();
  };

  const handleEdit = (student) => {
    setEditingId(student.id);
    setFormData({ name: student.name, email: student.email });
  };

  const handleDelete = async (id) => {
    await deleteStudent(id);
    loadStudents();
  };

  const filteredStudents = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Student Management</h2>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by name or email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-2 mb-4 border border-gray-300 rounded-lg"
      />

      {/* Add/Edit Student Form */}
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow mb-4">
        <input
          type="text"
          placeholder="Student Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          className="w-full p-2 mb-2 border border-gray-300 rounded-lg"
        />
        <input
          type="email"
          placeholder="Student Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
          className="w-full p-2 mb-2 border border-gray-300 rounded-lg"
        />
        <Button variant="primary" type="submit">{editingId ? "Update" : "Add"} Student</Button>
      </form>

      {/* Students Table */}
      <div className="bg-white p-4 rounded-lg shadow">
        <table className="w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">ID</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => (
              <tr key={student.id} className="hover:bg-gray-50">
                <td className="border p-2">{student.id}</td>
                <td className="border p-2">{student.name}</td>
                <td className="border p-2">{student.email}</td>
                <td className="border p-2">
                  <Button variant="secondary" onClick={() => handleEdit(student)}>Edit</Button>
                  <Button variant="danger" onClick={() => handleDelete(student.id)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentManagement;
