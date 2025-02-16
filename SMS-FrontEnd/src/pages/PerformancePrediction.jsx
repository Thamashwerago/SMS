import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { getPredictions } from "../api/api";

const PerformancePrediction = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchPredictions();
  }, []);

  const fetchPredictions = async () => {
    try {
      const { data } = await getPredictions();
      const formattedData = data.students.map((s) => ({
        name: s.name,
        score: s.predictedScore,
      }));
      setData(formattedData);
    } catch (error) {
      console.error("Error fetching predictions:", error);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">AI-Based Performance Prediction</h2>

      <div className="bg-white p-6 rounded-lg shadow">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="score" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PerformancePrediction;
