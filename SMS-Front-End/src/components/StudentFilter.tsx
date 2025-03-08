// src/components/StudentFilter.tsx
import { useState } from "react";
import { Student } from "../types/Student";

interface Props {
    students: Student[];
    setFilteredStudents: (students: Student[]) => void;
}

const StudentFilter = ({ students, setFilteredStudents }: Props) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedGrade, setSelectedGrade] = useState("All");
    const [statusFilter, setStatusFilter] = useState("All");

    const handleFilterChange = () => {
        let filtered = students;

        if (searchTerm) {
            filtered = filtered.filter(student =>
                student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                student.email.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (selectedGrade !== "All") {
            filtered = filtered.filter(student => student.grade === selectedGrade);
        }

        if (statusFilter !== "All") {
            filtered = filtered.filter(student => student.isActive === (statusFilter === "Active"));
        }

        setFilteredStudents(filtered);
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-md mb-6 flex flex-wrap gap-4">
            {/* Search Field */}
            <input
                type="text"
                placeholder="Search by Name or Email"
                className="border p-2 rounded w-60"
                value={searchTerm}
                onChange={(e) => {
                    setSearchTerm(e.target.value);
                    handleFilterChange();
                }}
            />

            {/* Grade Filter */}
            <label htmlFor="gradeFilter" className="sr-only">Filter by Grade</label>
            <select
                id="gradeFilter"
                className="border p-2 rounded"
                value={selectedGrade}
                onChange={(e) => {
                    setSelectedGrade(e.target.value);
                    handleFilterChange();
                }}
            >
                <option value="All">All Grades</option>
                {[...new Set(students.map(s => s.grade))].map(grade => (
                    <option key={grade} value={grade}>{grade}</option>
                ))}
            </select>

            {/* Status Filter */}
            <label htmlFor="statusFilter" className="sr-only">Filter by Status</label>
            <select
                id="statusFilter"
                className="border p-2 rounded"
                value={statusFilter}
                onChange={(e) => {
                    setStatusFilter(e.target.value);
                    handleFilterChange();
                }}
            >
                <option value="All">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
            </select>
        </div>
    );
};

export default StudentFilter;
