// src/components/StudentCard.tsx
interface Props {
    title: string;
    count: number;
}

const StudentCard = ({ title, count }: Props) => {
    return (
        <div className="bg-blue-500 text-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold">{title}</h2>
            <p className="text-2xl font-bold">{count}</p>
        </div>
    );
};

export default StudentCard;
