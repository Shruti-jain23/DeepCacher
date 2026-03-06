import { useState } from "react";

export default function UploadBox({ setResult }) {
  const [files, setFiles] = useState([]); // array to store files
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (!files || files.length === 0) {
      alert("Please select a file or folder");
      return;
    }

    setUploading(true);

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file); 
    });

    try {
      const response = await fetch("http://127.0.0.1:8000/compress", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setResult(data); 
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-6 border rounded-xl flex flex-col gap-4 w-96 shadow-lg bg-white">
      {/* Single File Selection */}
      <label className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded text-center transition-colors">
        Select Single File
        <input
          type="file"
          className="hidden"
          onChange={(e) => setFiles(Array.from(e.target.files))}
        />
      </label>

      {/* Folder Selection */}
      <label className="cursor-pointer bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded text-center transition-colors">
        Select Folder
        <input
          type="file"
          className="hidden"
          multiple
          webkitdirectory="true"
          directory="true"
          onChange={(e) => setFiles(Array.from(e.target.files))}
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
        {uploading ? "Compressing..." : "Compress File / Folder"}
      </button>

      {/* Show selected files */}
      {files.length > 0 && (
        <p className="text-sm text-gray-600 mt-2 break-all">
          Selected: {files.map((f) => f.name).join(", ")}
        </p>
      )}
    </div>
  );
}

    </div>
  );
}
