// src/components/StudentChart.tsx
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Student } from "../types/Student";

interface Props {
    students: Student[];
}

const COLORS = ["#4CAF50", "#F44336"]; // Green for Active, Red for Inactive

const StudentChart = ({ students }: Props) => {
    // Data for Pie Chart (Active vs Inactive)
    const statusData = [
        { name: "Active", value: students.filter(s => s.isActive).length },
        { name: "Inactive", value: students.filter(s => !s.isActive).length },
    ];

    // Data for Bar Chart (Students per Grade)
    const gradeData = students.reduce((acc: Record<string, number>, student) => {
        acc[student.grade] = (acc[student.grade] || 0) + 1;
        return acc;
    }, {});

    const barChartData = Object.keys(gradeData).map(grade => ({
        grade,
        count: gradeData[grade],
    }));

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
            {/* Pie Chart: Active vs Inactive */}
            <div className="bg-white p-4 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold mb-4">Student Status</h2>
                <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                        <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                            {statusData.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            {/* Bar Chart: Students per Grade */}
            <div className="bg-white p-4 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold mb-4">Student Distribution by Grade</h2>
                <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={barChartData}>
                        <XAxis dataKey="grade" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" fill="#2196F3" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default StudentChart;
