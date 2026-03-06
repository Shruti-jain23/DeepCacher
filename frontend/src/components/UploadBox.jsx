import { useState } from "react";

export default function UploadBox({ setResult }) {

  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file");
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://127.0.0.1:8000/compress", {
        method: "POST",
        body: formData
      });

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const result = {
        name: file.name,
        original_size: file.size,
        compressed_size: blob.size,
        url: url,
      };

      setResult(result);
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-6 border rounded-xl flex flex-col gap-4 w-96 shadow-lg bg-white">

      {/* Custom File Input */}
      <label className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded text-center">
        {file ? file.name : "Choose File"}
        <input
          type="file"
          className="hidden"
          onChange={(e) => setFile(e.target.files[0])}
        />
      </label>

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        disabled={uploading}
        className={`px-6 py-2 rounded text-white font-semibold transition-colors ${
          uploading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-green-500 hover:bg-green-600"
        }`}
      >
        {uploading ? "Compressing..." : "Compress File"}
      </button>

    </div>
  );
}
