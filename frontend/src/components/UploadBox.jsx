import { useState } from "react";

export default function UploadBox() {

  const [file, setFile] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState(null);

  const handleUpload = async () => {

    if (!file) {
      alert("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {

      const response = await fetch("http://127.0.0.1:8000/compress", {
        method: "POST",
        body: formData
      });

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      setDownloadUrl(url);

    } catch (error) {
      console.error("Upload error:", error);
    }
  };

  return (
    <div className="p-6 border rounded-xl flex flex-col gap-4">

      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button
        onClick={handleUpload}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Compress File
      </button>

      {downloadUrl && (
        <a
          href={downloadUrl}
          download={"compressed_" + file.name}
          className="text-blue-600 underline"
        >
          Download Compressed File
        </a>
      )}

    </div>
  );
}