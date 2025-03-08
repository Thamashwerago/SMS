// src/pages/Dashboard.tsx
import { useEffect, useState } from "react";
import { getStudents } from "../services/studentService";
import { Student } from "../types/Student";
import StudentTable from "../components/StudentTable";
import StudentCard from "../components/StudentCard";
import StudentChart from "../components/StudentChart";
import StudentFilter from "../components/StudentFilter";

const Dashboard = () => {
    const [students, setStudents] = useState<Student[]>([]);
    const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const data = await getStudents();
                setStudents(data);
                setFilteredStudents(data); // Default: show all students
            } catch (error) {
                console.error("Error fetching students:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStudents();
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Student Dashboard</h1>

            {/* Dashboard Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <StudentCard title="Total Students" count={students.length} />
                <StudentCard title="Active Students" count={students.filter(s => s.isActive).length} />
                <StudentCard title="Inactive Students" count={students.filter(s => !s.isActive).length} />
            </div>

            {/* Student Charts */}
            <StudentChart students={students} />

            {/* Student Filtering */}
            <StudentFilter students={students} setFilteredStudents={setFilteredStudents} />

            {/* Student List Table */}
            {loading ? <p>Loading...</p> : <StudentTable students={filteredStudents} />}
        </div>
    );
};

export default Dashboard;
