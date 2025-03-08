// src/components/StudentTable.tsx
import { Student } from "../types/Student";

interface Props {
    students: Student[];
}

const StudentTable = ({ students }: Props) => {
    return (
        <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-200">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="border p-2">ID</th>
                        <th className="border p-2">Name</th>
                        <th className="border p-2">Email</th>
                        <th className="border p-2">Grade</th>
                        <th className="border p-2">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map(student => (
                        <tr key={student.id} className="text-center">
                            <td className="border p-2">{student.id}</td>
                            <td className="border p-2">{student.firstName} {student.lastName}</td>
                            <td className="border p-2">{student.email}</td>
                            <td className="border p-2">{student.grade}</td>
                            <td className="border p-2">
                                {student.isActive ? (
                                    <span className="text-green-600 font-semibold">Active</span>
                                ) : (
                                    <span className="text-red-600 font-semibold">Inactive</span>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default StudentTable;
