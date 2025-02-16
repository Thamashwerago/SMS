import { exportStudents } from "../api/api";

const ExcelDownload = () => {
  const handleDownload = async () => {
    try {
      const response = await exportStudents();
      const blob = new Blob([response.data], { type: response.headers["content-type"] });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "students.xlsx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error exporting students:", error);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-lg font-bold mb-4">Export Students to Excel</h2>

      <button onClick={handleDownload} className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700">
        Download
      </button>
    </div>
  );
};

export default ExcelDownload;
