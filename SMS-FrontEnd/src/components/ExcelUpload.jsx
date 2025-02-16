import { useState } from "react";
import { importStudents } from "../api/api";

const ExcelUpload = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a file first.");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);

    try {
      await importStudents(formData);
      setMessage("Students imported successfully!");
    } catch (error) {
      console.error("Error importing file:", error);
      setMessage("Failed to import students.");
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-lg font-bold mb-4">Import Students from Excel</h2>

      <input type="file" onChange={handleFileChange} className="mb-4 p-2 border border-gray-300 rounded-lg" />

      <button onClick={handleUpload} className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700">
        Upload
      </button>

      {message && <p className="mt-2 text-sm text-gray-600">{message}</p>}
    </div>
  );
};

export default ExcelUpload;
