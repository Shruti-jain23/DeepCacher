export default function ResultCard({ result }) {
  if (!result) return null;

  const { original_size, compressed_size, name } = result;
  const ratio = (original_size / compressed_size).toFixed(2);

  // Helper to format file sizes
  const formatSize = (size) => {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
    return `${(size / 1024 / 1024).toFixed(2)} MB`;
  };

  return (
    <div className="bg-green-100 p-6 rounded-xl mt-6 text-center w-96 mx-auto">
      <h2 className="text-lg font-bold mb-4">Compression Complete</h2>

      <p className="mb-2 font-semibold">{name}</p>

      <p>Original Size: {formatSize(original_size)}</p>
      <p>Compressed Size: {formatSize(compressed_size)}</p>
      <p>Compression Ratio: {ratio}x</p>

      {/* File size */}
      <div className="mt-4 w-full bg-gray-200 h-4 rounded relative">
        <div
          className="bg-blue-500 h-4 rounded"
          style={{ width: `${(compressed_size / original_size) * 100}%` }}
        />
      </div>
      <p className="text-sm text-gray-500 mt-1">Blue = Compressed Size</p>

      {result.url && (
        <a
          href={result.url}
          download={"compressed_" + name}
          className="bg-green-600 text-white px-6 py-2 rounded-lg mt-4 inline-block"
        >
          Download Compressed File
        </a>
      )}
    </div>
  );
}
