import React from "react";

export default function ResultCard({ result }) {
  if (!result) return null;

  const isFolder = result.files && result.files.length > 0;


  const formatSize = (size) => {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
    return `${(size / 1024 / 1024).toFixed(2)} MB`;
  };

  return (
    <div className="bg-green-100 p-6 rounded-xl mt-6 w-96 mx-auto shadow-lg">
      <h2 className="text-lg font-bold mb-4">Compression Complete</h2>

      {isFolder ? (
        <div className="max-h-64 overflow-y-auto">
          {result.files.map((file, idx) => {
            const ratio = (file.original_size / file.compressed_size).toFixed(2);
            return (
              <div key={idx} className="mb-4 border-b pb-2">
                <p className="mb-1 font-semibold break-all">{file.filename}</p>
                <p className="text-sm">Original: {formatSize(file.original_size)}</p>
                <p className="text-sm">Compressed: {formatSize(file.compressed_size)}</p>
                <p className="text-sm">Ratio: {ratio}x</p>

                <div className="mt-1 w-full bg-gray-200 h-3 rounded">
                  <div
                    className="bg-blue-500 h-3 rounded transition-all duration-300"
                    style={{ width: `${(file.compressed_size / file.original_size) * 100}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <>
          <p className="mb-2 font-semibold break-all">{result.name}</p>
          <p>Original Size: {formatSize(result.original_size)}</p>
          <p>Compressed Size: {formatSize(result.compressed_size)}</p>
          <p>Compression Ratio: {(result.original_size / result.compressed_size).toFixed(2)}x</p>

          <div className="mt-2 w-full bg-gray-200 h-4 rounded relative">
            <div
              className="bg-blue-500 h-4 rounded transition-all duration-300"
              style={{ width: `${(result.compressed_size / result.original_size) * 100}%` }}
            />
          </div>
        </>
      )}

      {/* Download button */}
      {isFolder ? (
        result.download_url && (
          <a
            href={result.download_url}
            download={result.output_file}
            className="bg-green-600 text-white px-6 py-2 rounded-lg mt-4 inline-block hover:bg-green-700 transition-colors"
          >
            Download Compressed Folder
          </a>
        )
      ) : (
        result.url && (
          <a
            href={result.url}
            download={result.name.endsWith(".deepcacher") ? result.name : result.name + ".deepcacher"}
            className="bg-green-600 text-white px-6 py-2 rounded-lg mt-4 inline-block hover:bg-green-700 transition-colors"
          >
            Download Compressed File
          </a>
        )
      )}
    </div>
  );
}
