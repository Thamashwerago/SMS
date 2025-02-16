import { useState } from "react";
import PropTypes from "prop-types";
import { uploadProfilePicture } from "../api/api";

const FileUpload = ({ studentId }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a file first.");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);

    try {
      await uploadProfilePicture(studentId, formData);
      setMessage("File uploaded successfully!");
    } catch (error) {
      console.error("Error uploading file:", error);
      setMessage("Failed to upload file.");
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-lg font-bold mb-4">Upload Profile Picture</h2>

      {/* File Input */}
      <input type="file" onChange={handleFileChange} className="mb-4 p-2 border border-gray-300 rounded-lg" />

      {/* Preview Image */}
      {preview && <img src={preview} alt="Preview" className="w-32 h-32 rounded-lg mb-4" />}

      {/* Upload Button */}
      <button onClick={handleUpload} className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700">
        Upload
      </button>

      {/* Status Message */}
      {message && <p className="mt-2 text-sm text-gray-600">{message}</p>}
    </div>
  );
};
FileUpload.propTypes = {
  studentId: PropTypes.string.isRequired,
};

export default FileUpload;
